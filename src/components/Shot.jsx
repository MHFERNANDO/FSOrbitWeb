import { useState } from 'react';

// Captura de un caso. Si la imagen falla, lo explica en vez de dejar un hueco.
export default function Shot({ project, sizes = '100vw', eager = false }) {
  const [failed, setFailed] = useState(false);
  const base = `/assets/${project.img}`;
  return (
    <div className="shot" data-failed={failed}>
      <img
        src={`${base}-960.webp`}
        srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1440.webp 1440w`}
        sizes={sizes}
        width={project.w}
        height={project.h}
        alt={project.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
      />
      <p className="shot-fallback">No se pudo cargar la captura de {project.title}.</p>
    </div>
  );
}
