import type { StaticImageData } from 'next/image'

import type { IconProps } from '@tabler/icons-react'

export type Navlink = {
  href: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactNode | IconProps | any
}

export type Project = {
  title: string
  description: string
  thumbnail: StaticImageData
  images: StaticImageData[] | string[]
  href: string
  slug?: string
  stack: string[]
  content?: React.ReactNode | string
}
