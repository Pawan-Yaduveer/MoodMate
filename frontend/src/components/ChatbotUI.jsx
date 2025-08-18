import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatbotUI() {
  const { api } = useAuth() || {};
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);
    try {
      let payload;
      if (api && typeof api.post === 'function') {
        const { data } = await api.post('/chat', { message: userMessage.content });
        payload = data;
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.content }),
        });
        payload = await res.json();
      }
      const aiMessage = { role: 'assistant', content: (payload && payload.reply) || 'No reply' };
      setMessages((m) => [...m, aiMessage]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting AI' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '1rem auto', padding: 16, border: '1px solid #333', borderRadius: 8 }}>
      <h2>Chatbot</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#535bf2' : '#1a1a1a', color: 'white', padding: '8px 12px', borderRadius: 12, maxWidth: '80%' }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ opacity: 0.7 }}>Thinking…</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #555' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

