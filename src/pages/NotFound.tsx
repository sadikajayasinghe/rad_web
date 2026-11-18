import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-black text-indigo-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 text-sm max-w-sm mb-6">
        The destination you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow"
      >
        Return to Home
      </Link>
    </div>
  )
}
