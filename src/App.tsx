import { Navigate, Route, Routes } from "react-router-dom"

import DashboardLayout from "@/layout/DashboardLayout"
import AnalyticsPage from "@/pages/AnalyticsPage"
import CloudPage from "@/pages/CloudPage"
import HomePage from "@/pages/HomePage"
import ProfilePage from "@/pages/ProfilePage"
import ReservationsPage from "@/pages/ReservationsPage"
import RushesPage from "@/pages/RushesPage"
import SubscriptionPage from "@/pages/SubscriptionPage"

export default function App() {
  return (
    <Routes>
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
