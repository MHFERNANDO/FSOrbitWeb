// Fondo global fijo: reticula + vineta. Estatico, sin blur pesado.
export default function SiteBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[var(--z-bg)] overflow-hidden" aria-hidden="true">
      <div
        className="absolute -inset-px"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 0%, transparent 78%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 78% 8%, var(--signal-a06), transparent 62%), radial-gradient(ellipse 70% 50% at 12% 42%, rgba(93, 120, 255, .05), transparent 65%)',
        }}
      />
    </div>
  );
}
