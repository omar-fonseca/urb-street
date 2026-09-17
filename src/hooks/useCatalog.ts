import { useCallback, useEffect, useState } from "react";
import {
  CatalogError,
  fetchCatalog,
  fetchCatalogAdmin,
} from "@/services/catalog/catalogService";
import type { CatalogCategory, AsyncStatus } from "@/types/catalog";

export function useCatalog(adminMode: boolean) {
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [data, setData] = useState<CatalogCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const cats = adminMode ? await fetchCatalogAdmin() : await fetchCatalog();
      setData(cats);
      if (cats.length === 0) {
        setStatus("empty");
        return;
      }
      const hasVisiblePhotos = cats.some((c) =>
        c.products.some((p) => (p.images?.length ?? 0) > 0)
      );
      setStatus(hasVisiblePhotos || adminMode ? "success" : "empty");
    } catch (err) {
      const message =
        err instanceof CatalogError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Error al cargar el catálogo";
      setError(message);
      setData([]);
      setStatus("error");
    }
  }, [adminMode]);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, data, error, reload: load };
}
