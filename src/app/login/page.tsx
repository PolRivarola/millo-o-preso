"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch (err: any) {
      setError(err.message || "Error al enviar el magic link")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="space-y-6 max-w-md w-full border border-gray-800 p-8 rounded-lg bg-gray-950"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          🪄 Iniciar sesión
        </h1>

        <p className="text-gray-400 text-center">Accede a tu cuenta con un Magic Link</p>

        {sent ? (
          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-center">
            <p className="text-green-400">✅ Revisá tu correo para continuar.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Input
                type="email"
                className="h-12 w-full rounded-lg border-gray-800 bg-gray-900 px-4 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Enviar Magic Link
                  </span>
                )}
              </Button>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>
    </main>
  )
}

