import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const issueTypes = [
  'Booking problem',
  'Payment issue',
  'Refund request',
  'Barber not available',
  'Technical issue',
];

const ReportProblemPage = () => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType || !message.trim()) {
      toast.error('Please select an issue type and describe the problem');
      return;
    }
    setSubmitted(true);
    toast.success('Report submitted successfully!');
  };

  const inputClass = 'w-full h-11 px-4 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Report a Problem</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5">
        {submitted ? (
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Report Submitted!</h2>
            <p className="text-sm text-muted-foreground">Our support team will contact you shortly.</p>
            <button onClick={() => navigate('/profile')} className="h-11 px-6 gold-gradient rounded-xl text-sm font-medium text-primary-foreground">
              Back to Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Booking ID (optional)</label>
              <input value={bookingId} onChange={e => setBookingId(e.target.value)} placeholder="e.g. BMB-12345" className={inputClass} maxLength={50} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Issue Type</label>
              <div className="relative">
                <select value={issueType} onChange={e => setIssueType(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="" disabled>Select issue type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe the problem in detail..." rows={5} maxLength={1000}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none" />
            </div>
            <button type="submit" className="w-full h-12 gold-gradient rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              Submit Report
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ReportProblemPage;
