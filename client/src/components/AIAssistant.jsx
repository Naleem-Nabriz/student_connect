import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const groq = GROQ_API_KEY
  ? new Groq({
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  : null;

// ✅ CURRENT WORKING MODELS WITH FALLBACKS (Updated January 2025)
const WORKING_MODELS = [
  'llama-3.3-70b-versatile',    // Newest & best
  'llama-3.1-8b-instant',       // Fast fallback
  'mixtral-8x7b-32768',         // Alternative
  'gemma2-9b-it',               // Last resort
];

const MODULE_CONFIG = {
  '/groups': {
    key: 'groups',
    title: 'Group Assistant',
    subtitle: 'Study groups and collaboration help',
    systemPrompt: 'You are a helpful university study group assistant. Provide concise, actionable advice on creating and managing effective study groups. Keep responses under 200 words.',
    suggestions: [
      'How do I create an effective study group?',
      'What should I write in a group description?',
      'How can I manage members fairly?',
    ],
  },
  '/resources': {
    key: 'resources',
    title: 'Resource Assistant',
    subtitle: 'Sharing and organizing learning resources',
    systemPrompt: 'You are a university resource assistant. Help students organize and share study materials effectively. Keep responses concise and practical.',
    suggestions: [
      'How should I describe a study resource clearly?',
      'What tags should I use for lecture notes?',
      'How do I decide between file and link resources?',
    ],
  },
  '/skills': {
    key: 'skills',
    title: 'Skill Assistant',
    subtitle: 'Profiles, matches, and collaboration guidance',
    systemPrompt: 'You are a skill-matching assistant. Help students create compelling profiles and find study partners. Be encouraging and practical.',
    suggestions: [
      'How do I write a strong skill profile?',
      'What makes a good collaboration request?',
      'How can I find the right study partner?',
    ],
  },
  '/progress': {
    key: 'progress',
    title: 'Progress Assistant',
    subtitle: 'Subjects, records, and improvement planning',
    systemPrompt: 'You are an academic progress assistant. Help students track performance, improve attendance, and create study plans. Be supportive and motivating.',
    suggestions: [
      'How should I track my academic progress?',
      'What should I do if my attendance is low?',
      'Help me create a weekly study improvement plan.',
    ],
  },
  '/academic': {
    key: 'progress',
    title: 'Progress Assistant',
    subtitle: 'Subjects, records, and improvement planning',
    systemPrompt: 'You are an academic progress assistant. Help students track performance and create improvement strategies.',
    suggestions: [
      'How should I track my academic progress?',
      'What should I do if my attendance is low?',
      'Help me create a weekly study improvement plan.',
    ],
  },
  '/kuppi': {
    key: 'kuppi',
    title: 'Kuppi Assistant',
    subtitle: 'Tutoring ads and class decision support',
    systemPrompt: 'You are a tutoring assistant. Help students create professional tutoring ads and make informed enrollment decisions.',
    suggestions: [
      'How do I write a professional kuppi ad?',
      'What details should students check before enrolling?',
      'Explain the ad approval process.',
    ],
  },
};

const getModuleConfig = (pathname) =>
  Object.entries(MODULE_CONFIG).find(([prefix]) => pathname.startsWith(prefix))?.[1] || null;

// ⭐ SMART API CALL WITH AUTO-FALLBACK
const callGroqWithFallback = async (messages, modelIndex = 0) => {
  if (!groq) {
    throw new Error('Missing Groq API key');
  }

  if (modelIndex >= WORKING_MODELS.length) {
    throw new Error('All models failed. Please try again later.');
  }

  const currentModel = WORKING_MODELS[modelIndex];
  console.log(`Trying model: ${currentModel}`);

  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: currentModel,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.warn(`Model ${currentModel} failed:`, error.message);
    
    // If model is decommissioned or fails, try next model
    if (error.message.includes('decommissioned') || 
        error.message.includes('not found') ||
        error.status === 400) {
      return callGroqWithFallback(messages, modelIndex + 1);
    }
    
    throw error;
  }
};

const AIAssistant = () => {
  const location = useLocation();
  const moduleConfig = useMemo(() => getModuleConfig(location.pathname), [location.pathname]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!moduleConfig) {
      setOpen(false);
      setMessages([]);
      setInput('');
      return;
    }

    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hi! I can help with ${moduleConfig.title.toLowerCase()}, give study advice, explain workflows, and suggest next steps. Ask me anything!`,
      },
    ]);
  }, [moduleConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  if (!moduleConfig) {
    return null;
  }

  const submitMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || loading) {
      return;
    }

    const nextUserMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedMessage,
    };

    const chatHistory = [...messages, nextUserMessage]
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput('');
    setLoading(true);

    try {
      // ⭐ SMART API CALL WITH AUTO-FALLBACK
      const apiMessages = [
        { role: 'system', content: moduleConfig.systemPrompt },
        ...chatHistory
      ];

      const assistantReply = await callGroqWithFallback(apiMessages);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: assistantReply,
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = '❌ Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('API key') || error.message.includes('Missing Groq API key')) {
        errorMessage = '🔑 Groq API key missing. Set REACT_APP_GROQ_API_KEY to enable the assistant.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = '⏳ Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('All models failed')) {
        errorMessage = '⚠️ Service temporarily unavailable. Please try again in a few seconds.';
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#2A2D36] bg-[#111217] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2A2D36] bg-gradient-to-r from-[#FF7A00] to-[#FFB800] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{moduleConfig.title}</p>
              <p className="text-xs text-white/90">{moduleConfig.subtitle}</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/15">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto px-4 py-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {moduleConfig.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => submitMessage(suggestion)}
                  disabled={loading}
                  className="rounded-full border border-[#2A2D36] bg-[#1A1C22] px-3 py-1 text-left text-xs text-[#E5E7EB] hover:border-[#FF7A00] hover:text-white disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'ml-8 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white'
                      : 'mr-8 border border-[#2A2D36] bg-[#1A1C22] text-[#E5E7EB]'
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {loading && (
                <div className="mr-8 rounded-2xl border border-[#2A2D36] bg-[#1A1C22] px-4 py-3 text-sm text-[#E5E7EB]">
                  <span className="inline-flex items-center gap-2">
                    <span className="animate-pulse">🤔</span>
                    Thinking through your question...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage(input);
            }}
            className="border-t border-[#2A2D36] bg-[#111217] p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage(input);
                  }
                }}
                rows={2}
                disabled={loading}
                placeholder={`Ask about ${moduleConfig.title.toLowerCase()}...`}
                className="min-h-[60px] flex-1 resize-none rounded-xl border border-[#2A2D36] bg-[#1A1C22] px-3 py-2 text-sm text-white placeholder-[#A0A3BD] focus:border-[#FF7A00] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#2A2D36] bg-[#111217] px-4 py-3 text-white shadow-2xl transition hover:border-[#FF7A00]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB800]">
          {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold">{moduleConfig.title}</p>
          <p className="text-xs text-[#A0A3BD]">AI support for this module</p>
        </div>
        {!open && <Sparkles className="h-4 w-4 text-[#FFB800]" />}
      </button>
    </>
  );
};

export default AIAssistant;
