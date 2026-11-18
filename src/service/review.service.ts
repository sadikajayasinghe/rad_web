import { request } from "./api"
import type { Review } from "./types"

export const reviewService = {
  getActivityReviews: (activityId: string) => {
    return request<{ reviews: Review[] }>(`/reviews/activity/${activityId}`)
  },

  createReview: (data: {
    activityId: string
    bookingId: string
    rating: number
    comment: string
  }) => {
    return request<{ message: string; review: Review }>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  deleteReview: (id: string) => {
    return request<{ message: string }>(`/reviews/${id}`, {
      method: "DELETE",
    })
  },
}
