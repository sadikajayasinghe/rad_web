import { useState, useEffect } from "react"
import { activityService } from "../service/activity.service"
import { bookingService } from "../service/booking.service"
import type { Activity, Booking, BookingStatus } from "../service/types"
import StatusBadge from "../components/StatusBadge"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Provider() {
  const [activeTab, setActiveTab] = useState<"activities" | "bookings">("activities")
  const [activities, setActivities] = useState<Activity[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const initialForm = {
    title: "",
    description: "",
    category: "Adventure",
    location: "",
    pricePerPerson: 50,
    duration: "2 hours",
    maxParticipants: 10,
    images: "",
  }
  
  const [formData, setFormData] = useState(initialForm)

  const openAddModal = () => {
    setEditingActivity(null)
    setFormData(initialForm)
    setShowAddModal(true)
  }

  const openEditModal = (act: Activity) => {
    setEditingActivity(act)
    setFormData({
      title: act.title,
      description: act.description,
      category: act.category,
      location: act.location,
      pricePerPerson: act.pricePerPerson,
      duration: act.duration,
      maxParticipants: act.maxParticipants,
      images: Array.isArray(act.images) ? act.images.join(", ") : "",
    })
    setShowAddModal(true)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [actRes, bookRes] = await Promise.all([
        activityService.getMyActivities().catch(() => ({ activities: [] })),
        bookingService.getProviderBookings().catch(() => ({ bookings: [] })),
      ])
      setActivities(actRes.activities || [])
      setBookings(bookRes.bookings || [])
    } catch (err: any) {
      console.error("Failed to load provider data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const imgArray = formData.images
        ? formData.images.split(",").map((s) => s.trim()).filter(Boolean)
        : []

      const payload = {
        ...formData,
        pricePerPerson: Number(formData.pricePerPerson),
        maxParticipants: Number(formData.maxParticipants),
        images: imgArray,
      }

      if (editingActivity) {
        await activityService.updateActivity(editingActivity._id, payload)
      } else {
        await activityService.createActivity(payload)
      }

      setShowAddModal(false)
      setEditingActivity(null)
      setFormData(initialForm)
      await loadData()
    } catch (err: any) {
      alert(err.message || "Failed to save activity")
    }
  }

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return
    try {
      await activityService.deleteActivity(id)
      await loadData()
    } catch (err: any) {
      alert(err.message || "Failed to delete activity")
    }
  }

  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(id, status)
      await loadData()
    } catch (err: any) {
      alert(err.message || "Failed to update booking status")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Activity Provider Portal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your experiences, view incoming tourist bookings, and track approvals.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition self-start sm:self-auto"
        >
          + Add New Activity
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("activities")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "activities"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Activities ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === "bookings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Received Bookings ({bookings.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading provider console..." />
      ) : activeTab === "activities" ? (
        activities.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">No activities listed yet</h3>
            <p className="text-gray-500 text-sm mt-1">Start by publishing your first tourist experience.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a) => (
              <div key={a._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="h-36 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={a.images && a.images.length > 0 ? a.images[0] : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"}
                      alt={a.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600">{a.category}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{a.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">📍 {a.location}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{a.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900 text-sm">LKR {a.pricePerPerson.toLocaleString()} / person</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openEditModal(a)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(a._id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">No customer bookings yet</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <StatusBadge status={b.status} />
                    <span className="text-xs text-gray-500">
                      Date: {new Date(b.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">{b.activityId?.title || "Tour"}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Customer: {typeof b.touristId === "object" ? b.touristId.name : "Tourist"} (
                    {typeof b.touristId === "object" ? b.touristId.email : ""}) • {b.participants} pax • $
                    {b.totalPrice}
                  </p>
                </div>

                {b.status === "PENDING" && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateBookingStatus(b._id, "CONFIRMED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(b._id, "REJECTED")}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal: Add / Edit Activity */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingActivity ? "Edit Tourist Experience" : "Create New Tourist Experience"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ella Rock Sunrise Trek"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Water Sports">Water Sports</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Sightseeing">Sightseeing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ella, Badulla"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price / Person ($)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="3 hours"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Participants</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed outline of the trip, equipment provided, prerequisites..."
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Image URL (Direct image link or Unsplash)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Tip: Use direct image URLs (ending in .jpg, .png, or Unsplash links).
                </p>

                {/* Live Preview */}
                {formData.images.trim() && (
                  <div className="mt-2.5">
                    <p className="text-[11px] font-semibold text-gray-600 mb-1">Image Preview:</p>
                    <div className="h-28 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={formData.images.split(",")[0].trim()}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow cursor-pointer"
                >
                  {editingActivity ? "Save Changes" : "Publish for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
