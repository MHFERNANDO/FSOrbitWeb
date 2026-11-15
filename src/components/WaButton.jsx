import { waLink } from '@/data/content';
import { trackClick } from '@/lib/analytics';

const DEFAULT_TEXT = 'Hola, vi la página de FS Orbit y quiero hablar de mi proyecto';

// El unico camino de contacto del sitio. La etiqueta dice lo que pasa:
// se abre WhatsApp con un mensaje ya escrito.
export default function WaButton({ text = DEFAULT_TEXT, source, number, variant = '', children = 'Escribir por WhatsApp', ...rest }) {
  return (
    <a
      className={`btn ${variant}`}
      href={waLink(text, number)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick('whatsapp', { source })}
      {...rest}
    >
      {children}
    </a>
  );
}
