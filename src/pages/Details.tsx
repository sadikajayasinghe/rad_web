import { useState } from "react"
import { useStore } from "../store"

export default function Details() {
  const { selected: activity, user, book, go, bookings } = useStore()
  const [date, setDate] = useState("")
  const [people, setPeople] = useState(1)
  const [error, setError] = useState("")
  if (!activity) return null

  const reviews = bookings.filter((b) => b.activityId === activity.id && b.review)
  const canBook = user?.role === "tourist"

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => go("home")} className="text-teal-700 mb-4">← Back</button>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-6xl">{activity.emoji}</div>
        <h2 className="text-2xl font-bold mt-2">{activity.title}</h2>
        <p className="text-gray-500">📍 {activity.location} · Max {activity.maxPeople} people · by {activity.owner}</p>
        <p className="my-4">{activity.description}</p>

        <h3 className="font-semibold mb-2">Book this activity</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <input type="date" className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="number" min={1} max={activity.maxPeople} className="border rounded px-3 py-2 w-24" value={people} onChange={(e) => setPeople(Number(e.target.value))} />
          <span className="font-bold text-teal-700">Total: LKR {(people * activity.price).toLocaleString()}</span>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button
          disabled={!date || people < 1 || people > activity.maxPeople}
          onClick={() => (canBook ? setError(book(activity, date, people) ?? "") : go("login"))}
          className="mt-4 bg-teal-600 text-white px-5 py-2 rounded disabled:opacity-40"
        >
          {canBook ? "Book now" : user ? "Only tourists can book" : "Login as tourist to book"}
        </button>

        <h3 className="font-semibold mt-8 mb-2">Reviews ({reviews.length})</h3>
        {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
        {reviews.map((b) => (
          <div key={b.id} className="border-t py-2 text-sm">
            <b>{b.tourist}</b> {"⭐".repeat(b.review!.rating)}
            <p>{b.review!.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
