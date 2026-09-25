import React, { useState, useEffect, useRef } from 'react';
import { askAITutor } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { ChatMessage } from '../../types';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic: string;
  currentOrganelle?: string;
  initialPrompt?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Why is the nucleus called the control center?",
  "What is the difference between Rough ER and Golgi?",
  "Explain how mitochondria make ATP in simple words",
  "What should I remember for an exam on cell organelles?",
  "What happens if lysosomes rupture inside a cell?"
];

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  contextTopic,
  currentOrganelle,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello! I'm your BioSphere AI Biology Tutor. We're currently studying **${contextTopic}**${currentOrganelle ? ` with focus on the **${currentOrganelle}**` : ''}. Ask me anything about cellular mechanisms, exam tips, or real-life analogies!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: DEFAULT_SUGGESTIONS.slice(0, 3)
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle initialPrompt if provided when opening
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await askAITutor(q, contextTopic, currentOrganelle, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: res.suggestedQuestions,
        isFallback: res.isFallback
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Tutor error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: "I encountered a minor network blip while analyzing that cellular process. In summary: every cell organelle works cooperatively to preserve cellular homeostasis. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      speechService.speak(text);
    }
  };

  const handleResetChat = () => {
    speechService.stop();
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: `Chat refreshed! What cellular biology concept would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: DEFAULT_SUGGESTIONS.slice(0, 3)
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl h-[88vh] max-h-[720px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">BioSphere AI Tutor</h3>
                <span className="text-[10px] bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Context: <span className="font-semibold text-white">{contextTopic}</span>
                {currentOrganelle && <span> • Focus: <span className="text-cyan-300">{currentOrganelle}</span></span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              title="Clear conversation"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.role === 'user';

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {m.text}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] opacity-75">
                    <span>{m.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleReadAloud(m.text)}
                        className="flex items-center gap-1 hover:opacity-100 font-medium transition-opacity"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-600">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Smart Follow-up Suggestions */}
                  {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {m.suggestedQuestions.map((sq, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sq)}
                            className="text-left text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <span>{sq}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-slate-600 font-medium ml-1">Analyzing biological concept with Gemini AI...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything about ${currentOrganelle || contextTopic}...`}
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none text-[11px] text-slate-500">
            <span className="shrink-0 font-medium">Quick:</span>
            <button
              type="button"
              onClick={() => handleSend("Explain this simply")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 shrink-0 transition-colors"
            >
              Explain Simply
            </button>
            <button
              type="button"
              onClick={() => handleSend("Give me an example")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 shrink-0 transition-colors"
            >
              Give Example
            </button>
            <button
              type="button"
              onClick={() => handleSend("What should I remember for an exam?")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 shrink-0 transition-colors"
            >
              Exam Tips
            </button>
            <button
              type="button"
              onClick={() => handleSend(`Quiz me on ${currentOrganelle || contextTopic}`)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 shrink-0 transition-colors"
            >
              Quiz Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
