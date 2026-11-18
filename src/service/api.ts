const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, attempt token refresh or clear storage
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken && !endpoint.includes("/auth/refresh")) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })
        if (refreshRes.ok) {
          const data = await refreshRes.json()
          localStorage.setItem("accessToken", data.accessToken)
          headers["Authorization"] = `Bearer ${data.accessToken}`
          const retryRes = await fetch(url, { ...options, headers })
          if (!retryRes.ok) {
            const errData = await retryRes.json().catch(() => ({}))
            throw new Error(errData.message || `Request failed with status ${retryRes.status}`)
          }
          return retryRes.json()
        }
      } catch {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      }
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export async function downloadFile(endpoint: string, filename: string): Promise<void> {
  const token = localStorage.getItem("accessToken")
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`)
  }

  const blob = await response.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = downloadUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(downloadUrl)
}

export default { request, downloadFile }
