import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

class GroqService {
  constructor() {
    this.groq = GROQ_API_KEY
      ? new Groq({
          apiKey: GROQ_API_KEY,
          dangerouslyAllowBrowser: true, // For React frontend
        })
      : null;
  }

  async chat({ message, history = [], module = 'general' }) {
    if (!this.groq) {
      throw new Error('Missing Groq API key');
    }

    const systemPrompt = this.getSystemPrompt(module);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    try {
      const completion = await this.groq.chat.completions.create({
        messages: messages,
        model: 'llama3-70b-8192', // Free ultra-fast model
        temperature: 0.7,
        max_tokens: 500,
      });

      return {
        reply: completion.choices[0].message.content
      };

    } catch (error) {
      console.error('Groq error:', error);
      throw new Error('Unable to get response. Please try again.');
    }
  }

  getSystemPrompt(module) {
    const prompts = {
      groups: `You are a helpful university study group assistant. Provide concise, actionable advice on creating and managing study groups.`,

      resources: `You are a university resource assistant. Help students organize and share study materials effectively.`,

      skills: `You are a skill-matching assistant. Help students create profiles and find study partners.`,

      progress: `You are an academic progress assistant. Help students track performance and create improvement plans.`,

      kuppi: `You are a tutoring assistant. Help with professional ads and enrollment decisions.`,

      default: `You are a helpful university student assistant.`
    };

    return prompts[module] || prompts.default;
  }
}

export const groqService = new GroqService();
