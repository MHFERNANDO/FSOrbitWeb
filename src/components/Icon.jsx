import { clsx } from 'clsx';

// clsx y no cn(): ningun uso de <Icon> pisa las clases base (size, fill,
// stroke), asi que tailwind-merge no aporta nada y su inicializacion
// (arma toda la config de Tailwind en el primer llamado) costaba ~60ms de
// hilo principal en la carga de cada ruta.
// Trazo por defecto (matchea el look de linea del resto del sistema); las
// marcas (WhatsApp, Instagram) son macizas y pasan fill.
export default function Icon({ name, fill = false, className, ...props }) {
  return (
    <svg
      className={clsx(
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
