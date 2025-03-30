import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
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

    if (process.env.NODE_ENV === "development") {
      throw new Error("Supabase URL or Anon Key is missing!")
    }
  }

  supabaseInstance = createSupabaseClient(supabaseUrl || "", supabaseAnonKey || "", {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

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

