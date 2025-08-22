import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Send, Bot, User } from 'lucide-react';

export default function ChatbotUI() {
  const { api } = useAuth() || {};
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m MoodMate, your AI wellness assistant. How are you feeling today?',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      let payload;
      if (api && typeof api.post === 'function') {
        const { data } = await api.post('/api/chat', { message: userMessage.content });
        payload = data;
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.content }),
        });
        payload = await res.json();
      }
      
      const aiMessage = { 
        role: 'assistant', 
        content: (payload && payload.reply) || 'No reply received',
        timestamp: new Date(),
        model: payload?.model || 'Unknown',
        provider: payload?.provider || 'AI'
      };
      
      setMessages((m) => [...m, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((m) => [...m, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">MoodMate AI Assistant</h3>
            <p className="text-primary-100 text-sm">Powered by Groq AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
              {m.model && (
                <p className="text-xs opacity-70 mt-2">
                  {m.provider} • {m.model}
                </p>
              )}
            </div>
            
            {m.role === 'user' && (
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How are you feeling today?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}