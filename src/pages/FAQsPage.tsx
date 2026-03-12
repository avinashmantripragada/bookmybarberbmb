import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How do I book a haircut?', a: 'Browse barbers or shops from the Home or Search page, select your preferred barber, choose a service, pick a date and time slot, then confirm your booking.' },
  { q: 'How do I cancel a booking?', a: 'Go to My Appointments, find the booking you want to cancel, and tap the Cancel button. Cancellations made at least 2 hours before the appointment are free.' },
  { q: 'How do I reschedule an appointment?', a: 'Open My Appointments, select the booking, and tap Reschedule. Choose a new date and time slot to confirm the change.' },
  { q: 'What happens if the barber cancels?', a: 'If a barber cancels your appointment, you will be notified immediately and any payment made will be refunded to your original payment method within 3–5 business days.' },
  { q: 'How do payments work?', a: 'You can pay using UPI, credit/debit cards, or cash. Online payments are processed securely at the time of booking. You can manage your payment methods from your Profile.' },
  { q: 'Can I choose a specific barber at a shop?', a: 'Yes! When booking at a shop, you can view all available barbers and select the one you prefer before choosing a time slot.' },
  { q: 'How do I leave a review?', a: 'After your appointment is completed, you will receive a prompt to rate and review your barber. You can also leave reviews from your appointment history.' },
];

const FAQsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-4 border-none rounded-xl">
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default FAQsPage;
