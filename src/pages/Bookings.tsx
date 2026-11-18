import { useState } from "react"
import { useStore } from "../store"
import StatusBadge from "../components/StatusBadge"

export default function Bookings() {
  const { bookings, activities, user, setStatus, addReview } = useStore()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [reviewing, setReviewing] = useState<number | null>(null)
  const mine = bookings.filter((b) => b.tourist === user?.name)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {mine.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
      <div className="flex flex-col gap-3">
        {mine.map((b) => {
          const act = activities.find((a) => a.id === b.activityId)
          return (
            <div key={b.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{act?.emoji} {act?.title}</p>
                  <p className="text-sm text-gray-500">{b.date} · {b.people} people · LKR {b.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                    <button onClick={() => setStatus(b.id, "CANCELLED")} className="text-red-600 text-sm">Cancel</button>
                  )}
                  {b.status === "COMPLETED" && !b.review && (
                    <button onClick={() => setReviewing(b.id)} className="text-teal-700 text-sm">Write review</button>
                  )}
                </div>
              </div>
              {b.review && <p className="text-sm mt-2">{"⭐".repeat(b.review.rating)} {b.review.comment}</p>}
              {reviewing === b.id && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <select className="border rounded px-2 py-1" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}
                  </select>
                  <input className="border rounded px-2 py-1 flex-1" placeholder="Your feedback" value={comment} onChange={(e) => setComment(e.target.value)} />
                  <button disabled={!comment} onClick={() => { addReview(b.id, { rating, comment }); setReviewing(null); setComment("") }} className="bg-teal-600 text-white px-3 rounded disabled:opacity-40">Submit</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
