import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Trash2, Brain, Bot, User, MapPin } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatViewProps {
  onTelemetryUpdate: (data: any) => void;
}

export function ChatView({ onTelemetryUpdate }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am WeatherAI, your real-time meteorological intelligence agent powered by OpenAI intent parsing and verified Open-Meteo observational telemetry. Ask me about precipitation windows, severe squall lines, micro-climates, or historical anomaly comparisons.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content })
      });
      
      const data = await res.json();
      
      if (data.telemetry) {
        onTelemetryUpdate(data.telemetry);
      }
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'An error occurred.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-12 xl:col-span-8 row-span-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-[calc(100vh-140px)]">
      {/* Session Context */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-200">AI Weather Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span className="text-xs text-slate-400">GPT-4o</span>
        </div>
      </div>

      {/* Chat Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-sky-600/20 text-sky-100 rounded-2xl rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-sky-400/70' : 'text-slate-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="relative flex items-center gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-slate-950 border border-slate-800 rounded-full py-3 px-5 text-xs focus:outline-none focus:border-sky-500 text-slate-200 placeholder-slate-500"
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()} 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
