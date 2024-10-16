import type { StaticImageData } from 'next/image'

import type { IconProps } from '@tabler/icons-react'

export interface Navlink {
  href: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactNode | IconProps | any
}

export type ProjectStatus =
  | 'Completed'
  | 'In Progress'
  | 'Cancelled'
  | 'On Hold'

export interface Project {
  title: string
  description: string
  thumbnail: StaticImageData
  images: StaticImageData[] | string[]
  href: string
  slug?: string
  stack: string[]
  status: ProjectStatus
  content: string
}
