import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "../service/auth.service"
import { UserRole, type User } from "../service/types"

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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken")
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem("accessToken")
      if (storedToken) {
        try {
          const res = await authService.getMe()
          setUser(res.user)
          localStorage.setItem("user", JSON.stringify(res.user))
        } catch {
          setUser(null)
          setToken(null)
          localStorage.removeItem("user")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }
      }
      setIsLoading(false)
    }

    fetchCurrentUser()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const response = await authService.login(credentials)
    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("refreshToken", response.refreshToken)
    localStorage.setItem("user", JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
  }

  const register = async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    const response = await authService.register(data)
    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("refreshToken", response.refreshToken)
    localStorage.setItem("user", JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

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

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
