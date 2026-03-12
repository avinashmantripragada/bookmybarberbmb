export interface Barber {
  id: string;
  name: string;
  shopName: string;
  shopId?: string;
  photo: string;
  rating: number;
  reviewCount: number;
  distance: string;
  startingPrice: number;
  services: Service[];
  portfolio: string[];
  availability: TimeSlot[];
  location: string;
  address: string;
  phone: string;
  about: string;
  isOpen: boolean;
  nextSlot?: string;
  gallery: string[];
  type: 'independent' | 'shop-employed';
  experience?: number;
  bio?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  photo: string;
  rating: number;
  reviewCount: number;
  distance: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isOpen: boolean;
  openingHours: string;
  gallery: string[];
  barbers: Barber[];
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  icon?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  barber: Barber;
  service: Service;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentMethod: string;
  totalPrice: number;
}

export interface Review {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  date: string;
}
