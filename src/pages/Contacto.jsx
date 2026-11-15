import { useState } from 'react';
import PageHead from '@/components/PageHead';
import { usePageSeo } from '@/hooks/usePageSeo';
import { contact, waLink } from '@/data/content';
import { trackClick } from '@/lib/analytics';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Contacto', path: '/contacto' },
];

const NEEDS = [
  { id: 'web', label: 'Una página web', text: 'quiero una página web para mi negocio' },
  { id: 'tienda', label: 'Una tienda online', text: 'quiero una tienda online' },
  { id: 'rediseno', label: 'Mejorar mi página actual', text: 'quiero mejorar la página web que ya tengo' },
  { id: 'mantenimiento', label: 'Mantenimiento', text: 'quiero cotizar el mantenimiento de mi página web' },
  { id: 'sistema', label: 'Un sistema a medida', text: 'necesito un sistema a medida' },
];
const MAX = 400;

function buildMessage(need, detail) {
  const base = need ? `Hola, ${need.text}.` : 'Hola, quiero hablar de un proyecto web.';
  const extra = detail.trim();
  return extra ? `${base} ${extra}` : base;
}

export default function Contacto() {
  usePageSeo({ path: '/contacto', crumbs: CRUMBS, type: 'ContactPage' });
  const [needId, setNeedId] = useState(null);
  const [detail, setDetail] = useState('');
  const [status, setStatus] = useState(null);

  const need = NEEDS.find((n) => n.id === needId) || null;
  const tooLong = detail.length > MAX;
  const message = buildMessage(need, tooLong ? detail.slice(0, MAX) : detail);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(contact.telDisplay);
      setStatus({ kind: 'ok', text: `Número copiado: ${contact.telDisplay}` });
    } catch {
      setStatus({ kind: 'error', text: `No se pudo copiar. Escríbelo a mano: ${contact.telDisplay}` });
    }
  }

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Escríbenos', 'por WhatsApp']}
        lead="Es la forma más rápida de empezar. Arma tu mensaje aquí y se abre WhatsApp con el texto listo; lo lees y lo envías tú."
      />

      <section className="wrap" aria-label="Armar el mensaje">
        <div className="split split--wide-first">
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              if (tooLong) return;
              trackClick('whatsapp', { source: 'contacto_mensaje', need: needId || 'sin_elegir' });
              window.open(waLink(message), '_blank', 'noopener');
              setStatus({ kind: 'ok', text: 'Abrimos WhatsApp en otra pestaña. ¿No se abrió? Copia el número y escríbenos desde tu teléfono.' });
            }}
          >
            <fieldset>
              <legend>¿Qué necesitas?</legend>
              <div className="chips">
                {NEEDS.map((n) => (
                  <label className="chip" key={n.id}>
                    <input type="radio" name="necesidad" value={n.id} checked={needId === n.id} onChange={() => setNeedId(n.id)} />
                    <span>{n.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="detalle">Cuéntanos un poco más (opcional)</label>
              <textarea
                id="detalle"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="A qué se dedica tu negocio, si ya tienes dominio, logo o fotos…"
                aria-invalid={tooLong}
                aria-describedby="detalle-ayuda"
              />
              <div className="field-meta" id="detalle-ayuda">
                {tooLong ? (
                  <span className="field-error" role="alert">
                    Te pasaste por {detail.length - MAX} caracteres. Acorta el texto; el resto nos lo cuentas en el chat.
                  </span>
                ) : (
                  <span>No guardamos nada: el texto solo viaja a tu WhatsApp.</span>
                )}
                <span>
                  {detail.length}/{MAX}
                </span>
              </div>
            </div>

            <div>
              <p className="preview-label">{need || detail.trim() ? 'Así llegará tu mensaje' : 'Si no eliges nada, el mensaje será este'}</p>
              <p className="preview">{message}</p>
            </div>

            <div className="actions">
              <button type="submit" className="btn" disabled={tooLong}>
                Abrir WhatsApp con este mensaje
              </button>
              <button type="button" className="btn btn--ghost" onClick={copyNumber}>
                Copiar el número
              </button>
            </div>
            <p className="status" role="status" data-kind={status?.kind}>
              {status?.text}
            </p>
          </form>

          <div className="stack-sm">
            <h2 className="h3">Otros canales</h2>
            <dl className="channels">
              <div>
                <dt>WhatsApp ventas</dt>
                <dd>
                  <a
                    className="link"
                    href={waLink('Hola, quiero cotizar un proyecto web')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('whatsapp', { source: 'contacto_ventas' })}
                  >
                    {contact.salesDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp soporte</dt>
                <dd>
                  <a
                    className="link"
                    href={waLink('Hola, necesito soporte técnico', contact.whatsappSupport)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('whatsapp', { source: 'contacto_soporte' })}
                  >
                    {contact.supportDisplay}
                  </a>{' '}
                  <span className="muted small">para un sitio que ya tienes con nosotros</span>
                </dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>
                  <a className="link" href={`tel:${contact.tel}`} onClick={() => trackClick('tel', { source: 'contacto_page' })}>
                    {contact.telDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>
                  <a className="link" href={`mailto:${contact.email}`} onClick={() => trackClick('email', { source: 'contacto_page' })}>
                    {contact.email}
                  </a>{' '}
                  <span className="muted small">para documentos o referencias</span>
                </dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>Cuenca, Azuay. Trabajamos de forma remota con negocios de todo Ecuador; no hay oficina abierta al público.</dd>
              </div>
            </dl>
            <p className="muted small">
              Para darte una propuesta clara nos sirve saber qué necesita tu negocio, para qué sirve la página y si ya tienes dominio,
              logo o fotos.
            </p>
          </div>
        </div>
      </section>
      <div style={{ height: 'var(--section-y)' }} />
    </main>
  );
}
