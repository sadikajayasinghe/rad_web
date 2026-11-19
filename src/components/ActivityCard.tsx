import { Link } from "react-router-dom"
import type { Activity } from "../service/types"

interface ActivityCardProps {
  activity: Activity
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const defaultImage =
    activity.images && activity.images.length > 0
      ? activity.images[0]
      : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={defaultImage}
          alt={activity.title}
          className="w-full h-full object-cover transition duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {activity.category}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-medium text-indigo-600 mb-1 flex items-center">
             {activity.location}
          </p>
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-2">
            {activity.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {activity.description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">From</span>
            <span className="text-lg font-bold text-indigo-600">
              ${activity.pricePerPerson}
            </span>
            <span className="text-xs text-gray-500 font-normal"> / person</span>
          </div>

          <Link
            to={`/activity/${activity._id}`}
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
