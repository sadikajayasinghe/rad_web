import { useState } from "react"
import { useActivities } from "../hooks/useActivities"
import ActivityCard from "../components/ActivityCard"
import LoadingSpinner from "../components/LoadingSpinner"

const CATEGORIES = ["All", "Adventure", "Ocean Adventure", "Wildlife", "Cultural", "Hiking", "Sightseeing"]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTerm, setLocationTerm] = useState("")

  const { activities, loading, error, setParams } = useActivities()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParams({
      search: searchTerm || undefined,
      location: locationTerm || undefined,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
    })
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setParams({
      search: searchTerm || undefined,
      location: locationTerm || undefined,
      category: category !== "All" ? category : undefined,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Discover Incredible Sri Lanka Experiences
        </h1>
        <p className="text-indigo-100 max-w-2xl text-base sm:text-lg mb-8">
          Browse verified excursions, safari adventures, scuba dives, and heritage tours with certified local guides.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex flex-col md:flex-row gap-3 shadow-inner"
        >
          <input
            type="text"
            placeholder="Search activities, surf, hike..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Location (e.g. Ella, Mirissa)"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            className="md:w-64 bg-white text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-xl text-sm shadow transition"
          >
            Find Adventures
          </button>
        </form>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {loading ? (
        <LoadingSpinner message="Loading popular activities..." />
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
          <p className="font-semibold">{error}</p>
          <p className="text-sm mt-1">Make sure rad_api backend is running on http://localhost:5000</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-800">No activities found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <ActivityCard key={act._id} activity={act} />
          ))}
        </div>
      )}
    </div>
  )
}
