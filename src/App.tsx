import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Services from "./pages/Services";
import CustomerPage from "./pages/CustomerPage";
import UserDashboard from "./pages/UserDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateProfile from "./pages/UpdateProfile";
import TreatmentHistory from "./pages/TreatmentHistory";
import OnlineConsultation from "./pages/OnlineConsultation";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";
import { AuthProvider } from "@/contexts/AuthContext";
import InvoicePage from "./pages/InvoicePage";
import InvoiceListPage from "./pages/InvoiceListPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/services" element={<Services />} />
              <Route path="/dashboard/customer" element={<CustomerPage />} />
              <Route path="/dashboard/user" element={<UserDashboard />} />
              <Route path="/dashboard/staff" element={<StaffDashboard />} />
              <Route path="/dashboard/manager" element={<ManagerDashboard />} />
              <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/treatment-history" element={<TreatmentHistory />} />
              <Route path="/online-consultation" element={<OnlineConsultation />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/invoice" element={<InvoicePage />} />
              <Route path="/invoices" element={<InvoiceListPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
