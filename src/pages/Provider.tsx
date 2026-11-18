import { useState } from "react"
import { useStore } from "../store"
import StatusBadge from "../components/StatusBadge"

export default function Provider() {
  const { user, activities, bookings, addActivity, deleteActivity, setStatus } = useStore()
  const [f, setF] = useState({ title: "", location: "", category: "Wildlife", price: 5000, maxPeople: 10, emoji: "🌴", description: "" })
  const set = (k: string, v: string | number) => setF({ ...f, [k]: v })

  const mine = activities.filter((a) => a.owner === user?.name)
  const requests = bookings.filter((b) => mine.some((a) => a.id === b.activityId))

  return (
    <div className="p-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
        <h2 className="text-xl font-bold">Add activity</h2>
        <input className="border rounded px-3 py-2" placeholder="Title" value={f.title} onChange={(e) => set("title", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Location" value={f.location} onChange={(e) => set("location", e.target.value)} />
        <select className="border rounded px-3 py-2" value={f.category} onChange={(e) => set("category", e.target.value)}>
          <option>Wildlife</option><option>Adventure</option><option>Culture</option>
        </select>
        <div className="flex gap-2">
          <input type="number" className="border rounded px-3 py-2 w-1/2" placeholder="Price (LKR)" value={f.price} onChange={(e) => set("price", Number(e.target.value))} />
          <input type="number" className="border rounded px-3 py-2 w-1/2" placeholder="Max people" value={f.maxPeople} onChange={(e) => set("maxPeople", Number(e.target.value))} />
        </div>
        <textarea className="border rounded px-3 py-2" placeholder="Description" value={f.description} onChange={(e) => set("description", e.target.value)} />
        <button disabled={!f.title || !f.location} onClick={() => addActivity(f)} className="bg-teal-600 text-white py-2 rounded disabled:opacity-40">Submit for approval</button>

        <h3 className="font-semibold mt-4">My activities</h3>
        {mine.map((a) => (
          <div key={a.id} className="flex justify-between text-sm border-t pt-2">
            <span>{a.emoji} {a.title} {a.approved ? "✅" : "⏳ waiting for admin"}</span>
            <button onClick={() => deleteActivity(a.id)} className="text-red-600">Delete</button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-bold mb-2">Booking requests</h2>
        {requests.length === 0 && <p className="text-gray-500 text-sm">No requests yet.</p>}
        {requests.map((b) => {
          const act = activities.find((a) => a.id === b.activityId)
          return (
            <div key={b.id} className="border-t py-3 text-sm">
              <p className="font-semibold">{act?.title} · {b.tourist}</p>
              <p className="text-gray-500">{b.date} · {b.people} people · LKR {b.total.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={b.status} />
                {b.status === "PENDING" && (
                  <>
                    <button onClick={() => setStatus(b.id, "CONFIRMED")} className="text-green-700">Accept</button>
                    <button onClick={() => setStatus(b.id, "REJECTED")} className="text-red-600">Reject</button>
                  </>
                )}
                {b.status === "CONFIRMED" && <button onClick={() => setStatus(b.id, "COMPLETED")} className="text-blue-700">Mark completed</button>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
