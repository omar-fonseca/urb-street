interface CatalogStatusProps {
  status: "loading" | "success" | "empty" | "error" | "idle";
  error: string | null;
  onRetry: () => void;
}

function explainError(error: string | null): {
  headline: string;
  body: string;
  adminHint?: string;
} {
  const raw = (error ?? "").toLowerCase();

  if (
    raw.includes("orden does not exist") ||
    raw.includes("permission denied") ||
    raw.includes("producto_imagenes") ||
    raw.includes("could not find the table") ||
    raw.includes("pgrst")
  ) {
    return {
      headline: "Catálogo en configuración",
      body: "La base de datos aún no está alineada con la app. El resto del sitio (marca y WhatsApp) sigue disponible.",
      adminHint:
        "Admin: en Supabase SQL Editor ejecuta supabase/REPAIR.sql y luego pulsa Reintentar.",
    };
  }

  if (raw.includes("supabase no está configurado") || raw.includes("faltan")) {
    return {
      headline: "Catálogo no configurado",
      body: "Faltan las variables de entorno de Supabase en este entorno.",
      adminHint: "Admin: revisa el archivo .env (URL sin /rest/v1 + publishable key).",
    };
  }

  return {
    headline: "Catálogo temporalmente no disponible",
    body: error ?? "No pudimos conectar con el servidor. Intenta de nuevo.",
  };
}

export function CatalogStatus({ status, error, onRetry }: CatalogStatusProps) {
  if (status === "loading" || status === "idle") {
    return (
      <div className="py-24 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#E8151B] border-t-transparent rounded-full animate-spin" />
        <p className="font-condensed text-[#888] text-sm uppercase tracking-widest">
          Cargando catálogo…
        </p>
      </div>
    );
  }

  if (status === "error") {
    const msg = explainError(error);
    return (
      <div className="py-24 px-4 flex flex-col items-center gap-4 text-center max-w-lg mx-auto">
        <p className="font-condensed font-black text-xl uppercase tracking-widest text-[#F5F5F5]">
          {msg.headline}
        </p>
        <p className="font-condensed text-[#888] text-sm leading-relaxed">{msg.body}</p>
        {msg.adminHint && (
          <p className="font-condensed text-[#555] text-xs leading-relaxed border border-[#2A2A2A] px-4 py-3">
            {msg.adminHint}
          </p>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 bg-[#E8151B] text-white font-condensed font-black text-sm uppercase tracking-widest px-6 py-3 hover:bg-[#FF2020]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="py-24 px-4 flex flex-col items-center gap-3 text-center">
        <p className="font-condensed font-black text-xl uppercase tracking-widest text-[#F5F5F5]">
          Catálogo en preparación
        </p>
        <p className="font-condensed text-[#888] text-sm uppercase tracking-widest">
          Pronto verás las fotografías aquí. Escríbenos por WhatsApp.
        </p>
      </div>
    );
  }

  return null;
}
