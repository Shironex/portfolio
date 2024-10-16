/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StaticImageData } from 'next/image'

import type { IconProps } from '@tabler/icons-react'

export interface Navlink {
  href: string
  label: string
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

export interface Blog {
  title: string
  description: string
  date: string
  slug: string
  image: string
  tags?: string[]
  // rest
  [key: string]: any
}
