import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight, Navigation, Circle, Loader2, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBarber } from '@/hooks/useData';
import ServiceIcon from '@/components/ServiceIcon';
import EmptyState from '@/components/EmptyState';

type Tab = 'info' | 'services' | 'reviews';

const BarberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useBarber(id);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Barber not found</div>;

  const { barber, reviews } = data;

  const handleGetDirections = () => {
    const query = encodeURIComponent(barber.address || barber.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCall = () => {
    if (barber.phone) window.open(`tel:${barber.phone}`);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'services', label: 'Services' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Hero */}
      <div className="relative h-52 bg-secondary">
        <div className="absolute inset-0 gold-gradient opacity-20" />
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="absolute top-12 right-4 z-10 flex gap-2">
          <button onClick={() => toast.success('Added to favorites!')} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <Heart size={18} className="text-foreground" />
          </button>
          <button onClick={() => {
            const text = `Check out ${barber.name} on BookMyBarber!`;
            if (navigator.share) navigator.share({ title: barber.name, text });
            else { navigator.clipboard.writeText(text); toast.success('Link copied!'); }
          }} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={18} className="text-foreground" />
          </button>
        </div>
        <div className="absolute -bottom-14 left-5">
          {barber.photo ? (
            <img src={barber.photo} alt={barber.name} className="w-28 h-28 rounded-3xl border-4 border-background object-cover shadow-lg" />
          ) : (
            <div className="w-28 h-28 rounded-3xl bg-card border-4 border-background flex items-center justify-center text-4xl font-bold text-primary shadow-lg">{barber.name.charAt(0)}</div>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="px-5 pt-16">
        <h1 className="text-xl font-bold text-foreground mt-2">{barber.name}</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <Star size={14} className="fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{barber.rating}</span>
          <span className="text-xs text-muted-foreground">({barber.reviewCount})</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {barber.type === 'independent' ? 'Independent Barber' : barber.shopName}
          {barber.experience && <span className="text-primary"> • {barber.experience} yrs exp</span>}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-5">
        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-all border-b-2 ${
                activeTab === t.key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 mt-5">
        {activeTab === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Quick Actions */}
            <div className="flex gap-3">
              <button onClick={handleCall} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                <Phone size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Call</span>
              </button>
              <button onClick={handleGetDirections} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                <Navigation size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Directions</span>
              </button>
              <button onClick={() => navigate(`/booking/${barber.id}`)} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                <Star size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Book</span>
              </button>
            </div>

            {/* About */}
            {barber.about && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{barber.about}</p>
              </div>
            )}

            {/* Address & Hours */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">{barber.location}</p>
                  {barber.address && <p className="text-xs text-muted-foreground mt-0.5">{barber.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">9:00 AM – 5:00 PM</p>
              </div>
              <div className="flex items-center gap-3">
                <Circle size={8} className={`fill-current ${barber.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
                <span className={`text-sm font-medium ${barber.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>
                  {barber.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Gallery */}
            {barber.gallery.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {barber.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Work ${i + 1}`} className="w-full h-32 rounded-2xl object-cover" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {barber.services.length > 0 ? barber.services.map((service) => (
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
            )) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No services listed yet.</p>
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {reviews.length > 0 ? reviews.map((review) => (
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
            )) : (
              <EmptyState type="no-reviews" />
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 p-4 px-5 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <button onClick={() => navigate(`/booking/${barber.id}`)} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform shadow-[0_4px_20px_-4px_hsl(42,87%,55%,0.4)]">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default BarberProfilePage;
