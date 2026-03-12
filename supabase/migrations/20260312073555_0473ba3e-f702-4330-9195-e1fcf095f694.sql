
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('customer', 'barber', 'shop_owner', 'admin');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- USER ROLES TABLE
-- =====================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- =====================
-- SHOPS TABLE
-- =====================
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  opening_time TEXT,
  closing_time TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shops are viewable by everyone" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Shop owners can insert their own shops" ON public.shops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Shop owners can update their own shops" ON public.shops FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Shop owners can delete their own shops" ON public.shops FOR DELETE USING (auth.uid() = owner_id);

-- =====================
-- BARBERS TABLE
-- =====================
CREATE TABLE public.barbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  profile_image TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Barbers are viewable by everyone" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Users can insert their own barber profile" ON public.barbers FOR INSERT WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'shop_owner'));
CREATE POLICY "Barbers can update their own profile" ON public.barbers FOR UPDATE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid()));
CREATE POLICY "Barbers can delete their own profile" ON public.barbers FOR DELETE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid()));

-- =====================
-- SERVICES TABLE
-- =====================
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their own services" ON public.services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = services.barber_id AND (barbers.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid())))
);
CREATE POLICY "Barbers can update their own services" ON public.services FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = services.barber_id AND (barbers.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid())))
);
CREATE POLICY "Barbers can delete their own services" ON public.services FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = services.barber_id AND (barbers.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid())))
);

-- =====================
-- APPOINTMENTS TABLE
-- =====================
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own appointments" ON public.appointments FOR SELECT USING (
  auth.uid() = customer_id OR EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = appointments.barber_id AND (barbers.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid())))
);
CREATE POLICY "Customers can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Appointment participants can update" ON public.appointments FOR UPDATE USING (
  auth.uid() = customer_id OR EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = appointments.barber_id AND (barbers.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.shops WHERE shops.id = barbers.shop_id AND shops.owner_id = auth.uid())))
);

-- =====================
-- REVIEWS TABLE
-- =====================
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Customers can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = customer_id);

-- =====================
-- PAYMENTS TABLE
-- =====================
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.appointments WHERE appointments.id = payments.appointment_id AND (appointments.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = appointments.barber_id AND barbers.user_id = auth.uid())))
);
CREATE POLICY "Customers can create payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.appointments WHERE appointments.id = payments.appointment_id AND appointments.customer_id = auth.uid())
);

-- =====================
-- PORTFOLIO IMAGES TABLE
-- =====================
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio images are viewable by everyone" ON public.portfolio_images FOR SELECT USING (true);
CREATE POLICY "Barbers can manage their portfolio" ON public.portfolio_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = portfolio_images.barber_id AND barbers.user_id = auth.uid())
);
CREATE POLICY "Barbers can delete their portfolio images" ON public.portfolio_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.barbers WHERE barbers.id = portfolio_images.barber_id AND barbers.user_id = auth.uid())
);

-- =====================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON public.barbers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_barbers_shop_id ON public.barbers(shop_id);
CREATE INDEX idx_barbers_user_id ON public.barbers(user_id);
CREATE INDEX idx_services_barber_id ON public.services(barber_id);
CREATE INDEX idx_appointments_customer_id ON public.appointments(customer_id);
CREATE INDEX idx_appointments_barber_id ON public.appointments(barber_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_reviews_barber_id ON public.reviews(barber_id);
CREATE INDEX idx_payments_appointment_id ON public.payments(appointment_id);
CREATE INDEX idx_portfolio_barber_id ON public.portfolio_images(barber_id);
CREATE INDEX idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX idx_shops_city ON public.shops(city);
