import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase/client";

type AuthListener = () => void;

let session: Session | null = null;
let ready = false;
const listeners = new Set<AuthListener>();
let subscribed = false;

function emit() {
  listeners.forEach((l) => l());
}

function ensureAuthSubscription() {
  if (subscribed || !isSupabaseConfigured) return;
  subscribed = true;
  const supabase = getSupabase();
  supabase.auth.getSession().then(({ data }) => {
    session = data.session;
    ready = true;
    emit();
  });
  supabase.auth.onAuthStateChange((_event, next) => {
    session = next;
    ready = true;
    emit();
  });
}

function subscribe(listener: AuthListener) {
  ensureAuthSubscription();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return session;
}

function getServerSnapshot() {
  return null;
}

export function useAuth() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [booting, setBooting] = useState(!ready && isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setBooting(false);
      return;
    }
    ensureAuthSubscription();
    if (ready) setBooting(false);
    return subscribe(() => setBooting(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase no configurado");
    }
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  }, []);

  return {
    user: (current?.user ?? null) as User | null,
    session: current,
    isAdmin: Boolean(current?.user),
    loading: booting,
    configured: isSupabaseConfigured,
    signIn,
    signOut,
  };
}
