import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { CustomerRoute, EntryRoute, OwnerRoute, BarberRoute, SelectedRoleRoute } from "@/components/RoleRoute";

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
import AppointmentDetailsPage from "./pages/AppointmentDetailsPage";
import ChatPage from "./pages/ChatPage";
import ReviewPage from "./pages/ReviewPage";
import ProfilePage from "./pages/ProfilePage";
import ManageProfilePage from "./pages/ManageProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import AboutPage from "./pages/AboutPage";
import BarberOnboardingPage from "./pages/BarberOnboardingPage";
import ShopOnboardingPage from "./pages/ShopOnboardingPage";
import ShopPage from "./pages/ShopPage";
import AdminDashboard from "./pages/AdminDashboard";
import SearchPage from "./pages/SearchPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import FAQsPage from "./pages/FAQsPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import ReportProblemPage from "./pages/ReportProblemPage";
import NotFound from "./pages/NotFound";

// Dashboard pages (Shop Owner)
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import DashboardShop from "./pages/dashboard/DashboardShop";
import DashboardClients from "./pages/dashboard/DashboardClients";

const queryClient = new QueryClient();

const AppShell = () => {
  const { activeProfile, user } = useAuth();

  return (
    <BrowserRouter>
      <div key={`${user?.id ?? 'anon'}-${activeProfile ?? 'public'}`} className="max-w-lg mx-auto relative">
        <Routes>
          {/* Public / Entry */}
          <Route path="/" element={<EntryRoute><WelcomePage /></EntryRoute>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Customer Routes */}
          <Route path="/home" element={<CustomerRoute><HomePage /></CustomerRoute>} />
          <Route path="/search" element={<CustomerRoute><SearchPage /></CustomerRoute>} />
          <Route path="/barber/:id" element={<CustomerRoute><BarberProfilePage /></CustomerRoute>} />
          <Route path="/shop/:id" element={<CustomerRoute><ShopPage /></CustomerRoute>} />
          <Route path="/booking/:id" element={<CustomerRoute><BookingPage /></CustomerRoute>} />
          <Route path="/payment/:id" element={<CustomerRoute><PaymentPage /></CustomerRoute>} />
          <Route path="/appointments" element={<CustomerRoute><AppointmentsPage /></CustomerRoute>} />
          <Route path="/appointment-details" element={<SelectedRoleRoute><AppointmentDetailsPage /></SelectedRoleRoute>} />
          <Route path="/chat" element={<CustomerRoute><ChatPage /></CustomerRoute>} />
          <Route path="/review" element={<CustomerRoute><ReviewPage /></CustomerRoute>} />

          {/* Shared (any profile) */}
          <Route path="/profile" element={<SelectedRoleRoute><ProfilePage /></SelectedRoleRoute>} />
          <Route path="/manage-profile" element={<SelectedRoleRoute><ManageProfilePage /></SelectedRoleRoute>} />
          <Route path="/settings" element={<SelectedRoleRoute><SettingsPage /></SelectedRoleRoute>} />
          <Route path="/payments" element={<SelectedRoleRoute><PaymentMethodsPage /></SelectedRoleRoute>} />
          <Route path="/about" element={<SelectedRoleRoute><AboutPage /></SelectedRoleRoute>} />
          <Route path="/help-support" element={<SelectedRoleRoute><HelpSupportPage /></SelectedRoleRoute>} />
          <Route path="/faqs" element={<SelectedRoleRoute><FAQsPage /></SelectedRoleRoute>} />
          <Route path="/contact-support" element={<SelectedRoleRoute><ContactSupportPage /></SelectedRoleRoute>} />
          <Route path="/report-problem" element={<SelectedRoleRoute><ReportProblemPage /></SelectedRoleRoute>} />

          {/* Onboarding (any profile can access to create new) */}
          <Route path="/barber-onboarding" element={<SelectedRoleRoute><BarberOnboardingPage /></SelectedRoleRoute>} />
          <Route path="/shop-onboarding" element={<SelectedRoleRoute><ShopOnboardingPage /></SelectedRoleRoute>} />

          {/* Shop Owner Dashboard */}
          <Route path="/dashboard" element={<OwnerRoute><DashboardHome /></OwnerRoute>} />
          <Route path="/dashboard/bookings" element={<OwnerRoute><DashboardBookings /></OwnerRoute>} />
          <Route path="/dashboard/shop" element={<OwnerRoute><DashboardShop /></OwnerRoute>} />
          <Route path="/dashboard/clients" element={<OwnerRoute><DashboardClients /></OwnerRoute>} />

          {/* Independent Barber Dashboard — reuse same components for now */}
          <Route path="/barber-dashboard" element={<BarberRoute><DashboardHome /></BarberRoute>} />
          <Route path="/barber-dashboard/bookings" element={<BarberRoute><DashboardBookings /></BarberRoute>} />
          <Route path="/barber-dashboard/services" element={<BarberRoute><DashboardShop /></BarberRoute>} />
          <Route path="/barber-dashboard/clients" element={<BarberRoute><DashboardClients /></BarberRoute>} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

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
          <AppShell />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
