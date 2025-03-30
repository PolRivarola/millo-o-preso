"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setHasSession(true)
      }
      setIsLoading(false)
    }

    checkSession()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        console.error("Error al actualizar contraseña:", error.message)
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/app")
        }, 2000)
      }
    } catch {
        setError("Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </main>
    )
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
        <div className="p-6 border border-red-800 rounded-lg bg-red-900/20 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Sesión no válida</h2>
          <p className="text-red-300 mb-4">No se encontró una sesión válida para actualizar la contraseña.</p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Volver al inicio de sesión
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <form
        onSubmit={handleUpdatePassword}
        className="space-y-6 max-w-md w-full border border-gray-800 p-8 rounded-lg bg-gray-950"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          🔐 Nueva contraseña
        </h1>

        <p className="text-gray-400 text-center">Establece tu nueva contraseña</p>

        {success ? (
          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg text-center">
            <p className="text-green-400">✅ Contraseña actualizada correctamente.</p>
            <p className="text-green-400 text-sm mt-2">Redirigiendo...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Nueva contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                className="h-12 w-full rounded-lg border-gray-800 bg-gray-900 px-4 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirmar nueva contraseña
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="h-12 w-full rounded-lg border-gray-800 bg-gray-900 px-4 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar nueva contraseña
                </span>
              )}
            </Button>
          </div>
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

