import { request, downloadFile } from "./api"
import type { Booking, BookingStatus } from "./types"

export const bookingService = {
  createBooking: (data: {
    activityId: string
    bookingDate: string
    participants: number
  }) => {
    return request<{ message: string; booking: Booking }>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getMyBookings: () => {
    return request<{ bookings: Booking[] }>("/bookings/my")
  },

  getProviderBookings: () => {
    return request<{ bookings: Booking[] }>("/bookings/provider")
  },

  getBookingById: (id: string) => {
    return request<{ booking: Booking }>(`/bookings/${id}`)
  },

  cancelBooking: (id: string) => {
    return request<{ message: string; booking: Booking }>(`/bookings/${id}/cancel`, {
      method: "PUT",
    })
  },

  updateBookingStatus: (id: string, status: BookingStatus) => {
    return request<{ message: string; booking: Booking }>(`/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  },

  downloadTicket: async (id: string) => {
    await downloadFile(`/bookings/${id}/ticket`, `booking-ticket-${id}.pdf`)
  },
}
