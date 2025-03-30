"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [, setIsProcessing] = useState(true)
  const maxRetries = 3

  useEffect(() => {
    const supabase = createClient()

    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true)

        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")


        if (code) {
          try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("Error exchanging code for session:", exchangeError.message)
            }
          } catch (exchangeErr) {
            console.error("Exception during code exchange:", exchangeErr)
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError.message)
        }

        if (session) {
          console.log("Session established successfully")
          router.push("/app")
          return
        }

        if (retryCount < maxRetries) {
          console.log(`No session yet. Retrying (${retryCount + 1}/${maxRetries})...`)
          setRetryCount((prev) => prev + 1)

          setTimeout(() => {
            handleAuthCallback()
          }, 1500)
        } else {
          console.error("Failed to establish session after multiple attempts")
          setError("No se pudo establecer la sesión después de varios intentos")
          setIsProcessing(false)
        }
      } catch (err) {
        console.error("Unexpected error during auth callback:", err)
        setError("Ocurrió un error inesperado durante la autenticación")
        setIsProcessing(false)
      }
    }

    if (typeof window !== "undefined") {
      handleAuthCallback()
    }
  }, [router, retryCount])

  const handleRetry = () => {
    setError(null)
    setRetryCount(0)
    setIsProcessing(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-black p-4">
      {error ? (
        <div className="p-6 border border-red-800 rounded-lg bg-red-900/20 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error de autenticación</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={handleRetry} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Intentar nuevamente
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-400">
            {retryCount > 0
              ? `Verificando tu sesión... (Intento ${retryCount}/${maxRetries})`
              : "Verificando tu sesión..."}
          </p>
        </div>
      )}
    </main>
  )
}

