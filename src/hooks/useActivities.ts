import { useState, useEffect } from "react"
import { activityService, type ActivityFilterParams } from "../service/activity.service"
import type { Activity } from "../service/types"


export function useActivities(initialParams?: ActivityFilterParams) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<ActivityFilterParams | undefined>(initialParams)

  
  const fetchActivities = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await activityService.getActivities(params)
      setActivities(res.activities || [])
    } catch (err: any) {
      setError(err.message || "Failed to fetch activities")
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    fetchActivities()
  }, [params])

  return {
    activities,
    loading,
    error,
    params,
    setParams,
    refetch: fetchActivities,
  }
}
