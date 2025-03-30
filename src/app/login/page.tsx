"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.push("/app");
      }
    } catch  {
      setError("Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <div className="max-w-md w-full">
        <form 
          onSubmit={handleLogin} 
          className="space-y-6 w-full border border-gray-800 p-8 rounded-lg bg-gray-950"
        >
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            🔐 Iniciar sesión
          </h1>
          
          <p className="text-gray-400 text-center">
            Accede a tu cuenta con email y contraseña
          </p>

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Contraseña
                </label>
              </div>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
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
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary hover:text-primary/90">
              Regístrate
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
  );
}
