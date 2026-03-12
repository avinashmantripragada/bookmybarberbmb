import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactSupportPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitted(true);
    toast.success('Message sent successfully!');
  };

  const inputClass = 'w-full h-11 px-4 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Contact Support</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5">
        {submitted ? (
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Send size={28} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Message Sent!</h2>
            <p className="text-sm text-muted-foreground">Our support team will contact you shortly.</p>
            <button onClick={() => navigate('/profile')} className="h-11 px-6 gold-gradient rounded-xl text-sm font-medium text-primary-foreground">
              Back to Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputClass} maxLength={100} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className={inputClass} maxLength={255} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" className={inputClass} maxLength={200} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Describe your issue or question..." rows={5} maxLength={1000}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none" />
            </div>
            <button type="submit" className="w-full h-12 gold-gradient rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
              <Send size={16} />
              Send Message
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ContactSupportPage;
