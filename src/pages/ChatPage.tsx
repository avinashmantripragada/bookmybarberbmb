import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'barber';
  time: string;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const barber = (location.state as any)?.barber;
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hi! You can message ${barber?.name || 'the barber'} here. This is a preview of the chat feature.`, sender: 'barber', time: 'Now' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 border-b border-border/50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          {barber?.photo ? (
            <img src={barber.photo} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
              {(barber?.name || 'B').charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground text-sm">{barber?.name || 'Barber'}</p>
            <p className="text-[10px] text-muted-foreground">Usually replies within 1 hour</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
              msg.sender === 'user'
                ? 'gold-gradient text-primary-foreground rounded-br-md'
                : 'bg-secondary text-foreground rounded-bl-md'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border/50 safe-bottom">
        <div className="flex items-center gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-12 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleSend}
            className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center active:scale-[0.95] transition-transform">
            <Send size={18} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
