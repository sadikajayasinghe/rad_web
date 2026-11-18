import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isProvider, isTourist } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl tracking-tight">
              <span>🏝️ Ceylon Travel</span>
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Activities
              </Link>

              {isAuthenticated && (isTourist || isAdmin) && (
                <Link
                  to="/bookings"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  My Bookings
                </Link>
              )}

              {isAuthenticated && (isProvider || isAdmin) && (
                <Link
                  to="/provider"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Provider Portal
                </Link>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{user.roles.join(", ").toLowerCase()}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
