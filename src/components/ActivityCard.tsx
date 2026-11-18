import type { Activity } from "../data"
import { useStore } from "../store"

export default function ActivityCard({ activity }: { activity: Activity }) {
  const { select, bookings } = useStore()
  const ratings = bookings.filter((b) => b.activityId === activity.id && b.review).map((b) => b.review!.rating)
  const avg = ratings.length ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : null

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
      <div className="text-5xl">{activity.emoji}</div>
      <h3 className="text-lg font-semibold">{activity.title}</h3>
      <p className="text-sm text-gray-500">📍 {activity.location} · {activity.category}</p>
      <p className="text-sm">{avg ? `⭐ ${avg} (${ratings.length})` : "No reviews yet"}</p>
      <p className="font-bold text-teal-700">LKR {activity.price.toLocaleString()} / person</p>
      <button onClick={() => select(activity)} className="mt-2 bg-teal-600 text-white py-2 rounded hover:bg-teal-700">View details</button>
    </div>
  )
}
