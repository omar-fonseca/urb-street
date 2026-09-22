import { useState } from "react";
import { AdminLogin, AdminModeBar } from "@/features/admin/AdminChrome";
import { useAuth } from "@/features/auth/useAuth";
import { CatalogStatus } from "@/features/catalog/CatalogStatus";
import { CategorySection, GrungeDivider } from "@/features/catalog/CategorySection";
import { Hero } from "@/features/catalog/Hero";
import { FloatingWA, PublicFooter, WhatsAppBanner } from "@/features/catalog/PublicFooter";
import { PublicHeader } from "@/features/catalog/PublicHeader";
import { useCatalog } from "@/hooks/useCatalog";
import {
  addImageToProduct,
  createProductWithImage,
  removeImage,
  renameProduct,
} from "@/services/catalog/adminImageService";
import {
  defaultProductRef,
  normalizeProductRef,
  PRODUCT_REF_MAX,
} from "@/lib/productRef";
import type { CatalogCategory, Product } from "@/types/catalog";

type View = "catalog" | "login";

export default function App() {
  const { isAdmin, signIn, signOut, loading: authLoading } = useAuth();
  const [view, setView] = useState<View>("catalog");
  const [busyMsg, setBusyMsg] = useState<string | null>(null);

  const adminMode = isAdmin && view === "catalog";
  const { status, data, error, reload } = useCatalog(adminMode);

  const handleAddImage = async (product: Product, file: File) => {
    const cat = data.find((c) => c.id === product.categoria_id);
    if (!cat) return;
    setBusyMsg("Subiendo imagen…");
    try {
      await addImageToProduct(product.id, cat.slug, file);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setBusyMsg(null);
    }
  };

  const handleDeleteImage = async (_product: Product, imageId: string) => {
    setBusyMsg("Eliminando imagen…");
    try {
      await removeImage(imageId);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setBusyMsg(null);
    }
  };

  const handleRename = async (product: Product, nombre: string) => {
    const cat = data.find((c) => c.id === product.categoria_id);
    if (!cat) return;
    setBusyMsg("Guardando referencia…");
    try {
      await renameProduct(product.id, nombre, cat.slug);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setBusyMsg(null);
    }
  };

  const handleAddProductImage = async (category: CatalogCategory, file: File) => {
    const fallback = defaultProductRef(category.slug);
    const asked = window.prompt(
      `Referencia corta (máx. ${PRODUCT_REF_MAX} caracteres)\nEj: Camisa oversize talla L\nSi dejas vacío se usará: ${fallback}`,
      fallback
    );
    if (asked == null) return;
    const normalized = normalizeProductRef(asked, category.slug);
    if (!normalized.ok) {
      window.alert(normalized.error);
      return;
    }
    setBusyMsg("Agregando fotografía…");
    try {
      await createProductWithImage(category.id, category.slug, file, normalized.value);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Error al agregar");
    } finally {
      setBusyMsg(null);
    }
  };

  const handleExitAdmin = async () => {
    await signOut();
    setView("catalog");
  };

  if (view === "login") {
    return (
      <AdminLogin
        onLogin={async (email, password) => {
          await signIn(email, password);
          setView("catalog");
        }}
        onCancel={() => setView("catalog")}
      />
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#E8151B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-[#F5F5F5] ${adminMode ? "pt-10" : ""}`}>
      {adminMode && <AdminModeBar onExit={handleExitAdmin} />}
      <PublicHeader
        cats={data}
        onAdminMenu={adminMode ? undefined : () => setView("login")}
      />
      <Hero firstCatId={data[0]?.slug ?? "gorras"} />
      <main>
        {(status === "loading" || status === "error" || status === "empty") && (
          <CatalogStatus status={status} error={error} onRetry={reload} />
        )}
        {status === "success" &&
          data.map((cat, i) => (
            <div key={cat.id}>
              <CategorySection
                category={cat}
                isAdmin={adminMode}
                onAddImage={handleAddImage}
                onDeleteImage={handleDeleteImage}
                onRename={handleRename}
                onAddProductImage={handleAddProductImage}
              />
              {i < data.length - 1 && <GrungeDivider />}
            </div>
          ))}
      </main>
      <WhatsAppBanner />
      <PublicFooter />
      {!adminMode && <FloatingWA />}
      {busyMsg && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center">
          <p className="font-condensed font-black uppercase tracking-widest text-[#F5F5F5] bg-[#0F0F0F] border border-[#2A2A2A] px-6 py-4">
            {busyMsg}
          </p>
        </div>
      )}
    </div>
  );
}
