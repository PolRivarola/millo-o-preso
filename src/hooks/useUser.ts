"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"

type UserData = {
  id: string
  email: string
  plan: string
  last_used?: string
  [key: string]: unknown
}

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchUserData = useCallback(async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Error getting session:", sessionError)
        setUser(null)
        setLoading(false)
        return
      }

      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        setUser(null)
        setLoading(false)
        return
      }

      const { id, email, user_metadata } = userData.user

      setUser({
        id,
        email: email || "",
        plan: user_metadata?.plan || "free",
        last_used: user_metadata?.last_used || null,
        ...user_metadata,
      })
    } catch (error) {
      console.error("Error in fetchUserData:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserData()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserData])

  const refreshUser = useCallback(() => {
    setLoading(true)
    fetchUserData()
  }, [fetchUserData])

  return { user, loading, refreshUser }
}

