export interface Barber {
  id: string;
  name: string;
  shopName: string;
  photo: string;
  rating: number;
  reviewCount: number;
  distance: string;
  startingPrice: number;
  services: Service[];
  portfolio: string[];
  availability: TimeSlot[];
  location: string;
  phone: string;
  about: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
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
