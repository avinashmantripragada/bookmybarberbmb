import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, ChevronRight, Navigation, Circle } from 'lucide-react';
import { mockShops, mockReviews } from '@/data/mockData';
import ServiceIcon from '@/components/ServiceIcon';

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = mockShops.find(s => s.id === id);

  if (!shop) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Shop not found</div>;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero */}
      <div className="relative h-48 bg-secondary overflow-hidden">
        {shop.photo && <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button onClick={() => navigate(-1)}
          className="absolute top-12 left-4 z-10 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-5 -mt-8 relative z-10">
        <h1 className="text-2xl font-bold text-foreground">{shop.name}</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-semibold text-foreground">{shop.rating}</span>
            <span className="text-sm text-muted-foreground">({shop.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />{shop.distance}
          </div>
          <div className="flex items-center gap-1.5">
            <Circle size={8} className={`fill-current ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
            <span className={`text-xs font-medium ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>
              {shop.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{shop.description}</p>

        {/* Quick Info */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 glass-card p-3 text-center">
            <MapPin size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{shop.location}</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <Phone size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{shop.phone}</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <Clock size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{shop.openingHours}</p>
          </div>
        </div>

        {/* Directions */}
        <div className="glass-card p-4 mt-4">
          <p className="text-sm text-muted-foreground mb-3">{shop.address}, {shop.city}, {shop.state} {shop.pincode}</p>
          <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`, '_blank')}
            className="w-full h-11 bg-secondary rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
            <Navigation size={16} className="text-primary" /> Get Directions
          </button>
        </div>
      </motion.div>

      {/* Gallery */}
      {shop.gallery.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-5 mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">Gallery</h2>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {shop.gallery.map((img, i) => (
              <img key={i} src={img} alt={`Shop ${i + 1}`} className="w-32 h-24 rounded-2xl object-cover shrink-0" />
            ))}
          </div>
        </motion.div>
      )}

      {/* Barbers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="px-5 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Our Barbers</h2>
        <div className="space-y-2">
          {shop.barbers.map((barber) => (
            <div key={barber.id} onClick={() => navigate(`/barber/${barber.id}`)}
              className="glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
              {barber.photo ? (
                <img src={barber.photo} alt={barber.name} className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-primary">
                  {barber.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground">{barber.name}</p>
                <p className="text-xs text-muted-foreground">{barber.experience ? `${barber.experience} yrs exp` : 'Expert Barber'}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{barber.rating}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="px-5 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Services</h2>
        <div className="space-y-2">
          {shop.services.map((service) => (
            <div key={service.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <ServiceIcon icon={service.icon} size={18} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.duration} min</p>
                </div>
              </div>
              <span className="font-bold gold-text">₹{service.price}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="px-5 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Reviews</h2>
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
    </div>
  );
};

export default ShopPage;
