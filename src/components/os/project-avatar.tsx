import {
  ProjectIcon,
  type ProjectIconScale,
  ProjectTile,
  hasProjectIcon,
} from '@/components/pixel/project-icon'

interface ProjectAvatarProps {
  slug: string
  /** The project's name; its first letter goes on the tile of an icon-less project. */
  title: string
  /** 2 for the project window's hero (64 art px). */
  scale?: ProjectIconScale
  className?: string
}

/**
 * A project's picture across the OS (the Projects app, the featured panel,
 * the project window): its drawn 32x32 icon, which plays its tag once on
 * hover or focus of the control around it, or its first letter on the bare
 * tile (decision 3). Decorative: the name and description sit beside it.
 */
export function ProjectAvatar({
  slug,
  title,
  scale = 1,
  className,
}: ProjectAvatarProps) {
  if (hasProjectIcon(slug)) {
    return <ProjectIcon slug={slug} scale={scale} className={className} />
  }
  return (
    <ProjectTile
      letter={title.slice(0, 1)}
      scale={scale}
      className={className}
    />
  )
}
