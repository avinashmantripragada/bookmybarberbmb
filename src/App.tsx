import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import BarberProfilePage from "./pages/BarberProfilePage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ReviewPage from "./pages/ReviewPage";
import ProfilePage from "./pages/ProfilePage";
import BarberDashboard from "./pages/BarberDashboard";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <SplashScreen show={showSplash} />
        <BrowserRouter>
          <div className="max-w-lg mx-auto relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/barber/:id" element={<BarberProfilePage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<BarberDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
