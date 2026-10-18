// Vercel Serverless Function (Node.js runtime, detectada automaticamente
// por estar en /api). Recibe el formulario de /contacto, valida,
// descarta bots y reenvia el mensaje por email via la API REST de
// Resend — sin libreria extra, un solo fetch.
//
// Variables de entorno requeridas (configurar en Vercel, no en el
// repo): RESEND_API_KEY y CONTACT_TO_EMAIL. Sin RESEND_API_KEY el
// endpoint responde 500 con un mensaje claro en vez de fallar en
// silencio o exponer el email destino al cliente — ese email solo
// vive en la variable de entorno del servidor, nunca en el bundle.
//
// Rate limit: best-effort en memoria por IP (Map a nivel de modulo).
// Una funcion serverless puede tener varias instancias en paralelo y
// cada una se reinicia en frio, asi que esto NO es un rate limit
// robusto — es una segunda barrera ademas del honeypot, no la unica.
// Si el volumen de spam lo justifica, migrar a @vercel/kv o Upstash
// para un contador compartido entre instancias.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { name, business, projectType, budget, message, website } = body;

  // Honeypot: campo oculto por CSS que un humano nunca llena. Si viene
  // con contenido, es un bot — se responde 200 igual para no darle
  // pistas, pero no se envia el email.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (!name?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  if (name.length > 200 || message.length > 5000) {
    return res.status(400).json({ ok: false, error: 'field_too_long' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    console.error('[api/contact] faltan RESEND_API_KEY o CONTACT_TO_EMAIL en las variables de entorno de Vercel');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const lines = [
    `Nombre: ${name}`,
    business ? `Negocio: ${business}` : null,
    projectType ? `Tipo de proyecto: ${projectType}` : null,
    budget ? `Presupuesto aproximado: ${budget}` : null,
    '',
    message,
  ].filter(Boolean);

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FS Orbit <web@fsorbit.com>',
        to: [toEmail],
        subject: `Nuevo contacto desde fsorbit.com — ${name}`,
        text: lines.join('\n'),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('[api/contact] Resend respondio con error:', resendRes.status, errText);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/contact] fallo al enviar:', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
