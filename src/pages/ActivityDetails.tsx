import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { activityService } from "../service/activity.service"
import { bookingService } from "../service/booking.service"
import { reviewService } from "../service/review.service"
import { useAuth } from "../hooks/useAuth"
import type { Activity, Review } from "../service/types"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ActivityDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [activity, setActivity] = useState<Activity | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("")
  const [participants, setParticipants] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Review Form State
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [actRes, revRes] = await Promise.all([
          activityService.getActivityById(id),
          reviewService.getActivityReviews(id).catch(() => ({ reviews: [] })),
        ])
        setActivity(actRes.activity)
        setReviews(revRes.reviews || [])
      } catch (err: any) {
        setError(err.message || "Failed to load activity details")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (!id) return

    setBookingLoading(true)
    setBookingError(null)

    try {
      await bookingService.createBooking({
        activityId: id,
        bookingDate,
        participants: Number(participants),
      })
      setBookingSuccess(true)
      setTimeout(() => {
        navigate("/bookings")
      }, 1500)
    } catch (err: any) {
      setBookingError(err.message || "Failed to make booking")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !comment) return

    setReviewLoading(true)
    try {
      await reviewService.createReview({
        activityId: id,
        bookingId: "guest",
        rating: Number(rating),
        comment,
      })
      const revRes = await reviewService.getActivityReviews(id)
      setReviews(revRes.reviews || [])
      setComment("")
    } catch (err: any) {
      alert(err.message || "Failed to submit review")
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading adventure details..." />
  if (error || !activity) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-red-600 font-semibold">{error || "Activity not found"}</p>
      </div>
    )
  }

  const defaultImage =
    activity.images && activity.images.length > 0
      ? activity.images[0]
      : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"

  const totalPrice = activity.pricePerPerson * participants

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Location Header */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {activity.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
          {activity.title}
        </h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center">
          📍 {activity.location} • ⏳ {activity.duration} • 👥 Max {activity.maxParticipants} people
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-sm mb-8 bg-gray-100">
        <img src={defaultImage} alt={activity.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this experience</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {activity.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tourist Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500 mb-6">No reviews yet for this adventure.</p>
            ) : (
              <div className="space-y-4 mb-6">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">
                        {typeof rev.touristId === "object" ? rev.touristId.name : "Tourist"}
                      </span>
                      <span className="text-amber-500 text-sm">{"★".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Leave a review */}
            {isAuthenticated && (
              <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Leave your feedback</h3>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-500">Rating:</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience..."
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition"
                >
                  {reviewLoading ? "Submitting..." : "Post Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div>
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-indigo-600">${activity.pricePerPerson}</span>
              <span className="text-gray-500 text-sm"> / person</span>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center">
                <p className="font-bold">Booking Submitted!</p>
                <p className="text-xs mt-1">Redirecting to your bookings list...</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                    {bookingError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Participants
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={activity.maxParticipants || 20}
                    value={participants}
                    onChange={(e) => setParticipants(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="text-xl font-bold text-gray-900">${totalPrice}</span>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow transition"
                >
                  {bookingLoading
                    ? "Processing..."
                    : isAuthenticated
                    ? "Confirm Booking"
                    : "Sign In to Book"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
