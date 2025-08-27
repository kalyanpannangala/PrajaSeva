// app/chatbot/page.tsx
'use client';

import { useState, useEffect, useRef, FC } from 'react';
import type { NextPage } from 'next';
import { Bot, User, Send, Loader2, Landmark, BarChart3, Zap, Mail } from 'lucide-react';
import Header from '../../../components/Header'; // <-- Import the dedicated header
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import withAuth from '../../../components/withAuth';

// --- Type definitions for chat messages ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isToolRedirect?: boolean; // Property for tool redirect buttons
  toolPath?: string;
  isErrorWithContact?: boolean; // --- NEW: Property for the contact button ---
}

const ChatbotPage: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I am PrajaSeva AI. How can I assist you today with schemes, tax, or wealth questions?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- Function to scroll to the latest message ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Handle sending a message ---
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ question: currentInput })
        });

        if (!response.ok) {
            throw new Error('Failed to get a response from the server.');
        }

        const data = await response.json();
        let botResponse: Message = {
            id: Date.now() + 1,
            text: data.answer,
            sender: 'bot',
        };
        
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
        // --- FIX: Create a special error message object ---
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Sorry, I'm having trouble connecting to my brain right now. Please ensure you are logged in. If the error persists, please contact support.",
            sender: 'bot',
            isErrorWithContact: true // Set the flag to true
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const suggestedPrompts = [
    "Which tax regime is better for me?",
    "Am I eligible for Sukanya Samriddhi Yojana?",
    "Suggest a low-risk investment plan."
  ];

  return (
    <div className="bg-[#F8F9FA] h-screen font-sans flex flex-col">
      <Header />

      {/* --- Main Chat Content --- */}
      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="bg-white flex-1 flex flex-col rounded-xl shadow-2xl border border-gray-200/80 overflow-hidden">
          {/* --- Message Display Area --- */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#003366]" />
                    </div>
                  )}
                  <div className={`max-w-lg p-4 rounded-2xl ${message.sender === 'user' ? 'bg-[#003366] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p>{message.text}</p>
                    {message.isToolRedirect && (
                        <button 
                            onClick={() => router.push(message.toolPath!)}
                            className="mt-3 flex items-center bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            {message.text.includes("Schemes") && <Landmark className="w-5 h-5 mr-2" />}
                            {message.text.includes("Tax") && <BarChart3 className="w-5 h-5 mr-2" />}
                            {message.text.includes("Wealth") && <Zap className="w-5 h-5 mr-2" />}
                            Go to Tool
                        </button>
                    )}
                    {/* --- FIX: Render a mailto link as a button for the error message --- */}
                    {message.isErrorWithContact && (
                        <a 
                            href="mailto:prajaseva-ai@gmail.com"
                            className="mt-3 inline-flex items-center bg-red-100 text-red-800 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Contact Support
                        </a>
                    )}
                  </div>
                   {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#003366]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
             {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-4"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[#003366]" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* --- Input Area (add flex-shrink-0) --- */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            {messages.length <= 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {suggestedPrompts.map(prompt => (
                        <button key={prompt} onClick={() => handlePromptClick(prompt)} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors">
                            {prompt}
                        </button>
                    ))}
                </div>
            )}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask PrajaSeva AI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="w-full pr-14 py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#003366] transition"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#003366] hover:bg-[#002244] text-white rounded-full h-10 w-10 flex items-center justify-center transition-colors disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(ChatbotPage);
