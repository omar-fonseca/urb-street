/** Central WhatsApp config — single source of truth */
export const WHATSAPP_NUMBER = "573161416538";
export const WHATSAPP_DISPLAY = "+57 316 141 6538";

/**
 * Build a wa.me link with optional product context.
 */
export function waLink(productName?: string): string {
  const msg = productName
    ? `Hola, quiero información sobre: ${productName}.`
    : "Hola URB Street, quiero hacer un pedido.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function waCategoryLink(categoryName: string): string {
  const msg = `Hola, quiero ver más opciones de ${categoryName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function waBaseLink(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}
