import { useStore } from "../store"
import { COMMISSION } from "../data"

export default function Admin() {
  const { activities, bookings, approveActivity, deleteActivity } = useStore()
  const completed = bookings.filter((b) => b.status === "COMPLETED")
  const revenue = completed.reduce((s, b) => s + b.total, 0)

  const stats = [
    ["Activities", activities.length],
    ["Bookings", bookings.length],
    ["Completed", completed.length],
    ["Platform earnings (10%)", `LKR ${(revenue * COMMISSION).toLocaleString()}`],
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-teal-700">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold mb-2">All activities</h3>
        {activities.map((a) => (
          <div key={a.id} className="flex justify-between items-center border-t py-2 text-sm">
            <span>{a.emoji} {a.title} <span className="text-gray-400">by {a.owner}</span></span>
            <span className="flex gap-3">
              {a.approved ? <span className="text-green-700">Approved</span> : <button onClick={() => approveActivity(a.id)} className="text-teal-700">Approve</button>}
              <button onClick={() => deleteActivity(a.id)} className="text-red-600">Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
