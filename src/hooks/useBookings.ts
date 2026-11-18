import { useState, useEffect, useCallback } from "react"
import { bookingService } from "../service/booking.service"
import type { Booking } from "../service/types"

export function useBookings(isProvider: boolean = false) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = isProvider
        ? await bookingService.getProviderBookings()
        : await bookingService.getMyBookings()
      setBookings(res.bookings || [])
    } catch (err: any) {
      setError(err.message || "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }, [isProvider])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  }
}
