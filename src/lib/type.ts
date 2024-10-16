import type { IconProps } from '@tabler/icons-react'

export type Navlink = {
  href: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactNode | IconProps | any
}
