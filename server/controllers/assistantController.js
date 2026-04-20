const MODULE_GUIDANCE = {
  groups: {
    label: 'Group Management',
    focus: 'study groups, joining or leaving groups, group capacity, collaboration etiquette, and how to organize group work',
  },
  resources: {
    label: 'Resource Management',
    focus: 'sharing academic materials, writing good resource descriptions, tagging resources, choosing resource types, and rating resources thoughtfully',
  },
  skills: {
    label: 'Skill Matching',
    focus: 'building skill profiles, finding matching study partners, writing collaboration requests, and improving peer collaboration',
  },
  progress: {
    label: 'Academic Progress',
    focus: 'subjects, records, marks, attendance, assignment scores, progress tracking, and study improvement planning',
  },
  kuppi: {
    label: 'Kuppi Ads',
    focus: 'creating tutoring advertisements, understanding approval flow, evaluating class details, and managing tutoring-related questions',
  },
};

const normalizeHistory = (history = []) =>
  history
    .filter((item) => item && typeof item.content === 'string' && ['user', 'assistant'].includes(item.role))
    .slice(-10)
    .map((item) => ({
      role: item.role,
      content: [
        {
          type: item.role === 'assistant' ? 'output_text' : 'input_text',
          text: item.content.trim(),
        },
      ],
    }));

const extractResponseText = (response) => {
  if (!response || !Array.isArray(response.output)) {
    return '';
  }

  return response.output
    .filter((item) => item.type === 'message' && Array.isArray(item.content))
    .flatMap((item) => item.content)
    .filter((contentItem) => contentItem.type === 'output_text' && typeof contentItem.text === 'string')
    .map((contentItem) => contentItem.text)
    .join('\n')
    .trim();
};

const buildInstructions = ({ user, moduleKey }) => {
  const moduleConfig = MODULE_GUIDANCE[moduleKey] || null;
  const moduleText = moduleConfig
    ? `The user is currently working in the "${moduleConfig.label}" area. Focus on ${moduleConfig.focus}.`
    : 'Help the user across the Uni-Connect student platform.';

  return [
    'You are Uni-Connect AI, a professional in-app academic assistant for university students.',
    'Be concise, practical, supportive, and action-oriented.',
    'Prefer step-by-step guidance tailored to the current module.',
    'Do not claim to have completed actions in the app unless the user explicitly says they already did so.',
    'When you give recommendations, keep them grounded in the app features that exist: groups, resources, skill matching, academic progress, and kuppi ads.',
    'If the user asks for planning help, structure the answer clearly.',
    user
      ? `${`The signed-in user is ${user.firstName || 'the student'} ${user.lastName || ''}`.trim()}.`
      : 'The user may be browsing without being signed in, so do not rely on account-specific data.',
    moduleText,
  ].join(' ');
};

const buildFallbackReply = ({ message, moduleKey, user }) => {
  const firstName = user?.firstName || 'there';
  const normalizedMessage = (message || '').trim();
  const moduleConfig = MODULE_GUIDANCE[moduleKey] || null;

  const moduleReplies = {
    groups: [
      'Start with a clear group name, the subject, your goal, and the expected commitment.',
      'Keep the description short but specific: exam prep, weekly study, assignment help, or discussion sessions.',
      'Set a simple rule for attendance, contribution, and respectful communication from the beginning.',
    ],
    resources: [
      'Use a descriptive title, the exact subject, and a short note about what the resource helps with.',
      'Choose tags that match the topic and format, such as notes, past paper, tutorial, or lab material.',
      'If the file is large or updated often, a link can be easier to maintain than uploading new copies.',
    ],
    skills: [
      'List your strongest skills first and describe how you can help other students.',
      'For collaboration requests, mention the goal, timeline, and what kind of partner you need.',
      'The best matches usually come from clear profiles with both strengths and learning goals.',
    ],
    progress: [
      'Track one or two metrics consistently first, like attendance and marks, before adding more detail.',
      'Review weak areas weekly and turn them into short, specific study tasks.',
      'Use recent performance trends to decide whether you need revision, practice, or concept review.',
    ],
    kuppi: [
      'A strong ad should include subject, tutor name, class format, schedule, location, and price.',
      'Students usually look for clarity first, so make the description concrete and easy to scan.',
      'Before enrolling, compare capacity, timing, travel effort, and whether the class matches the syllabus.',
    ],
  };

  const bullets = moduleReplies[moduleKey] || [
    'Be clear about your goal and the next action you want to take in the app.',
    'Use the current module features step by step instead of changing many things at once.',
    'If something feels blocked, simplify the workflow and test one action at a time.',
  ];

  return [
    `Hi ${firstName}, I can still help even though the live AI service is unavailable right now.`,
    moduleConfig
      ? `You are in ${moduleConfig.label}, so here is practical guidance for that area.`
      : 'Here is a practical answer based on the current Uni-Connect features.',
    normalizedMessage ? `For your question, "${normalizedMessage}", I recommend:` : 'I recommend:',
    `1. ${bullets[0]}`,
    `2. ${bullets[1]}`,
    `3. ${bullets[2]}`,
    'If you want, ask a more specific question and I will answer based on the current module.',
  ].join('\n');
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message, history = [], module: moduleKey } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        reply: buildFallbackReply({ message, moduleKey, user: req.user }),
        model: 'local-fallback',
        module: moduleKey || null,
        fallback: true,
      });
    }

    const input = [
      ...normalizeHistory(history),
      {
        role: 'user',
        content: [{ type: 'input_text', text: message.trim() }],
      },
    ];

    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: buildInstructions({ user: req.user, moduleKey }),
        input,
        max_output_tokens: 500,
      }),
    });

    const responseData = await openAIResponse.json();

    if (!openAIResponse.ok) {
      const apiMessage = responseData?.error?.message || 'Failed to generate assistant response';

      // Avoid passing upstream auth/config errors through as app auth failures.
      if (openAIResponse.status === 401 || openAIResponse.status === 403) {
        return res.json({
          reply: buildFallbackReply({ message, moduleKey, user: req.user }),
          model: 'local-fallback',
          module: moduleKey || null,
          fallback: true,
        });
      }

      return res.status(openAIResponse.status).json({ message: apiMessage });
    }

    const reply = extractResponseText(responseData);

    if (!reply) {
      return res.json({
        reply: buildFallbackReply({ message, moduleKey, user: req.user }),
        model: 'local-fallback',
        module: moduleKey || null,
        fallback: true,
      });
    }

    return res.json({
      reply,
      model: responseData.model,
      module: moduleKey || null,
    });
  } catch (error) {
    console.error('Assistant chat error:', error);
    return res.json({
      reply: buildFallbackReply({
        message: req.body?.message,
        moduleKey: req.body?.module,
        user: req.user,
      }),
      model: 'local-fallback',
      module: req.body?.module || null,
      fallback: true,
    });
  }
};

module.exports = {
  chatWithAssistant,
};
