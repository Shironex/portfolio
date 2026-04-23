import { skillsData } from '@/data/skills-data'

/**
 * Skills window — skill groups, not an animated system-monitor parody.
 */
export default function SkillsApp() {
  return (
    <div className="font-body space-y-6">
      <header>
        <h2 className="font-display text-3xl text-ink font-semibold tracking-tight">
          Skills &amp; tools
        </h2>
        <p className="mt-1 font-body text-sm text-ink-3 max-w-prose">
          What I reach for daily, grouped by layer of the stack. The first
          item in each group is what I live in; the rest are tools I&apos;m
          comfortable with.
        </p>
      </header>

      <div className="space-y-5">
        {skillsData.map((col) => (
          <section key={col.group}>
            <h3 className="font-display text-lg text-ink font-semibold mb-3">
              {col.group}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {col.items.map((item) => (
                <span
                  key={item.n}
                  className="px-2.5 py-1 rounded-full border border-rule-2 bg-surf-0 text-xs font-mono text-ink-2"
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
