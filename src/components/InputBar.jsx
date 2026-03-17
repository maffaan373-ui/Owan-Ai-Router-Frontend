// src/components/InputBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Square, Loader2 } from 'lucide-react';

const InputBar = ({ onSendMessage, isLoading, sidebarOpen }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 z-20 ${
      sidebarOpen ? 'md:pl-72' : 'pl-0'
    }`}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-4 md:pb-6">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative"
        >
          {/* Character count / status */}
          <AnimatePresence>
            {message.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-8 right-4 text-xs text-gray-500 bg-obsidian-900/80 px-3 py-1 rounded-full backdrop-blur-glass"
              >
                {message.length} chars
              </motion.div>
            )}
          </AnimatePresence>

          {/* Glass-blur Floating Action Bar */}
          <form onSubmit={handleSubmit} className="relative">
            <motion.div 
              animate={{
                boxShadow: isFocused 
                  ? '0 0 30px rgba(255, 107, 53, 0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                  : '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
              }}
              className={`backdrop-blur-glass bg-obsidian-900/90 border rounded-2xl p-3 md:p-4 transition-all duration-300 ${
                isFocused 
                  ? 'border-amber-glow/50' 
                  : 'border-obsidian-700/50'
              }`}
            >
              <div className="flex items-end gap-2 md:gap-3">
                {/* Auto-expanding Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Message Nurobux AI..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full bg-obsidian-800/50 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-amber-glow/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    style={{
                      maxHeight: '150px',
                      minHeight: '48px',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Voice Button */}
                  <motion.button
                    type="button"
                    onClick={toggleRecording}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 shadow-glow-amber text-white'
                        : 'bg-obsidian-800 hover:bg-obsidian-700 text-gray-400 hover:text-amber-glow'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isRecording ? (
                      <Square className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </motion.button>

                  {/* Send Button */}
                  <motion.button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      opacity: message.trim() ? 1 : 0.5,
                    }}
                    className="p-3 bg-gradient-to-r from-amber-glow to-amber-dark text-white rounded-xl shadow-glow-amber hover:shadow-glow-amber transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </form>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-600 mt-3 md:mt-4"
        >
          AI can make mistakes. Consider checking important information.
        </motion.p>
      </div>
    </div>
  );
};

// AnimatePresence wrapper for conditional rendering
const AnimatePresence = ({ children }) => {
  return <>{children}</>;
};

export default InputBar;
