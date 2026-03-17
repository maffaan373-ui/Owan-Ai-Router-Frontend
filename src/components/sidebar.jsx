// src/components/Sidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Clock, Trash2, X } from 'lucide-react';

const Sidebar = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose
}) => {
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-72 bg-obsidian-900 border-r border-obsidian-700 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-obsidian-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-glow to-amber-light">
                    Nurobux AI
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Your AI Assistant</p>
                </div>
                {/* Close button for mobile */}
                <button
                  onClick={onClose}
                  className="md:hidden p-2 hover:bg-obsidian-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <motion.button
                onClick={() => {
                  onNewChat();
                  if (window.innerWidth < 768) onClose?.();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-glow to-amber-dark text-white rounded-xl font-medium shadow-glow-amber hover:shadow-glow-amber transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </motion.button>
            </div>

            {/* Session History */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" />
                Recent Chats
              </div>
              
              <motion.div 
                className="space-y-2"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="show"
              >
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => {
                        onSelectSession(session.id);
                        if (window.innerWidth < 768) onClose?.();
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                        currentSessionId === session.id
                          ? 'bg-obsidian-700 shadow-glow-amber'
                          : 'hover:bg-obsidian-800'
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        currentSessionId === session.id 
                          ? 'text-amber-glow' 
                          : 'text-gray-400'
                      }`} />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className={`text-sm font-medium truncate ${
                          currentSessionId === session.id 
                            ? 'text-amber-glow' 
                            : 'text-gray-200'
                        }`}>
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {session.timestamp}
                        </p>
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-obsidian-900 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>

              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No chat history yet
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-obsidian-700">
              <div className="text-xs text-gray-500 text-center">
                Powered by Nurobux AI
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
