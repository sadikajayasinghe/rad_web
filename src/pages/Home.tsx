import { useState } from "react"
import { useStore } from "../store"
import ActivityCard from "../components/ActivityCard"

export default function Home() {
  const { activities } = useStore()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [maxPrice, setMaxPrice] = useState(15000)

  const filtered = activities.filter(
    (a) =>
      a.approved &&
      (a.title + a.location).toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || a.category === category) &&
      a.price <= maxPrice
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Discover activities in Sri Lanka</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="border rounded px-3 py-2" placeholder="Search title or location" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option><option>Wildlife</option><option>Adventure</option><option>Culture</option>
        </select>
        <label className="flex items-center gap-2">
          Max LKR {maxPrice.toLocaleString()}
          <input type="range" min={2000} max={15000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a) => <ActivityCard key={a.id} activity={a} />)}
      </div>
      {filtered.length === 0 && <p className="text-gray-500">No activities found.</p>}
    </div>
  )
}
