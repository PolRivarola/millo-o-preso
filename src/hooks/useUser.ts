"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type UserInfo = {
  email: string;
  plan: "free" | "pro";
};

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const metadata = data.session.user.user_metadata || {};
      const plan = metadata.plan === "pro" ? "pro" : "free";

      setUser({
        email: data.session.user.email ?? "",
        plan,
      });

      setLoading(false);
    };

    loadUser();
  }, []);

  return { user, loading };
}
