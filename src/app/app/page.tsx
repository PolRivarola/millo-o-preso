"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

type Response = {
  verdict: string
  explanation: string
}

export default function AppPage() {
  const { user, loading } = useUser()
  const router = useRouter()

  const [idea, setIdea] = useState("")
  const [response, setResponse] = useState<Response | null>(null)
  const [canUse, setCanUse] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirige si no está logueado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Controla límite diario para usuarios Free
  useEffect(() => {
    if (!user) return

    const checkUsage = () => {
      const lastUsed = localStorage.getItem("lastIdeaUsed")
      const today = new Date().toDateString()

      if (user.plan === "free" && lastUsed === today) {
        setCanUse(false)
      } else {
        setCanUse(true)
      }
    }

    checkUsage()
  }, [user])

  // Si todavía está cargando
  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </main>
    )
  }

  // Enviar idea a la API
  const handleSubmit = async () => {
    if (!idea.trim() || (!canUse && user.plan === "free")) return

    setIsSubmitting(true)
    setResponse(null)

    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    })

    const data = await res.json()
    setResponse(data)
    setIsSubmitting(false)

    if (user.plan === "free") {
      const today = new Date().toDateString()
      localStorage.setItem("lastIdeaUsed", today)
      setCanUse(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Idea millonaria 
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          o Estafa piramidal
            </span>
          </h1>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-400">
            Millo o Pira es una app que analiza tus ideas de negocio con inteligencia artificial y las clasifica como una posible bomba millonaria 💸 o una evidente estafa piramidal 🔺.
            Solo pegás tu idea, y una IA irónica te da un veredicto con una explicación graciosa.
            Ideal para emprendedores con dudas... o demasiado entusiasmo.
            </p>
          
            
            <p className="text-gray-400">
              Plan actual: <strong className="text-primary">{user.plan.toUpperCase()}</strong>
            </p>

            
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full">
          <Textarea
            className="h-32 w-full rounded-lg border-gray-800 bg-gray-950 px-4 py-3 text-white placeholder:text-gray-400 focus-visible:ring-primary text-lg resize-none"
            placeholder="Pegá tu idea de negocio acá..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!canUse && user.plan === "free")}
            className={`h-14 w-full rounded-lg text-lg font-bold ${
              canUse || user.plan === "pro"
                ? "bg-blue-600 text-primary-foreground hover:bg-primary/90"
                : "bg-gray-700 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluando...
              </span>
            ) : canUse || user.plan === "pro" ? (
              "Analizar"
            ) : (
              "Límite alcanzado (Free)"
            )}
          </Button>
          {user.plan === "free" && (
              <Button variant="link" onClick={() => router.push("/pro")} className="text-primary hover:text-primary/80">
                🚀 Pasate al plan PRO
              </Button>
            )}
        </div>

        {response && (
          <div className="mt-6 p-6 bg-gray-950 border border-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {response.verdict}
            </h2>
            <p className="mt-4 text-gray-300">{response.explanation}</p>
          </div>
        )}
      </div>
    </main>
  )
}

