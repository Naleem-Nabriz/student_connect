import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { assistantService } from '../services/assistantService';

const MODULE_CONFIG = {
  '/groups': {
    key: 'groups',
    title: 'Group Assistant',
    subtitle: 'Study groups and collaboration help',
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
    suggestions: [
      'How do I write a professional kuppi ad?',
      'What details should students check before enrolling?',
      'Explain the ad approval process.',
    ],
  },
};

const getModuleConfig = (pathname) =>
  Object.entries(MODULE_CONFIG).find(([prefix]) => pathname.startsWith(prefix))?.[1] || null;

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
        content: `I can help with ${moduleConfig.title.toLowerCase()}, give study advice, explain workflows, and suggest next steps.`,
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

    const nextHistory = [...messages, nextUserMessage]
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await assistantService.chat({
        message: trimmedMessage,
        history: nextHistory.slice(0, -1),
        module: moduleConfig.key,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: error.message,
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
                  className="rounded-full border border-[#2A2D36] bg-[#1A1C22] px-3 py-1 text-left text-xs text-[#E5E7EB] hover:border-[#FF7A00] hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm ${
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
                  Thinking through your question...
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
                rows={2}
                placeholder={`Ask about ${moduleConfig.title.toLowerCase()}...`}
                className="min-h-[60px] flex-1 resize-none rounded-xl border border-[#2A2D36] bg-[#1A1C22] px-3 py-2 text-sm text-white placeholder-[#A0A3BD] focus:border-[#FF7A00] focus:outline-none"
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
