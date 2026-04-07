import { Navigate, Route, Routes } from "react-router-dom"

import DashboardLayout from "@/layout/DashboardLayout"
import AnalyticsPage from "@/pages/AnalyticsPage"
import CloudPage from "@/pages/CloudPage"
import HomePage from "@/pages/HomePage"
import ProfilePage from "@/pages/ProfilePage"
import ReservationsPage from "@/pages/ReservationsPage"
import RushesPage from "@/pages/RushesPage"
import SubscriptionPage from "@/pages/SubscriptionPage"
import AuthLayout from "@/pages/auth/AuthLayout"
import ConfirmEmailPage from "@/pages/auth/ConfirmEmailPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"
import LoginPage from "@/pages/auth/LoginPage"
import RegisterPage from "@/pages/auth/RegisterPage"
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage"

export default function App() {
  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="confirm-email" element={<ConfirmEmailPage />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="rushes" element={<RushesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="cloud" element={<CloudPage />} />
        <Route path="abonnement" element={<SubscriptionPage />} />
        <Route path="profil" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
