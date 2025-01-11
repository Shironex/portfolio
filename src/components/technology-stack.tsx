import { Technology, TechnologyCategory } from '@/lib/type'

import { Badge } from './ui/badge'

interface TechnologyStackProps {
  technologies: Technology[]
}

const categoryLabels: Record<TechnologyCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  libraries: 'Libraries & Tools',
  tools: 'Tools',
  services: 'Services',
}

export function TechnologyStack({ technologies }: TechnologyStackProps) {
  const categorizedTech = technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = []
      }
      acc[tech.category].push(tech)
      return acc
    },
    {} as Record<TechnologyCategory, Technology[]>
  )

  return (
    <div className="space-y-4">
      {(Object.keys(categorizedTech) as TechnologyCategory[]).map(
        (category) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {categoryLabels[category]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categorizedTech[category].map((tech) => (
                <Badge
                  key={tech.name}
                  variant="secondary"
                  className="text-xs transition-colors hover:bg-secondary/80"
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}
