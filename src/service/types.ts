export const UserRole = {
  ADMIN: "ADMIN",
  TOURIST: "TOURIST",
  PROVIDER: "PROVIDER",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: string
  name: string
  email: string
  roles: UserRole[]
  approve: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Activity {
  _id: string
  title: string
  description: string
  category: string
  location: string
  pricePerPerson: number
  duration: string
  maxParticipants: number
  images: string[]
  providerId: {
    _id: string
    name: string
    email: string
  } | string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt?: string
  updatedAt?: string
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED"

export interface Booking {
  _id: string
  touristId: {
    _id: string
    name: string
    email: string
  } | string
  activityId: Activity
  bookingDate: string
  participants: number
  totalPrice: number
  status: BookingStatus
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  _id: string
  touristId: {
    _id: string
    name: string
    email: string
  } | string
  activityId: string
  bookingId: string
  rating: number
  comment: string
  createdAt?: string
}

export interface AuthResponse {
  message: string
  accessToken: string
  refreshToken: string
  user: User
}

export interface DashboardStats {
  totalUsers: number
  totalTourists: number
  totalProviders: number
  totalActivities: number
  pendingActivities: number
  approvedActivities: number
  totalBookings: number
  bookingStatusBreakdown: Record<string, number>
}
