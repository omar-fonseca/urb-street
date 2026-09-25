import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Brand";

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onCancel: () => void;
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onLogin(email.trim(), pass);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Credenciales incorrectas");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>
        <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-8">
          <h2 className="font-condensed font-black text-2xl uppercase tracking-widest text-[#F5F5F5] mb-1">
            Administrador
          </h2>
          <p className="font-condensed text-[#555] text-sm uppercase tracking-widest mb-8">
            Acceso restringido — Supabase Auth
          </p>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr(null);
                }}
                className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 focus:outline-none focus:border-[#E8151B] transition-colors"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="font-condensed text-xs uppercase tracking-widest text-[#888] block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    setErr(null);
                  }}
                  className="w-full bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5] font-condensed text-sm px-3 py-2.5 pr-11 focus:outline-none focus:border-[#E8151B] transition-colors"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#555] hover:text-[#F5F5F5] transition-colors"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                      <path d="M9.9 5.1A10.5 10.5 0 0121 12c-.4.8-1 1.6-1.7 2.3M6.1 6.1C4.2 7.5 2.7 9.5 2 12c1.7 4.1 5.6 7 10 7 1.6 0 3.1-.3 4.5-1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {err && (
              <p className="font-condensed text-[#E8151B] text-xs uppercase tracking-widest">{err}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#E8151B] text-[#F5F5F5] font-condensed font-black text-sm uppercase tracking-widest py-3 hover:bg-[#FF2020] transition-colors mt-2 disabled:opacity-60"
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-4 font-condensed text-[#444] text-xs uppercase tracking-widest hover:text-[#888] transition-colors py-2"
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminModeBar({ onExit }: { onExit: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#E8151B] text-[#F5F5F5] px-4 py-2 flex items-center justify-between">
      <span className="font-condensed font-black text-sm uppercase tracking-[0.2em]">
        Modo administrador
      </span>
      <button
        type="button"
        onClick={onExit}
        className="font-condensed font-bold text-xs uppercase tracking-widest border border-white/40 px-3 py-1 hover:bg-white hover:text-[#E8151B] transition-colors"
      >
        Salir
      </button>
    </div>
  );
}
