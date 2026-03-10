import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReviewPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) { toast.error('Please select a rating'); return; }
    toast.success('Review submitted!');
    navigate('/appointments');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Leave a Review</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5"
      >
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">How was your experience?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-90"
              >
                <Star
                  size={36}
                  className={`transition-colors ${
                    star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-primary mt-2"
            >
              {rating <= 2 ? 'We\'re sorry to hear that' : rating <= 4 ? 'Good experience!' : 'Excellent!'}
            </motion.p>
          )}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience..."
          className="w-full h-32 bg-secondary rounded-2xl p-4 text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <button
          onClick={handleSubmit}
          className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg mt-6 active:scale-[0.97] transition-transform"
        >
          Submit Review
        </button>
      </motion.div>
    </div>
  );
};

export default ReviewPage;
