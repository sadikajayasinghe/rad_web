import { request } from "./api"
import type { Activity, Booking, DashboardStats, User } from "./types"

export const adminService = {
  getAllUsers: () => {
    return request<{ users: User[] }>("/admin/users")
  },

  updateUserApproval: (id: string, approve: boolean) => {
    return request<{ message: string; user: User }>(`/admin/users/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({ approve }),
    })
  },

  getAllActivitiesAdmin: () => {
    return request<{ activities: Activity[] }>("/admin/activities")
  },

  updateActivityStatus: (id: string, status: "PENDING" | "APPROVED" | "REJECTED") => {
    return request<{ message: string; activity: Activity }>(`/admin/activities/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  },

  getAllBookingsAdmin: () => {
    return request<{ bookings: Booking[] }>("/admin/bookings")
  },

  getDashboardStats: () => {
    return request<DashboardStats>("/admin/stats")
  },
}
