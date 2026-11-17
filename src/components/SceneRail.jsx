import { useEffect, useState } from 'react';

// Indice del recorrido de la home (solo pantallas anchas): dice en que
// parte vas y deja saltar a otra. El nombre aparece al pasar el mouse o
// al llegar con el teclado.
export default function SceneRail({ items }) {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="rail" aria-label="Partes de esta página">
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? 'true' : undefined}>
              <span>{i.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
