import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { mockBarbers, mockReviews } from '@/data/mockData';

const BarberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const barber = mockBarbers.find(b => b.id === id);

  if (!barber) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Barber not found</div>;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero */}
      <div className="relative h-48 bg-secondary">
        <div className="absolute inset-0 gold-gradient opacity-20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="absolute -bottom-12 left-5">
          <div className="w-24 h-24 rounded-3xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold text-primary shadow-lg">
            {barber.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 pt-16"
      >
        <h1 className="text-2xl font-bold text-foreground">{barber.name}</h1>
        <p className="text-muted-foreground">{barber.shopName}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-semibold text-foreground">{barber.rating}</span>
            <span className="text-sm text-muted-foreground">({barber.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            {barber.distance}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{barber.about}</p>

        {/* Quick Info */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 glass-card p-3 text-center">
            <MapPin size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{barber.location}</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <Phone size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{barber.phone}</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <Clock size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">9AM - 5PM</p>
          </div>
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="px-5 mt-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-3">Services</h2>
        <div className="space-y-2">
          {barber.services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/booking/${barber.id}?service=${service.id}`)}
              className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div>
                <p className="font-medium text-foreground">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.duration} min</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold gold-text">₹{service.price}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="px-5 mt-8"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
          <button className="text-sm text-primary font-medium">See all</button>
        </div>
        <div className="space-y-3">
          {mockReviews.slice(0, 3).map((review) => (
            <div key={review.id} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                  {review.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">{review.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Book CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={() => navigate(`/booking/${barber.id}`)}
          className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default BarberProfilePage;
