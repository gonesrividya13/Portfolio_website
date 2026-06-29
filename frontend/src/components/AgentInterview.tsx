import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AgentInterview: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string}[]>([
    { role: 'agent', content: "Hi! I'm Vidya's AI twin. I know all about his past projects, code style, and resume. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'agent', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'agent', content: "I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="interview" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass relative overflow-hidden rounded-4xl p-10 md:p-16"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-slate-900/10 dark:bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-neutral-400/20 blur-3xl"></div>
        
        <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold md:text-5xl font-display">
              Talk to my <span className="text-gradient">AI twin</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
              My autonomous agent is trained on my past projects, code style, and resume. Ask it anything about my experience.
            </p>
          </div>
          
          <div className="glass rounded-3xl flex flex-col h-[500px] bg-slate-100/50 dark:bg-black/40 border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 p-4 bg-black/5 dark:bg-white/5">
              <div className="bg-black/10 dark:bg-white/10 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-black dark:text-white" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white">Vidya's AI</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-black dark:text-white" />
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black rounded-tr-sm' 
                        : 'bg-black/5 dark:bg-white/10 text-black dark:text-white rounded-tl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-black dark:text-white" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 rounded-tl-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-500 dark:text-neutral-400" />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Typing...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-black/5 dark:border-white/5">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my skills..."
                  className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-slate-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
