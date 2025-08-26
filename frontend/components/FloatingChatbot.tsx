// components/FloatingChatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, User, Send, Loader2, Landmark, BarChart3, Zap, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type definitions for chat messages ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isToolRedirect?: boolean;
  toolPath?: string;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I am PrajaSeva AI. How can I assist you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://kalyanpannangala-prajaseva.hf.space/chat/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ question: currentInput })
        });

        if (!response.ok) throw new Error('Failed to get a response.');

        const data = await response.json();
        let botResponse: Message = { id: Date.now() + 1, text: data.answer, sender: 'bot' };
        
        if (data.answer.includes("Schemes Recommender tool")) {
            botResponse.isToolRedirect = true;
            botResponse.toolPath = '/dashboard/schemes';
        } else if (data.answer.includes("Tax Advisory tool")) {
            botResponse.isToolRedirect = true;
            botResponse.toolPath = '/dashboard/tax';
        } else if (data.answer.includes("Wealth Advisory tool")) {
            botResponse.isToolRedirect = true;
            botResponse.toolPath = '/dashboard/wealth';
        }
        setMessages(prev => [...prev, botResponse]);
    } catch (error) {
        const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- Floating Action Button --- */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-[#003366] to-[#0055A4] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 z-50"
      >
        <Bot className="h-8 w-8" />
      </button>

      {/* --- Floating Chat Window --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-[#003366]">PrajaSeva AI</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={() => router.push('/dashboard/chatbot')} className="p-1 text-gray-500 hover:text-[#003366]" title="View in full page">
                        <ExternalLink className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:text-red-600" title="Close chat">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-[#003366]" /></div>}
                  <div className={`max-w-xs p-3 rounded-2xl ${message.sender === 'user' ? 'bg-[#003366] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{message.text}</p>
                    {message.isToolRedirect && (
                        <button onClick={() => router.push(message.toolPath!)} className="mt-2 flex items-center bg-blue-100 text-blue-800 text-sm font-semibold py-1 px-3 rounded-lg hover:bg-blue-200">
                            {message.text.includes("Schemes") && <Landmark className="w-4 h-4 mr-2" />}
                            {message.text.includes("Tax") && <BarChart3 className="w-4 h-4 mr-2" />}
                            {message.text.includes("Wealth") && <Zap className="w-4 h-4 mr-2" />}
                            Go to Tool
                        </button>
                    )}
                  </div>
                  {message.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-[#003366]" /></div>}
                </div>
              ))}
              {isLoading && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-[#003366]" /></div><div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2"><span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span></div></div>}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-50 border-t flex-shrink-0">
              <div className="relative">
                <input type="text" placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading} className="w-full pr-12 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                <button onClick={handleSend} disabled={isLoading} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#003366] hover:bg-[#002244] text-white rounded-full h-8 w-8 flex items-center justify-center disabled:bg-gray-400">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
