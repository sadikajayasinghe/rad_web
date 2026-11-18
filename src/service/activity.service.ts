import { request } from "./api"
import type { Activity } from "./types"

export interface ActivityFilterParams {
  category?: string
  location?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}

export const activityService = {
  getActivities: (params?: ActivityFilterParams) => {
    const query = new URLSearchParams()
    if (params?.category) query.append("category", params.category)
    if (params?.location) query.append("location", params.location)
    if (params?.search) query.append("search", params.search)
    if (params?.minPrice !== undefined) query.append("minPrice", String(params.minPrice))
    if (params?.maxPrice !== undefined) query.append("maxPrice", String(params.maxPrice))

    const queryString = query.toString() ? `?${query.toString()}` : ""
    return request<{ count: number; activities: Activity[] }>(`/activities${queryString}`)
  },

  getActivityById: (id: string) => {
    return request<{ activity: Activity }>(`/activities/${id}`)
  },

  getMyActivities: () => {
    return request<{ activities: Activity[] }>("/activities/provider/my-activities")
  },

  createActivity: (data: Partial<Activity>) => {
    return request<{ message: string; activity: Activity }>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateActivity: (id: string, data: Partial<Activity>) => {
    return request<{ message: string; activity: Activity }>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteActivity: (id: string) => {
    return request<{ message: string }>(`/activities/${id}`, {
      method: "DELETE",
    })
  },
}
