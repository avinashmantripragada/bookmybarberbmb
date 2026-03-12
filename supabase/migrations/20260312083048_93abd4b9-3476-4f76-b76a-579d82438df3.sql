
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  read boolean NOT NULL DEFAULT false,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- System can insert notifications (via service role or triggers)
CREATE POLICY "Authenticated users can receive notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create a function to auto-notify on appointment status changes
CREATE OR REPLACE FUNCTION public.notify_appointment_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  barber_name text;
  customer_profile profiles%ROWTYPE;
BEGIN
  -- Get barber name
  SELECT name INTO barber_name FROM barbers WHERE id = NEW.barber_id;
  
  IF TG_OP = 'INSERT' THEN
    -- Notify barber about new booking
    INSERT INTO notifications (user_id, title, message, type, related_id)
    SELECT b.user_id, 'New Booking', 'You have a new appointment on ' || NEW.appointment_date, 'booking_confirmed', NEW.id
    FROM barbers b WHERE b.id = NEW.barber_id AND b.user_id IS NOT NULL;
    
    -- Notify customer
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (NEW.customer_id, 'Booking Confirmed', 'Your appointment with ' || COALESCE(barber_name, 'your barber') || ' on ' || NEW.appointment_date || ' is confirmed.', 'booking_confirmed', NEW.id);
    
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'confirmed' THEN
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (NEW.customer_id, 'Appointment Confirmed', COALESCE(barber_name, 'Your barber') || ' confirmed your appointment on ' || NEW.appointment_date, 'booking_confirmed', NEW.id);
    ELSIF NEW.status = 'cancelled' THEN
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (NEW.customer_id, 'Appointment Cancelled', 'Your appointment on ' || NEW.appointment_date || ' has been cancelled.', 'booking_cancelled', NEW.id);
      
      -- Also notify barber
      INSERT INTO notifications (user_id, title, message, type, related_id)
      SELECT b.user_id, 'Booking Cancelled', 'An appointment on ' || NEW.appointment_date || ' was cancelled.', 'booking_cancelled', NEW.id
      FROM barbers b WHERE b.id = NEW.barber_id AND b.user_id IS NOT NULL;
    ELSIF NEW.status = 'completed' THEN
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (NEW.customer_id, 'Appointment Completed', 'Your appointment with ' || COALESCE(barber_name, 'your barber') || ' is complete. Leave a review!', 'appointment_reminder', NEW.id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to appointments table
CREATE TRIGGER on_appointment_change
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_appointment_change();
