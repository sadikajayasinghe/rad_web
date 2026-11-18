import { request } from "./api"
import type { AuthResponse, User, UserRole } from "./types"

export const authService = {
  register: (data: { name: string; email: string; password: string; role?: UserRole }) => {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: (data: { email: string; password: string }) => {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getMe: () => {
    return request<{ user: User }>("/auth/me", {
      method: "GET",
    })
  },

  refreshToken: (refreshToken: string) => {
    return request<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  },
}
