import { useCallback, useEffect, useRef, useState } from "react";
import {
  CatalogError,
  fetchCatalog,
  fetchCatalogAdmin,
} from "@/services/catalog/catalogService";
import { getSupabase, isSupabaseConfigured } from "@/services/supabase/client";
import type { CatalogCategory, AsyncStatus } from "@/types/catalog";

/**
 * Catálogo con:
 * - carga inicial
 * - recarga suave (sin pantalla completa de loading al mutar)
 * - Realtime: si el admin agrega/borra fotos, el comprador se actualiza solo
 */
export function useCatalog(adminMode: boolean) {
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [data, setData] = useState<CatalogCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const applyResult = useCallback((cats: CatalogCategory[], soft: boolean) => {
    setData(cats);
    setError(null);
    if (cats.length === 0) {
      setStatus("empty");
      return;
    }
    // Mostrar las 8 categorías aunque aún no haya fotos (admin puede agregar)
    setStatus("success");
    if (!soft) hasLoadedOnce.current = true;
  }, []);

  const load = useCallback(
    async (opts?: { soft?: boolean }) => {
      const soft = Boolean(opts?.soft) && hasLoadedOnce.current;
      if (!soft) {
        setStatus("loading");
        setError(null);
      }
      try {
        const cats = adminMode ? await fetchCatalogAdmin() : await fetchCatalog();
        applyResult(cats, soft);
        hasLoadedOnce.current = true;
      } catch (err) {
        const message =
          err instanceof CatalogError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Error al cargar el catálogo";
        setError(message);
        if (!soft) {
          setData([]);
          setStatus("error");
        }
        // En soft (realtime), conservamos datos previos y no bloqueamos la UI
      }
    },
    [adminMode, applyResult]
  );

  useEffect(() => {
    hasLoadedOnce.current = false;
    void load({ soft: false });
  }, [load]);

  // Realtime: cualquier cambio en catálogo refresca la vista (admin y comprador)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabase();
    let timer: number | undefined;

    const scheduleReload = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void load({ soft: true });
      }, 250);
    };

    const channel = supabase
      .channel(`catalog-${adminMode ? "admin" : "public"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "producto_imagenes" },
        scheduleReload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        scheduleReload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categorias" },
        scheduleReload
      )
      .subscribe();

    return () => {
      window.clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [adminMode, load]);

  return {
    status,
    data,
    error,
    reload: () => load({ soft: true }),
    hardReload: () => load({ soft: false }),
  };
}
