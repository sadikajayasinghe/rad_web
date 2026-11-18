import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { UserRole } from "../service/types"
import LoadingSpinner from "./LoadingSpinner"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user.roles.some((r) => allowedRoles.includes(r))
    if (!hasRole) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
