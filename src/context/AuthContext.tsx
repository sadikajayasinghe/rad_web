import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "../service/auth.service"
import { UserRole, type User } from "../service/types"

// Auth context state interface
interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isProvider: boolean
  isTourist: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string; role?: UserRole }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read saved user and token from browser storage on startup
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken")
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Verify current user details with backend
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem("accessToken")
      if (storedToken) {
        try {
          const res = await authService.getMe()
          setUser(res.user)
          localStorage.setItem("user", JSON.stringify(res.user))
        } catch {
          // If token expired or invalid, logout user
          logout()
        }
      }
      setIsLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Handle user login
  const login = async (credentials: { email: string; password: string }) => {
    const res = await authService.login(credentials)
    localStorage.setItem("accessToken", res.accessToken)
    localStorage.setItem("refreshToken", res.refreshToken)
    localStorage.setItem("user", JSON.stringify(res.user))
    setToken(res.accessToken)
    setUser(res.user)
  }

  // Handle new user registration
  const register = async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    const res = await authService.register(data)
    localStorage.setItem("accessToken", res.accessToken)
    localStorage.setItem("refreshToken", res.refreshToken)
    localStorage.setItem("user", JSON.stringify(res.user))
    setToken(res.accessToken)
    setUser(res.user)
  }

  // Handle user logout
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  // Helper flags for roles
  const roles = user?.roles || []
  const isAdmin = roles.includes(UserRole.ADMIN)
  const isProvider = roles.includes(UserRole.PROVIDER)
  const isTourist = roles.includes(UserRole.TOURIST)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isProvider,
        isTourist,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access auth anywhere
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
