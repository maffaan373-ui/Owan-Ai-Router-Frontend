// src/components/InputBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Square, Loader2 } from 'lucide-react';

const InputBar = ({ onSendMessage, isLoading, sidebarOpen }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
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
    <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ${
      sidebarOpen ? 'pl-72' : 'pl-0'
    }`}>
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative"
        >
          {/* Glass-blur Floating Action Bar */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="backdrop-blur-glass bg-obsidian-900/80 border border-obsidian-700/50 rounded-2xl shadow-glass p-4">
              <div className="flex items-end gap-3">
                {/* Auto-expanding Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Nurobux AI..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full bg-obsidian-800/50 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-amber-glow/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      maxHeight: '150px',
                      minHeight: '48px',
                    }}
                  />
                </div>

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
          </form>

          {/* Character count / status */}
          {message.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-8 right-4 text-xs text-gray-500"
            >
              {message.length} characters
            </motion.div>
          )}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-600 mt-4"
        >
          AI can make mistakes. Consider checking important information.
        </motion.p>
      </div>
    </div>
  );
};

export default InputBar;
