import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

export function useAdminSession() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function syncSession() {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user || null;
      if (user) login(user);
      else logout();
      setChecking(false);
    }
    syncSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      if (user) login(user);
      else logout();
      setChecking(false);
    });

    return () => data.subscription.unsubscribe();
  }, [login, logout]);

  return { checking };
}
