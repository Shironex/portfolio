import {
  Code,
  Globe,
  Monitor,
  Package,
  Smartphone,
  Terminal,
} from 'lucide-react'

import { Project } from '@/types'

interface ProjectPlaceholderProps {
  project: Project
  className?: string
}

const projectTypeConfig = {
  web: {
    icon: Globe,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  cli: {
    icon: Terminal,
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  library: {
    icon: Package,
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  desktop: {
    icon: Monitor,
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
  mobile: {
    icon: Smartphone,
    gradient: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-500',
  },
  api: {
    icon: Code,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500',
  },
}

const ProjectPlaceholder = ({
  project,
  className,
}: ProjectPlaceholderProps) => {
  const projectType = project.projectType || 'web'
  const config = projectTypeConfig[projectType]
  const Icon = config.icon

  return (
    <div
      className={`flex items-center justify-center bg-linear-to-br ${config.gradient} ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Icon className={`h-16 w-16 ${config.iconColor}`} strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProjectPlaceholder
