import { PROSE_CLASS } from '@/components/os/constants'

import { cn } from '@/lib/utils'

import shelf from '@/assets/pixel/banners/stack-shelf.png'
import { skillsData } from '@/data/skills-data'
import '@/styles/sprites/stack-shelf.css'

/**
 * Skills window: skill groups, not an animated system-monitor parody. In
 * pixels (SPEC 1.5): the README stack shelf as its header picture (an
 * ambient loop: steam, a crab's claw, a whale's spout), chip 9-slices with
 * the daily driver of each group in lamp on the warm chip, and the tools of
 * before in a dotted outline.
 */
export default function SkillsApp() {
  return (
    <div className="@container flex flex-col gap-8">
      <header className="flex flex-col items-start gap-5 @min-[40rem]:flex-row-reverse @min-[40rem]:items-end @min-[40rem]:justify-end">
        <span
          aria-hidden
          className="os-night px-stack-shelf px-stack-shelf-loop ambient-loop block flex-none animate-(--px-loop)"
          style={{ backgroundImage: `url(${shelf.src})` }}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-display lamp-heading">Skills &amp; tools</h2>
          <p className={PROSE_CLASS}>
            What I reach for daily, grouped by layer of the stack. The first
            item in each group is what I live in; the rest are tools I&apos;m
            comfortable with. Dotted chips are tools I used before but
            don&apos;t reach for today.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {skillsData.map((col) => (
          <section key={col.group} className="flex flex-col gap-3">
            <h3 className="text-heading lamp-heading">{col.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {/* First chip is the daily driver: the intro copy promises
                  this hierarchy, so the visuals have to deliver it. */}
              {col.items.map((item, i) => (
                <li
                  key={item.n}
                  className={cn(
                    'text-label px-2',
                    i === 0
                      ? 'os-night px-chip-warm text-(--lamp)'
                      : item.previously
                        ? 'border-(length:--px) border-dotted border-(--frame) py-(--px) text-(--meta)'
                        : 'os-night px-chip text-(--ink)'
                  )}
                >
                  {item.n}
                  {item.previously && (
                    <span className="sr-only"> (previously)</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
