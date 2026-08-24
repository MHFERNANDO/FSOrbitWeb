import { cn } from '@/lib/utils';

// Trazo por defecto (matchea el look de linea del resto del sistema); las
// marcas (WhatsApp, Instagram) son macizas y pasan fill.
export default function Icon({ name, fill = false, className, ...props }) {
  return (
    <svg
      className={cn(
        'size-[1em] shrink-0 overflow-visible',
        fill ? 'fill-current stroke-none' : 'fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
