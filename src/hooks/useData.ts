import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Barber, Shop, Service, TimeSlot } from '@/types';

const DEFAULT_SLOTS: TimeSlot[] = [
  { id: 't1', time: '09:00 AM', available: true },
  { id: 't2', time: '09:30 AM', available: true },
  { id: 't3', time: '10:00 AM', available: true },
  { id: 't4', time: '10:30 AM', available: true },
  { id: 't5', time: '11:00 AM', available: true },
  { id: 't6', time: '11:30 AM', available: true },
  { id: 't7', time: '12:00 PM', available: true },
  { id: 't8', time: '02:00 PM', available: true },
  { id: 't9', time: '02:30 PM', available: true },
  { id: 't10', time: '03:00 PM', available: true },
  { id: 't11', time: '03:30 PM', available: true },
  { id: 't12', time: '04:00 PM', available: true },
];

function mapServices(services: any[]): Service[] {
  return (services || []).map((s: any) => ({
    id: s.id,
    name: s.service_name,
    price: Number(s.price),
    duration: s.duration,
  }));
}

function mapBarber(b: any, shopName?: string, reviewCount?: number): Barber {
  const services = mapServices(b.services);
  const portfolio = (b.portfolio_images || []).map((p: any) => p.image_url);
  return {
    id: b.id,
    name: b.name,
    shopName: shopName || (b.shop_id ? 'Shop Barber' : 'Independent'),
    shopId: b.shop_id || undefined,
    photo: b.profile_image || '',
    rating: Number(b.rating) || 0,
    reviewCount: reviewCount || 0,
    distance: b.city || 'Nearby',
    startingPrice: services.length > 0 ? Math.min(...services.map(s => s.price)) : 0,
    services,
    portfolio,
    availability: DEFAULT_SLOTS,
    location: [b.city, b.state].filter(Boolean).join(', ') || 'Location not set',
    address: b.address || '',
    phone: b.phone || '',
    about: b.bio || '',
    isOpen: true,
    type: b.shop_id ? 'shop-employed' : 'independent',
    experience: b.experience_years || undefined,
    bio: b.bio || undefined,
    gallery: portfolio,
  };
}

export function useBarbers() {
  return useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const { data: barbers, error } = await supabase
        .from('barbers')
        .select('*, services(*), portfolio_images(*), shops(shop_name)');
      if (error) throw error;
      if (!barbers?.length) return [];

      const { data: reviewCounts } = await supabase.from('reviews').select('barber_id');
      const countMap: Record<string, number> = {};
      (reviewCounts || []).forEach((r: any) => { countMap[r.barber_id] = (countMap[r.barber_id] || 0) + 1; });

      return barbers.map((b: any) => mapBarber(b, (b as any).shops?.shop_name, countMap[b.id] || 0));
    },
  });
}

export function useBarber(id: string | undefined) {
  return useQuery({
    queryKey: ['barber', id],
    enabled: !!id,
    queryFn: async () => {
      const { data: barber, error } = await supabase
        .from('barbers')
        .select('*, services(*), portfolio_images(*), shops(shop_name)')
        .eq('id', id!)
        .single();
      if (error) throw error;

      const { data: reviews } = await supabase.from('reviews').select('*').eq('barber_id', id!);
      const customerIds = [...new Set((reviews || []).map(r => r.customer_id))];
      let profileMap: Record<string, string> = {};
      if (customerIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('user_id, name').in('user_id', customerIds);
        profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.name]));
      }

      return {
        barber: mapBarber(barber, (barber as any).shops?.shop_name, (reviews || []).length),
        reviews: (reviews || []).map((r: any) => ({
          id: r.id,
          userName: profileMap[r.customer_id] || 'Anonymous',
          userPhoto: '',
          rating: r.rating,
          comment: r.review_text || '',
          date: new Date(r.created_at).toLocaleDateString(),
        })),
      };
    },
  });
}

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const { data: shops, error } = await supabase
        .from('shops')
        .select('*, barbers(*, services(*), portfolio_images(*))');
      if (error) throw error;
      if (!shops?.length) return [];

      return shops.map((s: any): Shop => ({
        id: s.id,
        name: s.shop_name,
        ownerId: s.owner_id,
        description: s.description || '',
        photo: '',
        rating: Number(s.rating) || 0,
        reviewCount: 0,
        distance: s.city || 'Nearby',
        location: [s.city, s.state].filter(Boolean).join(', ') || '',
        address: s.address || '',
        city: s.city || '',
        state: s.state || '',
        pincode: s.pincode || '',
        phone: s.phone || '',
        isOpen: true,
        openingHours: s.opening_time && s.closing_time ? `${s.opening_time} – ${s.closing_time}` : 'Not set',
        gallery: [],
        barbers: (s.barbers || []).map((b: any) => mapBarber(b, s.shop_name)),
        services: (s.barbers || []).flatMap((b: any) => mapServices(b.services)),
      }));
    },
  });
}

export function useShop(id: string | undefined) {
  return useQuery({
    queryKey: ['shop', id],
    enabled: !!id,
    queryFn: async () => {
      const { data: shop, error } = await supabase
        .from('shops')
        .select('*, barbers(*, services(*), portfolio_images(*))')
        .eq('id', id!)
        .single();
      if (error) throw error;

      const barberIds = (shop.barbers || []).map((b: any) => b.id);
      let reviews: any[] = [];
      let profileMap: Record<string, string> = {};
      if (barberIds.length > 0) {
        const { data: revData } = await supabase.from('reviews').select('*').in('barber_id', barberIds);
        reviews = revData || [];
        const customerIds = [...new Set(reviews.map(r => r.customer_id))];
        if (customerIds.length > 0) {
          const { data: profiles } = await supabase.from('profiles').select('user_id, name').in('user_id', customerIds);
          profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p.name]));
        }
      }

      return {
        shop: {
          id: shop.id,
          name: shop.shop_name,
          ownerId: shop.owner_id,
          description: shop.description || '',
          photo: '',
          rating: Number(shop.rating) || 0,
          reviewCount: reviews.length,
          distance: shop.city || 'Nearby',
          location: [shop.city, shop.state].filter(Boolean).join(', ') || '',
          address: shop.address || '',
          city: shop.city || '',
          state: shop.state || '',
          pincode: shop.pincode || '',
          phone: shop.phone || '',
          isOpen: true,
          openingHours: shop.opening_time && shop.closing_time ? `${shop.opening_time} – ${shop.closing_time}` : 'Not set',
          gallery: [],
          barbers: (shop.barbers || []).map((b: any) => mapBarber(b, shop.shop_name)),
          services: (shop.barbers || []).flatMap((b: any) => mapServices(b.services)),
        } as Shop,
        reviews: reviews.map((r: any) => ({
          id: r.id,
          userName: profileMap[r.customer_id] || 'Anonymous',
          userPhoto: '',
          rating: r.rating,
          comment: r.review_text || '',
          date: new Date(r.created_at).toLocaleDateString(),
        })),
      };
    },
  });
}

export function useAppointments(userId: string | undefined) {
  return useQuery({
    queryKey: ['appointments', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, barbers(*, shops(shop_name)), services(*)')
        .eq('customer_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;

      return (data || []).map((apt: any) => ({
        id: apt.id,
        barber: mapBarber(apt.barbers, (apt.barbers as any)?.shops?.shop_name),
        service: {
          id: apt.services.id,
          name: apt.services.service_name,
          price: Number(apt.services.price),
          duration: apt.services.duration,
        },
        date: new Date(apt.appointment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: apt.appointment_time,
        status: (apt.status === 'pending' || apt.status === 'confirmed') ? 'upcoming' as const : apt.status as 'completed' | 'cancelled',
        paymentMethod: apt.payment_status,
        totalPrice: Number(apt.services.price),
        barberId: apt.barber_id,
      }));
    },
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customer_id: string;
      barber_id: string;
      service_id: string;
      appointment_date: string;
      appointment_time: string;
    }) => {
      const { data: result, error } = await supabase.from('appointments').insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['appointments'] }); },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customer_id: string;
      barber_id: string;
      rating: number;
      review_text: string;
    }) => {
      const { error } = await supabase.from('reviews').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['barber'] });
      qc.invalidateQueries({ queryKey: ['barbers'] });
    },
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (data: {
      appointment_id: string;
      amount: number;
      payment_method: string;
    }) => {
      const { error } = await supabase.from('payments').insert(data);
      if (error) throw error;
    },
  });
}
