import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import ActivityDetails from "../pages/ActivityDetails"
import Login from "../pages/Login"
import Bookings from "../pages/Bookings"
import Provider from "../pages/Provider"
import Admin from "../pages/Admin"
import NotFound from "../pages/NotFound"
import ProtectedRoute from "../components/ProtectedRoute"
import { UserRole } from "../service/types"

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/activity/:id" element={<ActivityDetails />} />
      <Route path="/login" element={<Login />} />

      {/* Tourist / Authenticated routes */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={[UserRole.TOURIST, UserRole.ADMIN]}>
            <Bookings />
          </ProtectedRoute>
        }
      />

      {/* Provider routes */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={[UserRole.PROVIDER, UserRole.ADMIN]}>
            <Provider />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
