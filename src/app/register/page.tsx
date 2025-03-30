"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            plan: "free",
            last_used: null,
          },
        },
      })

      if (error) {
        console.error("Error de registro:", error.message)
        setError(error.message)
      } else if (data.user) {
        console.log("Registro exitoso")
        router.push("/app")
      }
    } catch {
      setError("Error al registrar usuario");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <div className="max-w-md w-full">
        <form onSubmit={handleRegister} className="space-y-6 w-full border border-gray-800 p-8 rounded-lg bg-gray-950">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            🚀 Crear cuenta
          </h1>

          <p className="text-gray-400 text-center">Regístrate para comenzar a usar la aplicación</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                className="h-12 w-full rounded-lg border-gray-800 bg-gray-900 px-4 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Contraseña
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
                Confirmar contraseña
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
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Crear cuenta
                </span>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:text-primary/90">
              Inicia sesión
            </Link>
          </div>
        </form>

        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4 text-gray-400 hover:text-white border-gray-800 hover:bg-gray-900"
        >
          ← Volver
        </Button>
      </div>
    </main>
  )
}

