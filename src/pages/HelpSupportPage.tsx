import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, AlertTriangle, ChevronRight } from 'lucide-react';

const items = [
  { icon: HelpCircle, label: 'FAQs', desc: 'Find answers to common questions', path: '/faqs' },
  { icon: MessageSquare, label: 'Contact Support', desc: 'Send a message to our team', path: '/contact-support' },
  { icon: AlertTriangle, label: 'Report a Problem', desc: 'Report issues with bookings', path: '/report-problem' },
];

const HelpSupportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
      </div>

      <div className="px-5 space-y-3">
        {items.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(item.path)}
            className="w-full glass-card p-4 flex items-center gap-4 text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-foreground block">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.desc}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HelpSupportPage;
