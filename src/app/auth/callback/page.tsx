"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [,setIsProcessing] = useState(true);

  
  useEffect(() => {
    const supabase = createClient();
  
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
  
        const { data: { session }, error } = await supabase.auth.getSession();
  
        if (error) {
          console.error("Error al obtener sesión:", error.message);
          setError(error.message);
          setIsProcessing(false);
          return;
        }
  
        if (!session) {
          setTimeout(async () => {
            const retry = await supabase.auth.getSession();
            if (retry.data.session) {
              router.push("/app");
            } else {
              setError("No se pudo establecer la sesión");
              setIsProcessing(false);
            }
          }, 1000);
        } else {
          router.push("/app");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        setError("Ocurrió un error inesperado durante la autenticación");
        setIsProcessing(false);
      }
    };
  
    handleAuthCallback();
  }, [router]);
  

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-black p-4">
      {error ? (
        <div className="p-6 border border-red-800 rounded-lg bg-red-900/20 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error de autenticación</h2>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Volver al inicio de sesión
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-400">Verificando tu sesión...</p>
        </div>
      )}
    </main>
  );
}
