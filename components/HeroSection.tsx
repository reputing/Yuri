'use client'
export function HeroSection() {
  return (
    <div className="relative mb-12 px-8 py-12 rounded-2xl border border-border overflow-hidden text-center"
      style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1a3a 50%, #1a0a1e 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(233,30,140,0.15) 0%, transparent 65%)' }} />
      <h1 className="relative text-gradient text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3">YURI</h1>
      <p className="relative text-muted text-base mb-8">Your personal doujinshi library, powered by nhentai</p>
      <div className="relative flex justify-center gap-8 sm:gap-16">
        {[{ num: '500K+', label: 'Doujinshi' }, { num: 'Free', label: 'Always' }, { num: 'HD', label: 'Quality' }].map(s => (
          <div key={s.label}>
            <div className="text-2xl sm:text-3xl font-extrabold text-accent">{s.num}</div>
            <div className="text-[10px] text-faint uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
