export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,85,247,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Vertical fade (top & bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--fs-background)] via-transparent to-[var(--fs-background)]" />
      {/* Radial fade from center */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, transparent 0%, var(--fs-background) 100%)' }}
      />
    </div>
  );
}
