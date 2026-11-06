// Imagen de proyecto responsive: WebP en 3 anchos (scripts/optimize-images.mjs)
// con srcset/sizes y width/height reales para reservar el espacio.
const WIDTHS = [480, 960, 1440];

export default function ProjectImage({ project, sizes, priority = false, className, style }) {
  const base = `/assets/${project.img}`;
  return (
    <img
      src={`${base}-960.webp`}
      srcSet={WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      alt={project.alt}
      width={project.w}
      height={project.h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
