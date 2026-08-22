import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCivic } from '../context/CivicContext';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, X, MessageCircle, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  { keywords: ['report', 'complaint', 'file', 'issue', 'grievance'], response: 'To report a civic issue, go to the Report page. You can select a category (pothole, streetlight, drainage, garbage, etc.), add a description, pin the location on the map, and submit. Our AI will auto-detect duplicates and route it to the right department!' },
  { keywords: ['track', 'status', 'ticket', 'progress'], response: 'Visit the Track page to see live progress of all civic complaints. You can search by ticket ID, filter by status (Received, In Progress, Resolved), and see assigned departments and SLA timelines.' },
  { keywords: ['vote', 'budget', 'ballot', 'funding'], response: 'The Vote page lets you participate in participatory budgeting! Cast your vote on community proposals. When a proposal reaches its target votes, it gets funded by the municipality. Your vote directly shapes your ward\'s infrastructure.' },
  { keywords: ['hotspot', 'cluster', 'map', 'spatial'], response: 'The Hotspots page shows spatial intelligence — citizen complaints that cluster in the same area form hotspots. These high-impact zones are prioritized for capital funding and can be converted into budget proposals.' },
  { keywords: ['analytics', 'data', 'charts', 'stats'], response: 'Check the Analytics page for municipal performance dashboards — department-wise resolution rates, ward rankings, priority distributions, and weekly activity trends. Data-driven governance!' },
  { keywords: ['department', 'route', 'dispatch'], response: 'When you file a complaint, CivicLoop auto-routes it to the appropriate department (PWD, Electricity, Water Board, etc.) based on the issue category. Each department has defined SLA timelines for resolution.' },
  { keywords: ['language', 'hindi', 'translate'], response: 'CivicLoop supports 8 Indian languages: English, Hindi, Odia, Tamil, Telugu, Kannada, Marathi, and Bengali. Use the language selector in the navbar to switch.' },
  { keywords: ['city', 'location', 'ward'], response: 'CivicLoop works across 7 major Indian cities: Bengaluru, Delhi, Mumbai, Hyderabad, Bhubaneswar, Cuttack, and Pune. Select your city from the dropdown in the navbar.' },
  { keywords: ['duplicate', 'similar', 'ai'], response: 'Our AI Duplicate Guard detects similar complaints using keyword matching and geospatial proximity. If a similar issue exists nearby, you can upvote it instead of creating a duplicate, boosting its priority!' },
  { keywords: ['sos', 'emergency', 'urgent'], response: 'For urgent civic emergencies like open manholes, gas leaks, or major water bursts, file a report with "Critical" priority. These get immediate attention and faster SLA timelines from the assigned department.' },
  { keywords: ['hello', 'hi', 'hey'], response: 'Hello! 👋 I\'m CivicLoop AI Assistant. I can help you with reporting issues, tracking complaints, voting on proposals, understanding analytics, and more. What would you like to know?' },
  { keywords: ['help', 'what can you do'], response: 'I can help you:\n• Report civic issues (potholes, streetlights, drainage, etc.)\n• Track complaint status\n• Vote on community proposals\n• Understand hotspot clusters\n• Navigate analytics\n• Switch languages and cities\n\nJust ask me anything!' },
];

const QUICK_ACTIONS = [
  { label: 'Report Issue', route: '/report', icon: '📝' },
  { label: 'Track Status', route: '/track', icon: '🔍' },
  { label: 'Vote', route: '/vote', icon: '🗳️' },
  { label: 'Hotspots', route: '/hotspots', icon: '🔥' },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }
  return 'I\'m not sure about that, but I can help with reporting issues, tracking complaints, voting on proposals, or understanding analytics. Try asking about one of those topics!';
}

export const AIChatbot: React.FC = () => {
  const { t, language } = useCivic();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Welcome to CivicLoop AI! 🇮🇳 I can help you report issues, track complaints, vote on proposals, and more. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { startX: clientX, startY: clientY, startPosX: position.x, startPosY: position.y };
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRef.current.startX;
      const dy = clientY - dragRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, dragRef.current.startPosX - dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 500, dragRef.current.startPosY - dy));
      setPosition({ x: newX, y: newY });
    };

    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div ref={containerRef} className="fixed z-[60] font-sans" style={{ right: position.x, bottom: position.y }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-20 right-0 w-[340px] sm:w-[380px] h-[480px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with drag handle */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white cursor-move select-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 opacity-60" />
                <Bot className="w-5 h-5" />
                <div>
                  <span className="text-sm font-bold">CivicLoop AI</span>
                  <span className="text-[10px] ml-1.5 opacity-80">● Online</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md border border-slate-200'
                  }`}>
                    {msg.sender === 'bot' && <Bot className="w-3.5 h-3.5 text-orange-500 inline mr-1.5 mb-0.5" />}
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto">
              {QUICK_ACTIONS.map(qa => (
                <button
                  key={qa.route}
                  type="button"
                  onClick={() => { navigate(qa.route); setIsOpen(false); }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-[11px] font-semibold text-slate-700 hover:text-orange-800 transition-all whitespace-nowrap flex items-center gap-1"
                >
                  <span>{qa.icon}</span>
                  <span>{qa.label}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about CivicLoop..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating circular button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
          isOpen
            ? 'bg-slate-700 text-white'
            : 'bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:scale-105'
        }`}
        style={{ animation: isOpen ? 'none' : 'ctaPulseGlow 3s ease-in-out infinite' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
