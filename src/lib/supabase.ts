import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  // If we already have an instance, return it (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing!", {
      urlExists: !!supabaseUrl,
      keyExists: !!supabaseAnonKey,
    })

    // Throw an error in development, but in production we'll return a dummy client
    if (process.env.NODE_ENV === "development") {
      throw new Error("Supabase URL or Anon Key is missing!")
    }
  }

  // Create the Supabase client with explicit options
  supabaseInstance = createSupabaseClient(supabaseUrl || "", supabaseAnonKey || "", {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

// This function can be used to check if the environment variables are set correctly
export const checkSupabaseEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return {
    urlExists: !!url,
    keyExists: !!key,
    urlValue: url ? `${url.substring(0, 8)}...` : "missing",
    keyValue: key ? `${key.substring(0, 5)}...` : "missing",
  }
}

