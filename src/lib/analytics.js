import { track } from '@vercel/analytics';

// Envoltorio fino sobre @vercel/analytics: un solo lugar para los
// nombres de evento, asi los 4 tipos de CTA que pide el brief (clics
// de WhatsApp, email, tel y envio de formulario) quedan consistentes
// en vez de strings sueltos repetidos por todos los componentes.
export function trackClick(channel, extra) {
  track('contact_click', { channel, ...extra });
}

export function trackFormSubmit(status) {
  track('contact_form_submit', { status });
}
