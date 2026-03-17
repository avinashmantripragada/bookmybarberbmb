import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight, Navigation, Circle, Loader2, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useShop } from '@/hooks/useData';
import ServiceIcon from '@/components/ServiceIcon';

type Tab = 'info' | 'services' | 'reviews';

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useShop(id);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Shop not found</div>;

  const { shop, reviews } = data;

  const handleCall = () => { if (shop.phone) window.open(`tel:${shop.phone}`); };
  const handleDirections = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`, '_blank');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'services', label: 'Services' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero */}
      <div className="relative h-52 bg-secondary overflow-hidden">
        {shop.photo && <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="absolute top-12 right-4 z-10 flex gap-2">
          <button onClick={() => toast.success('Added to favorites!')} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <Heart size={18} className="text-foreground" />
          </button>
          <button onClick={() => {
            const text = `Check out ${shop.name} on BookMyBarber!`;
            if (navigator.share) navigator.share({ title: shop.name, text });
            else { navigator.clipboard.writeText(text); toast.success('Link copied!'); }
          }} className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={18} className="text-foreground" />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-10">
        <h1 className="text-2xl font-bold text-foreground">{shop.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1"><Star size={14} className="fill-primary text-primary" /><span className="font-semibold text-foreground">{shop.rating}</span><span className="text-xs text-muted-foreground">({shop.reviewCount})</span></div>
          <span className="text-xs text-muted-foreground">{shop.distance}</span>
          <div className="flex items-center gap-1.5">
            <Circle size={8} className={`fill-current ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
            <span className={`text-xs font-medium ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>{shop.isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>
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

      <div className="px-5 mt-5">
        {activeTab === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex gap-3">
              <button onClick={handleCall} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                <Phone size={18} className="text-primary" /><span className="text-xs text-muted-foreground">Call</span>
              </button>
              <button onClick={handleDirections} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
                <Navigation size={18} className="text-primary" /><span className="text-xs text-muted-foreground">Directions</span>
              </button>
            </div>

            {shop.description && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{shop.description}</p>
              </div>
            )}

            <div className="glass-card p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{shop.address}, {shop.city}, {shop.state} {shop.pincode}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">{shop.openingHours}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">{shop.phone}</p>
              </div>
            </div>

            {/* Barbers */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Our Barbers</h3>
              {shop.barbers.length > 0 ? (
                <div className="space-y-2">
                  {shop.barbers.map((barber) => (
                    <div key={barber.id} onClick={() => navigate(`/barber/${barber.id}`)}
                      className="glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
                      {barber.photo ? <img src={barber.photo} alt={barber.name} className="w-12 h-12 rounded-xl object-cover" /> :
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-primary">{barber.name.charAt(0)}</div>}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{barber.name}</p>
                        <p className="text-xs text-muted-foreground">{barber.experience ? `${barber.experience} yrs exp` : 'Expert Barber'}</p>
                      </div>
                      <div className="flex items-center gap-1"><Star size={12} className="fill-primary text-primary" /><span className="text-sm font-medium text-foreground">{barber.rating}</span></div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No barbers added yet.</p>}
            </div>

            {/* Gallery */}
            {shop.gallery.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {shop.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`Shop ${i + 1}`} className="w-full h-32 rounded-2xl object-cover" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {shop.services.length > 0 ? shop.services.map((service) => (
              <div key={service.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><ServiceIcon icon={service.icon} size={18} /></div>
                  <div><p className="font-medium text-foreground">{service.name}</p><p className="text-xs text-muted-foreground">{service.duration} min</p></div>
                </div>
                <span className="font-bold gold-text">₹{service.price}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground py-8 text-center">No services listed yet.</p>}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">{review.userName.charAt(0)}</div>
                  <div className="flex-1"><p className="text-sm font-medium text-foreground">{review.userName}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                  <div className="flex items-center gap-1"><Star size={12} className="fill-primary text-primary" /><span className="text-sm font-medium text-foreground">{review.rating}</span></div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground py-8 text-center">No reviews yet.</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
