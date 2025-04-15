"use client"

import { useState, useEffect } from "react"

export const useProblem = (problemTitle: string) => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/problem/${problemTitle}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        setData(json)
      } catch (e: any) {
        setError(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [problemTitle])

  return { data, isLoading, error }
}

