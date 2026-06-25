import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from './Avatar';
import { chatWithAvatar } from '../services/api';
import { Mic, MicOff, Volume2, VolumeX, Send, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'recruiter' | 'avatar';
  text: string;
  timestamp: Date;
}

let messageIdCounter = 0;
const generateMessageId = () => {
  return `msg-${Date.now()}-${++messageIdCounter}`;
};

export const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'avatar',
      text: "Hi there! I am Vidya's AI representative. You can type a question, ask me about my projects, or click the mic to speak to me directly!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Keep sendMessage ref updated for event listener usage
  const sendMessageRef = useRef<(text: string) => Promise<void>>(() => Promise.resolve());

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for ask-avatar global events from project cards
  useEffect(() => {
    const handleAsk = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const text = customEvent.detail;
      if (text) {
        sendMessageRef.current(text);
      }
    };
    window.addEventListener('ask-avatar', handleAsk);
    return () => window.removeEventListener('ask-avatar', handleAsk);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text && text.trim()) {
          setInputText(text);
          sendMessageRef.current(text);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setTimeout(() => {
        setRecognition(rec);
      }, 0);
    }
  }, []);

  // Handle Speech Synthesis boundary (speaking state)
  const speakTextNative = (cleanText: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    synthesisUtteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
      || voices.find(v => v.lang.startsWith('en')) 
      || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      setAvatarState('idle');
    };

    utterance.onerror = () => {
      setAvatarState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakText = (text: string) => {
    if (!speechEnabled) return;

    // Cancel any active speech or audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_`#-]/g, ' ').trim();

    // Try playing custom cloned voice from backend endpoint
    const audioUrl = `/api/speech?text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => {
      setAvatarState('speaking');
    };

    audio.onended = () => {
      setAvatarState('idle');
    };

    audio.onerror = () => {
      // Fallback if custom voice is not configured or fails
      speakTextNative(cleanText);
    };

    audio.play().catch((err) => {
      console.warn("Custom voice playback failed, falling back to native TTS:", err);
      speakTextNative(cleanText);
    });
  };

  // Silence avatar on unmount or when sound is toggled off
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleSound = () => {
    if (speechEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
      setSpeechEnabled(false);
      if (avatarState === 'speaking') {
        setAvatarState('idle');
      }
    } else {
      setSpeechEnabled(true);
      // Speak the last message from avatar if present
      const lastAvatarMessage = [...messages].reverse().find(m => m.sender === 'avatar');
      if (lastAvatarMessage) {
        speakText(lastAvatarMessage.text);
      }
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech Recognition API is not supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      // Stop speaking if speaking
      window.speechSynthesis.cancel();
      setAvatarState('idle');
      
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create recruiter message
    const userMsg: Message = {
      id: generateMessageId(),
      sender: 'recruiter',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setAvatarState('thinking');

    try {
      const responseText = await chatWithAvatar(textToSend);
      
      const avatarMsg: Message = {
        id: generateMessageId(),
        sender: 'avatar',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, avatarMsg]);
      setAvatarState('idle');

      // Speak response out loud if sound is enabled
      if (speechEnabled) {
        speakText(responseText);
      }
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMsg: Message = {
        id: generateMessageId(),
        sender: 'avatar',
        text: "I'm having trouble connecting to my service database. Let's try again in a moment, or you can contact Vidya directly below!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setAvatarState('idle');
    }
  };

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const suggestions = [
    "What is your core tech stack?",
    "Tell me about the Microservices E-Commerce project.",
    "Do you have React/TypeScript experience?",
    "How can I contact you for a role?"
  ];

  return (
    <section id="ai-room" className="py-24 relative overflow-hidden bg-slate-900/30">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Title Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-rose-400">
            Meet My AI Double
          </h2>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Interact directly with an intelligent digital representation of me. Ask questions about my background, test stack, or project architectures.
          </p>
        </div>

        {/* Dual Grid Layout: Left is Avatar, Right is Chat panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Avatar Panel */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2">
              {/* Sound Toggle Button */}
              <button 
                onClick={toggleSound}
                title={speechEnabled ? "Mute Voice Output" : "Enable Voice Output"}
                className={`p-2.5 rounded-full border transition-all duration-300 ${
                  speechEnabled 
                    ? 'bg-rose-500/25 border-rose-500/50 text-rose-300' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
            
            <Avatar state={avatarState} />
            
            <div className="mt-6 text-center">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all ${
                avatarState === 'speaking' 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                  : avatarState === 'thinking' 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  avatarState === 'speaking' 
                    ? 'bg-rose-400 animate-ping' 
                    : avatarState === 'thinking' 
                      ? 'bg-purple-400 animate-pulse' 
                      : 'bg-blue-400'
                }`} />
                AI Double: {avatarState}
              </span>
            </div>
          </div>

          {/* Chat Interface Panel */}
          <div className="lg:col-span-7 flex flex-col h-[520px] rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden">
            
            {/* Chat Room Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm tracking-wide text-slate-200">AI Recruiter Chat Room</span>
              </div>
              <button 
                onClick={() => setMessages([
                  {
                    id: 'welcome',
                    sender: 'avatar',
                    text: "Hello again! Let's start fresh. Ask me anything about Vidya's skills or experience.",
                    timestamp: new Date(),
                  }
                ])}
                title="Reset Chat"
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'recruiter'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                      : 'bg-slate-900/60 border border-white/[0.05] text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggestions Chips */}
            <div className="px-6 py-3 border-t border-white/[0.05] bg-slate-950/10 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={avatarState !== 'idle'}
                  className="px-3.5 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/[0.08] text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Action Controls */}
            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/[0.08] bg-slate-950/25 flex items-center gap-2"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Listening..." : "Speak Question"}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isListening 
                    ? 'bg-rose-500/25 border-rose-500/50 text-rose-400 animate-pulse' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Speak now..." : "Ask me anything..."}
                disabled={avatarState !== 'idle'}
                className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || avatarState !== 'idle'}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styles for suggestions bar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
