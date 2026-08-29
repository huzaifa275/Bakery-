import React, { useState, useRef, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const BakeryAssistantModal: React.FC = () => {
  const { isAssistantOpen, setIsAssistantOpen, setActiveView } = useBakery();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'Bonjour and welcome to Maison Saint-Honoré. I am your virtual Pâtisserie Sommelier. Whether you are seeking a celebratory entremet recommendation, need allergen guidance, or wish to configure a bespoke celebration cake, how may I assist you today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What cakes do you recommend for a party of 20?',
    'Which sourdough loaves are 100% vegan?',
    'How do I order a custom wedding cake?',
    'What are the atelier hours and delivery rules?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          conversationHistory: historyPayload,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "I am at your service. Please let me know how else I can guide your culinary journey at Maison Saint-Honoré.";

      const modelMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: "Bonjour! I am currently consulting our Head Pastry Chef. Our Parisian croissants, sourdough loaves, and custom cake builders are all ready on our menu. How else may I assist?",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: 'Bonjour! How may I assist your culinary experience at Maison Saint-Honoré today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1F1A16]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C241E] w-full max-w-2xl h-[90vh] max-h-[680px] rounded-2xl shadow-2xl border border-[#E8DFD5] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1F1A16] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#C49258]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#241E19] border border-[#C49258] flex items-center justify-center text-[#C49258]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-[#FAF7F2] flex items-center gap-2">
                <span>Le Sommelier de la Pâtisserie</span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#C49258]/20 text-[#E6C594] border border-[#C49258]/30">
                  AI Concierge
                </span>
              </h3>
              <p className="text-[11px] text-[#A89F95] font-light">
                Grounded in our live atelier recipes, lead times & branch schedules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-full text-[#A89F95] hover:text-[#FAF7F2] hover:bg-[#2C241E] transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1.5 rounded-full text-[#A89F95] hover:text-[#FAF7F2] hover:bg-[#2C241E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F4EFEA]/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-full bg-[#1F1A16] text-[#C49258] border border-[#C49258]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-xl p-3.5 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-[#1F1A16] text-[#FAF7F2] rounded-tr-none'
                    : 'bg-[#FFFFFF] text-[#2C241E] border border-[#E8DFD5] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span
                  className={`block text-[9px] mt-1.5 ${
                    msg.role === 'user' ? 'text-[#A89F95] text-right' : 'text-[#7A6E65]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#C49258] text-[#1F1A16] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start items-center text-[#7A6E65]">
              <div className="w-7 h-7 rounded-full bg-[#1F1A16] text-[#C49258] border border-[#C49258]/40 flex items-center justify-center shrink-0 animate-spin">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-xl px-4 py-2 italic text-[#7A6E65]">
                Consulting atelier catalog and master bakers...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-[#FAF7F2] border-t border-[#E8DFD5] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] bg-[#EFE8DD] hover:bg-[#E5DACD] text-[#4A3F35] hover:text-[#1F1A16] border border-[#DCD1C4] px-3 py-1.5 rounded-full transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD5] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about cakes, ingredients, sourdough fermentation, branches..."
              disabled={isLoading}
              className="flex-1 bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-4 py-3 text-xs text-[#1F1A16] placeholder-[#7A6E65] focus:outline-none focus:border-[#C49258] focus:ring-1 focus:ring-[#C49258]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#C49258]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
