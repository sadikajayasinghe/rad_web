import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { UserRole } from "../service/types"

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>(UserRole.TOURIST)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isRegister) {
        await register({ name, email, password, role })
      } else {
        await login({ email, password })
      }
      navigate("/")
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🌴</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {isRegister ? "Join Ceylon Travel" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister
              ? "Create your account to start booking adventures"
              : "Sign in to manage your bookings and activities"}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">I want to register as</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.TOURIST)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition ${
                    role === UserRole.TOURIST
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  🏖️ Tourist
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PROVIDER)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition ${
                    role === UserRole.PROVIDER
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  🛶 Activity Host
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl shadow transition text-sm"
          >
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError(null)
            }}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}
