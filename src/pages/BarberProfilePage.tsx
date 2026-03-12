import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight, Navigation, Circle, Loader2 } from 'lucide-react';
import { useBarber } from '@/hooks/useData';
import ServiceIcon from '@/components/ServiceIcon';
import EmptyState from '@/components/EmptyState';

const BarberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useBarber(id);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Barber not found</div>;

  const { barber, reviews } = data;

  const handleGetDirections = () => {
    const query = encodeURIComponent(barber.address || barber.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-48 bg-secondary">
        <div className="absolute inset-0 gold-gradient opacity-20" />
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="absolute -bottom-12 left-5">
          {barber.photo ? (
            <img src={barber.photo} alt={barber.name} className="w-24 h-24 rounded-3xl border-4 border-background object-cover shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-card border-4 border-background flex items-center justify-center text-3xl font-bold text-primary shadow-lg">{barber.name.charAt(0)}</div>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="px-5 pt-16">
        <h1 className="text-2xl font-bold text-foreground">{barber.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground">{barber.type === 'independent' ? 'Independent Barber' : barber.shopName}</p>
          {barber.experience && <span className="text-xs text-primary font-medium">• {barber.experience} yrs exp</span>}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1"><Star size={16} className="fill-primary text-primary" /><span className="font-semibold text-foreground">{barber.rating}</span><span className="text-sm text-muted-foreground">({barber.reviewCount})</span></div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={14} />{barber.distance}</div>
          <div className="flex items-center gap-1.5">
            <Circle size={8} className={`fill-current ${barber.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
            <span className={`text-xs font-medium ${barber.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>{barber.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{barber.about}</p>

        <div className="flex gap-3 mt-4">
          <div className="flex-1 glass-card p-3 text-center"><MapPin size={16} className="text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">{barber.location}</p></div>
          <div className="flex-1 glass-card p-3 text-center"><Phone size={16} className="text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">{barber.phone || 'Not set'}</p></div>
          <div className="flex-1 glass-card p-3 text-center"><Clock size={16} className="text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">9AM - 5PM</p></div>
        </div>

        {barber.address && (
          <div className="glass-card p-4 mt-4">
            <p className="text-sm text-muted-foreground mb-3">{barber.address}</p>
            <button onClick={handleGetDirections} className="w-full h-11 bg-secondary rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
              <Navigation size={16} className="text-primary" /> Get Directions
            </button>
          </div>
        )}
      </motion.div>

      {barber.gallery.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="px-5 mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">Gallery</h2>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {barber.gallery.map((img, i) => <img key={i} src={img} alt={`Work ${i + 1}`} className="w-28 h-28 rounded-2xl object-cover shrink-0" />)}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="px-5 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Services</h2>
        {barber.services.length > 0 ? (
          <div className="space-y-2">
            {barber.services.map((service) => (
              <div key={service.id} onClick={() => navigate(`/booking/${barber.id}?service=${service.id}`)}
                className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><ServiceIcon icon={service.icon} size={18} /></div>
                  <div>
                    <p className="font-medium text-foreground">{service.name} <span className="text-xs text-muted-foreground">• {service.duration} min</span></p>
                    {service.description && <p className="text-xs text-muted-foreground">{service.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold gold-text">₹{service.price}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No services listed yet.</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">{review.userName.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1"><Star size={12} className="fill-primary text-primary" /><span className="text-sm font-medium text-foreground">{review.rating}</span></div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="no-reviews" />
        )}
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <button onClick={() => navigate(`/booking/${barber.id}`)} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default BarberProfilePage;
