// src/components/ChatWindow.jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Loader2, AlertCircle } from 'lucide-react';

const ChatBubble = ({ message, isUser, isTyping }) => {
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-violet-glass to-violet-light shadow-glow-violet' 
            : message?.isError
            ? 'bg-gradient-to-br from-red-500 to-red-600'
            : 'bg-gradient-to-br from-amber-glow to-amber-dark shadow-glow-amber'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : message?.isError ? (
          <AlertCircle className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`px-4 md:px-5 py-3 rounded-2xl backdrop-blur-glass shadow-glass relative ${
            isUser
              ? 'bg-gradient-to-br from-violet-glass/20 to-violet-light/10 border border-violet-glass/30'
              : message?.isError
              ? 'bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30'
              : 'bg-gradient-to-br from-obsidian-800/60 to-obsidian-700/40 border border-obsidian-600/50'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-amber-glow animate-spin" />
              <span className="text-gray-400 text-sm">AI is thinking...</span>
            </div>
          ) : (
            <p className={`leading-relaxed whitespace-pre-wrap break-words text-sm md:text-base ${
              message?.isError ? 'text-red-300' : 'text-gray-100'
            }`}>
              {message?.text || ''}
            </p>
          )}
        </motion.div>
        
        {/* Timestamp */}
        {message?.timestamp && (
          <span className="text-xs text-gray-500 mt-1.5 px-2">
            {message.timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const ChatWindow = ({ messages, isTyping, sidebarOpen }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div 
      ref={chatContainerRef}
      className={`flex-1 overflow-y-auto px-4 md:px-6 py-8 pb-32 transition-all duration-300 ${
        sidebarOpen ? 'md:ml-72' : 'ml-0'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !isTyping ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 md:w-24 md:h-24 mb-6 bg-gradient-to-br from-amber-glow to-amber-dark rounded-3xl flex items-center justify-center shadow-glow-amber"
              >
                <Bot className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-glow to-amber-light mb-3">
                Welcome to Nurobux AI
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-md">
                Ask me anything. I'm here to help you with information, ideas, and conversations.
              </p>
              
              {/* Example Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl w-full">
                {[
                  'Explain quantum computing',
                  'Write a creative story',
                  'Help me learn Python',
                  'Plan my day efficiently'
                ].map((prompt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      borderColor: 'rgba(255, 107, 53, 0.3)'
                    }}
                    className="px-4 py-3 bg-obsidian-800/50 border border-obsidian-700 rounded-xl text-sm text-gray-300 cursor-pointer transition-all backdrop-blur-glass"
                  >
                    {prompt}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isUser={message.isUser}
                />
              ))}
              
              {isTyping && (
                <ChatBubble
                  key="typing"
                  message={{ text: '', timestamp: '' }}
                  isUser={false}
                  isTyping={true}
                />
              )}
            </>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
