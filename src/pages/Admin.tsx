import { useState, useEffect } from "react"
import { adminService } from "../service/admin.service"
import type { Activity, Booking, DashboardStats, User } from "../service/types"
import StatusBadge from "../components/StatusBadge"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "activities" | "bookings">("stats")
  const [loading, setLoading] = useState(true)

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, actRes, bookRes] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        adminService.getAllUsers().catch(() => ({ users: [] })),
        adminService.getAllActivitiesAdmin().catch(() => ({ activities: [] })),
        adminService.getAllBookingsAdmin().catch(() => ({ bookings: [] })),
      ])
      setStats(statsRes)
      setUsers(usersRes.users || [])
      setActivities(actRes.activities || [])
      setBookings(bookRes.bookings || [])
    } catch (err: any) {
      console.error("Admin data load error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleToggleUserApproval = async (userId: string, currentStatus: boolean) => {
    try {
      await adminService.updateUserApproval(userId, !currentStatus)
      await loadAdminData()
    } catch (err: any) {
      alert(err.message || "Failed to update user approval")
    }
  }

  const handleActivityStatus = async (activityId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await adminService.updateActivityStatus(activityId, status)
      await loadAdminData()
    } catch (err: any) {
      alert(err.message || "Failed to update activity status")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Control Center</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review system analytics, manage activity approvals, verify providers, and monitor bookings.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("stats")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === "stats"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview Stats
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === "activities"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Activities ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === "users"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Users & Providers ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`py-3 px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition ${
            activeTab === "bookings"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Bookings ({bookings.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching administrative records..." />
      ) : activeTab === "stats" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Users</span>
            <p className="text-3xl font-extrabold text-indigo-600 mt-2">{stats?.totalUsers || users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Providers</span>
            <p className="text-3xl font-extrabold text-indigo-600 mt-2">{stats?.totalProviders || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">Pending Activities</span>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats?.pendingActivities || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Bookings</span>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{stats?.totalBookings || bookings.length}</p>
          </div>
        </div>
      ) : activeTab === "activities" ? (
        <div className="space-y-4">
          {activities.map((a) => (
            <div
              key={a._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600">{a.category}</span>
                  <StatusBadge status={a.status} />
                </div>
                <h3 className="font-bold text-gray-900">{a.title}</h3>
                <p className="text-xs text-gray-500">📍 {a.location} • ${a.pricePerPerson} / person</p>
              </div>

              {a.status === "PENDING" && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleActivityStatus(a._id, "APPROVED")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleActivityStatus(a._id, "REJECTED")}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === "users" ? (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{u.name}</h4>
                  <p className="text-xs text-gray-500">{u.email} • {u.roles.join(", ")}</p>
                </div>
                {u.roles.includes("PROVIDER" as any) && (
                  <button
                    onClick={() => handleToggleUserApproval(u.id, u.approve)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      u.approve
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {u.approve ? "Revoke Approval" : "Approve Provider"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={b.status} />
                <span className="font-bold text-gray-900 text-sm">${b.totalPrice}</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{b.activityId?.title || "Excursion"}</h4>
              <p className="text-xs text-gray-500 mt-1">
                Date: {new Date(b.bookingDate).toLocaleDateString()} • {b.participants} participants
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
