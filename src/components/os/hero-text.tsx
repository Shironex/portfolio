const HERO_COPY = {
  eyebrow: 'Full-stack developer · TypeScript + Rust · remote, CET',
  greeting: "hi, I'm Kacper.",
  availability:
    'Open to full-time remote roles and to contracts or MVPs. Based in Poland, working on CET (UTC+1).',
  proof: [
    'Shiranami 2.0: moved my music player from Electron to Rust + Tauri, installer from 110 MB to 12.5 MB.',
    'AutoMaker: #1 contributor to an open-source AI dev studio with 3k+ stars.',
    '@noctcore/eslint-plugins: 13 packages, 110+ rules for bugs code review kept catching.',
  ],
} as const

/**
 * Text block of the hero: role line, headline, availability and proof
 * points. Rendered by both the server StaticHero and the client HeroPlate
 * so the first paint matches the hydrated desktop.
 */
export function HeroText() {
  return (
    <>
      <div className="text-ink-3 relative mb-3 font-mono text-[11px]">
        {HERO_COPY.eyebrow}
      </div>

      {/* On desktop the size also tracks viewport height, so short laptop
          screens keep the headline to three lines. */}
      <h1 className="font-display text-ink relative text-[clamp(32px,8vw,44px)] leading-[1.05] font-bold tracking-[-0.02em] md:text-[clamp(34px,min(3.2vw,5.6vh),54px)]">
        {HERO_COPY.greeting}
        <br />I build typed{' '}
        <span className="whitespace-nowrap">full-stack</span> systems and
        desktop apps.
      </h1>

      <p className="font-body text-ink-2 relative mt-3 max-w-xl text-[15px] leading-relaxed">
        {HERO_COPY.availability}
      </p>

      <ul className="font-body text-ink-3 relative mt-3 flex max-w-xl flex-col gap-1 text-[13px] leading-snug">
        {HERO_COPY.proof.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="text-miku">
              ›
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
