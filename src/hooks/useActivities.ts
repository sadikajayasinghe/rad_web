import { useState, useEffect, useCallback } from "react"
import { activityService, type ActivityFilterParams } from "../service/activity.service"
import type { Activity } from "../service/types"

export function useActivities(initialParams?: ActivityFilterParams) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<ActivityFilterParams | undefined>(initialParams)

  const fetchActivities = useCallback(async () => {
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
  }, [params])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    error,
    params,
    setParams,
    refetch: fetchActivities,
  }
}
