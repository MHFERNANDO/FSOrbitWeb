import { useState } from 'react';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs } from '@/seo/jsonld';
import { contact } from '@/data/content';

const WA_BASE = 'https://wa.me/593983113942?text=';

const FIELD_CLASS =
  'w-full rounded-r2 border border-[color:var(--line-2)] bg-ink-900 px-s4 py-s3 text-text placeholder:text-text-4 outline-none transition-colors focus:border-signal';

function Field({ label, children }) {
  return (
    <label className="grid gap-s2">
      <span className="font-mono text-[length:var(--fs-small)] uppercase tracking-[var(--tr-mono)] text-text-3">{label}</span>
      {children}
    </label>
  );
}

export default function Contacto() {
  useSeo({
    title: 'Contacto | FS Orbit — Desarrollo Web en Cuenca, Ecuador',
    description: 'Contáctanos para tu proyecto web: formulario, WhatsApp, correo o teléfono. FS Orbit — base en Cuenca, atendemos cualquier ubicación en Ecuador.',
    path: '/contacto',
    jsonLd: breadcrumbs([
      { name: 'Inicio', path: '/' },
      { name: 'Contacto', path: '/contacto' },
    ]),
  });

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('request_failed');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-signal">
          Contacto
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Hablemos de' }, { break: true }, { text: 'tu proyecto.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          Con base en Cuenca, atendemos proyectos en cualquier ubicación de Ecuador. Escríbenos por el canal que prefieras.
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s9 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.2fr]">
          <Reveal as="div" type="rise" className="grid content-start gap-s6">
            <a
              href={`${WA_BASE}${encodeURIComponent('Hola, quiero cotizar un proyecto web')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-s4 rounded-r3 border border-[color:var(--line)] p-s5 transition-colors hover:border-signal"
            >
              <span className="grid size-12 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal">
                <Icon name="whatsapp" fill className="text-xl" />
              </span>
              <span className="grid">
                <span className="text-[length:var(--fs-small)] text-text-3">WhatsApp</span>
                <strong className="text-text">Cotiza tu proyecto ahora</strong>
              </span>
            </a>

            <a href={`tel:${contact.tel}`} className="group flex items-center gap-s4 rounded-r3 border border-[color:var(--line)] p-s5 transition-colors hover:border-signal">
              <span className="grid size-12 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal">
                <Icon name="phone" className="text-xl" />
              </span>
              <span className="grid">
                <span className="text-[length:var(--fs-small)] text-text-3">Teléfono</span>
                <strong className="text-text">{contact.telDisplay}</strong>
              </span>
            </a>

            <a href={`mailto:${contact.email}`} className="group flex items-center gap-s4 rounded-r3 border border-[color:var(--line)] p-s5 transition-colors hover:border-signal">
              <span className="grid size-12 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal">
                <Icon name="mail" className="text-xl" />
              </span>
              <span className="grid">
                <span className="text-[length:var(--fs-small)] text-text-3">Correo</span>
                <strong className="text-text">{contact.email}</strong>
              </span>
            </a>

            <div className="flex items-center gap-s4 rounded-r3 border border-[color:var(--line)] p-s5">
              <span className="grid size-12 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal">
                <Icon name="pin" className="text-xl" />
              </span>
              <span className="grid">
                <span className="text-[length:var(--fs-small)] text-text-3">Zona de servicio</span>
                <strong className="text-text">Cuenca, Azuay — proyectos en todo Ecuador</strong>
              </span>
            </div>
          </Reveal>

          <Reveal as="form" type="rise" index={1} onSubmit={handleSubmit} className="grid gap-s5">
            {/* Honeypot: invisible para una persona, cualquier bot que
                autocompleta formularios suele llenarlo igual. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <Field label="Nombre *">
              <input required name="name" type="text" className={FIELD_CLASS} placeholder="Tu nombre" />
            </Field>
            <Field label="Negocio">
              <input name="business" type="text" className={FIELD_CLASS} placeholder="Nombre de tu negocio (opcional)" />
            </Field>
            <Field label="Tipo de proyecto">
              <select name="projectType" defaultValue="" className={FIELD_CLASS}>
                <option value="" disabled>Selecciona una opción</option>
                <option value="Web nueva">Web nueva</option>
                <option value="Tienda online">Tienda online</option>
                <option value="Rediseño / optimización">Rediseño / optimización</option>
                <option value="Software a medida">Software a medida</option>
                <option value="Otro">Otro</option>
              </select>
            </Field>
            <Field label="Presupuesto aproximado">
              <input name="budget" type="text" className={FIELD_CLASS} placeholder="Ej. $200 - $500 (opcional)" />
            </Field>
            <Field label="Mensaje *">
              <textarea required name="message" rows={5} className={FIELD_CLASS} placeholder="Cuéntanos sobre tu proyecto" />
            </Field>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:bg-signal-2 disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            </button>

            {status === 'sent' && (
              <p role="status" className="text-signal">
                Mensaje enviado. Te responderemos pronto.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="text-warn">
                No pudimos enviar tu mensaje. Escríbenos directo por WhatsApp o a {contact.email}.
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
