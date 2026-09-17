interface CatalogStatusProps {
  status: "loading" | "success" | "empty" | "error" | "idle";
  error: string | null;
  onRetry: () => void;
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
    return (
      <div className="py-24 px-4 flex flex-col items-center gap-4 text-center max-w-lg mx-auto">
        <p className="font-condensed font-black text-xl uppercase tracking-widest text-[#F5F5F5]">
          Catálogo temporalmente no disponible
        </p>
        <p className="font-condensed text-[#888] text-sm">
          {error ?? "No pudimos conectar con el servidor. Intenta de nuevo."}
        </p>
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
