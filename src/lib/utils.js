import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// "2026-11-05" -> "5 de noviembre de 2026". Fijo en UTC para que el HTML
// prerenderizado y el del navegador digan exactamente lo mismo.
const dateFmt = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (iso) => dateFmt.format(new Date(`${iso}T00:00:00Z`));
