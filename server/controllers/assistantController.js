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
      content: [{ type: 'input_text', text: item.content.trim() }],
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
    `The signed-in user is ${user.firstName || 'the student'} ${user.lastName || ''}`.trim() + '.',
    moduleText,
  ].join(' ');
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message, history = [], module: moduleKey } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        message: 'AI assistant is not configured. Add OPENAI_API_KEY in server/.env to enable it.',
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
      return res.status(openAIResponse.status).json({ message: apiMessage });
    }

    const reply = extractResponseText(responseData);

    if (!reply) {
      return res.status(502).json({ message: 'Assistant returned an empty response' });
    }

    return res.json({
      reply,
      model: responseData.model,
      module: moduleKey || null,
    });
  } catch (error) {
    console.error('Assistant chat error:', error);
    return res.status(500).json({ message: 'Failed to process assistant request' });
  }
};

module.exports = {
  chatWithAssistant,
};
