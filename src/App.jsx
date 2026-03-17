// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { sendMessage, generateSessionId, formatTimestamp } from './services/api';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-obsidian-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-obsidian-900/80 backdrop-blur-glass border border-red-500/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-amber-glow to-amber-dark text-white rounded-xl font-medium shadow-glow-amber hover:shadow-glow-amber transition-all duration-300"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Auto-close sidebar on mobile
    return window.innerWidth >= 768;
  });
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize first session
  useEffect(() => {
    createNewSession();
  }, []);

  // Load messages for current session
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages || []);
      }
    }
  }, [currentSessionId, sessions]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createNewSession = () => {
    const newSessionId = generateSessionId();
    const now = new Date();
    
    const newSession = {
      id: newSessionId,
      title: 'New Chat',
      timestamp: formatTimestamp(now),
      messages: [],
      createdAt: now,
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  const updateSessionTitle = (sessionId, firstMessage) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { ...session, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') }
        : session
    ));
  };

  const handleSendMessage = async (messageText) => {
    if (!currentSessionId || !messageText.trim()) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: formatTimestamp(new Date()),
    };

    // Add user message immediately
    const updateMessages = (prevMessages) => [...prevMessages, userMessage];
    setMessages(updateMessages);
    
    // Update session messages
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = [...(session.messages || []), userMessage];
        
        // Update title with first message
        if (updatedMessages.length === 1) {
          updateSessionTitle(currentSessionId, messageText);
        }
        
        return { ...session, messages: updatedMessages };
      }
      return session;
    }));

    // Send to API with error handling
    setIsLoading(true);
    
    try {
      const result = await sendMessage(messageText);
      
      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        text: result.error || result.response || 'No response received',
        isUser: false,
        timestamp: formatTimestamp(new Date()),
        isError: !!result.error,
      };

      // Add AI response
      setMessages(prev => [...prev, aiMessage]);
      
      // Update session messages
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId
          ? { ...session, messages: [...(session.messages || []), aiMessage] }
          : session
      ));
    } catch (error) {
      console.error('Message send error:', error);
      
      // Add error message
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        text: 'Failed to send message. Please check your connection and try again.',
        isUser: false,
        timestamp: formatTimestamp(new Date()),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // If deleting current session, switch to another or create new
    if (sessionId === currentSessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen bg-obsidian-950 text-gray-100 overflow-hidden flex flex-col relative">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-glow/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-glass/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Sidebar */}
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={createNewSession}
          onDeleteSession={handleDeleteSession}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Top Bar */}
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`sticky top-0 z-30 backdrop-blur-glass bg-obsidian-900/80 border-b border-obsidian-700/50 transition-all duration-300 ${
              sidebarOpen ? 'md:ml-72' : 'ml-0'
            }`}
          >
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-obsidian-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>

              <div className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-none">
                {sessions.find(s => s.id === currentSessionId)?.title || 'New Chat'}
              </div>

              <div className="w-9" /> {/* Spacer for centering */}
            </div>
          </motion.header>

          {/* Chat Window */}
          <ChatWindow
            messages={messages}
            isTyping={isLoading}
            sidebarOpen={sidebarOpen}
          />

          {/* Input Bar - Fixed at bottom */}
          <InputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
