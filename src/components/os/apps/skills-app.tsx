import { skillsData } from '@/data/skills-data'

/**
 * Skills window — skill groups, not an animated system-monitor parody.
 */
export default function SkillsApp() {
  return (
    <div className="font-body space-y-6">
      <header>
        <h2 className="font-display text-ink text-3xl font-semibold tracking-tight">
          Skills &amp; tools
        </h2>
        <p className="font-body text-ink-3 mt-1 max-w-prose text-sm">
          What I reach for daily, grouped by layer of the stack. The first item
          in each group is what I live in; the rest are tools I&apos;m
          comfortable with.
        </p>
      </header>

      <div className="space-y-5">
        {skillsData.map((col) => (
          <section key={col.group}>
            <h3 className="font-display text-ink mb-3 text-lg font-semibold">
              {col.group}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {/* First chip is the daily driver — the intro copy promises
                  this hierarchy, so the visuals have to deliver it. */}
              {col.items.map((item, i) => (
                <span
                  key={item.n}
                  className={`rounded-full border px-2.5 py-1 font-mono text-xs ${
                    i === 0
                      ? 'border-miku/40 bg-miku/10 text-miku-2 font-semibold'
                      : 'border-rule-2 bg-surf-0 text-ink-2'
                  }`}
                >
                  {item.n}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
