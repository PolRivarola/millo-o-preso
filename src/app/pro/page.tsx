"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import FakeStripeModal from "@/components/fakePaymentModal/fakePaymentModal";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from 'lucide-react';

export default function ProPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setIsLoggedIn(false);
        return;
      }

      if (data.session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [supabase]);

  useEffect(() => {
    if (isLoggedIn === false) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 200); 

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  const handleUpgrade = async () => {
    setLoading(true);

    const { data: { session }, error } = await supabase.auth.getSession();
    const user = session?.user;

    if (error || !user) {
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { plan: "pro" },
    });

    if (updateError) {
    } else {
      await supabase.auth.refreshSession();
    }

    setLoading(false);
    setShowModal(false);
    router.push("/app");
  };

  if (isLoggedIn === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-gray-400">Verificando sesión...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-0 bg-black text-white">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          💼 Pasate al plan PRO
        </h1>
        
        <p className="text-gray-400 text-center max-w-md">
          ¿Querés analizar ideas ilimitadas, con más humor y cero culpa? <br />
        </p>

        <div className="p-6 border border-gray-800 rounded-lg bg-gray-950 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Plan PRO</h2>
            <p className="text-gray-400">Análisis ilimitados de ideas</p>
          </div>
          
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Ideas ilimitadas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Análisis detallados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Soporte prioritario
            </li>
          </ul>
          
          <Button
            onClick={() => setShowModal(true)}
            className="h-12 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Actualizar a Pro
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <FakeStripeModal
        visible={showModal}
        loading={loading}
        onCancel={() => setShowModal(false)}
        onConfirm={handleUpgrade}
      />
    </main>
  );
}
