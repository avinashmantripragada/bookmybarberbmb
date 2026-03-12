import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

// Pages
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import VerifyPage from "./pages/VerifyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import BarberProfilePage from "./pages/BarberProfilePage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ReviewPage from "./pages/ReviewPage";
import ProfilePage from "./pages/ProfilePage";
import BarberDashboard from "./pages/BarberDashboard";
import BarberOnboardingPage from "./pages/BarberOnboardingPage";
import ShopOnboardingPage from "./pages/ShopOnboardingPage";
import ShopPage from "./pages/ShopPage";
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SearchPage from "./pages/SearchPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import FAQsPage from "./pages/FAQsPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import ReportProblemPage from "./pages/ReportProblemPage";
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
        <AuthProvider>
          <Sonner />
          <SplashScreen show={showSplash} />
          <BrowserRouter>
            <div className="max-w-lg mx-auto relative">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/barber/:id" element={<BarberProfilePage />} />
                <Route path="/shop/:id" element={<ShopPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<BarberDashboard />} />
                <Route path="/barber-onboarding" element={<BarberOnboardingPage />} />
                <Route path="/shop-onboarding" element={<ShopOnboardingPage />} />
                <Route path="/shop-dashboard" element={<ShopOwnerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/help-support" element={<HelpSupportPage />} />
                <Route path="/faqs" element={<FAQsPage />} />
                <Route path="/contact-support" element={<ContactSupportPage />} />
                <Route path="/report-problem" element={<ReportProblemPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
