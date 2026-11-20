// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"

// Helper function to make API calls to backend
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken")

  // Set default headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  // If user is logged in, attach JWT token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // If response is not OK, throw error with backend message
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

// Helper to download ticket PDF from backend
export async function downloadFile(endpoint: string, filename: string): Promise<void> {
  const token = localStorage.getItem("accessToken")
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    throw new Error(`Failed to download file`)
  }

  // Create temporary link to trigger browser download
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
