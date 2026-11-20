import { useState } from "react"
import { Link } from "react-router-dom"
import { useBookings } from "../hooks/useBookings"
import { bookingService } from "../service/booking.service"
import StatusBadge from "../components/StatusBadge"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Bookings() {
  const { bookings, loading, error, refetch } = useBookings(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    setActionLoading(id)
    try {
      await bookingService.cancelBooking(id)
      await refetch()
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownloadTicket = async (id: string) => {
    setActionLoading(id)
    try {
      await bookingService.downloadTicket(id)
    } catch (err: any) {
      alert(err.message || "Failed to download ticket")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Adventure Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your scheduled tours, download tickets, or cancel reservations.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your bookings..." />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="text-lg font-bold text-gray-800">No bookings yet</h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            You haven't reserved any excursions or tours yet.
          </p>
          <Link
            to="/"
            className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow"
          >
            Explore Activities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const activity = b.activityId
            return (
              <div
                key={b._id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusBadge status={b.status} />
                    <span className="text-xs text-gray-500">
                      Booked on: {new Date(b.bookingDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {activity?.title || "Excursion Activity"}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                     {b.participants} participant(s) • Total:{" "}
                    <span className="font-bold text-indigo-600">${b.totalPrice}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => handleDownloadTicket(b._id)}
                    disabled={actionLoading === b._id}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    📄 PDF Ticket
                  </button>

                  {b.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      disabled={actionLoading === b._id}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
