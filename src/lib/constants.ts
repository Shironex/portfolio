import {
  IconArticle,
  IconBolt,
  IconBrandDiscord,
  IconBrandGithub,
  IconBriefcase2,
  IconMail,
  IconMessage2,
} from '@tabler/icons-react'

export const navlinks = [
  {
    href: '/',
    label: 'Home',
    icon: IconBolt,
  },
  {
    href: '/about',
    label: 'About',
    icon: IconMessage2,
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: IconBriefcase2,
  },
  {
    href: '/blog',
    label: 'Articles',
    icon: IconArticle,
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: IconMail,
  },
]

export const socials = [
  {
    href: 'https://github.com/Shironex',
    label: 'GitHub',
    icon: IconBrandGithub,
  },
  {
    href: 'https://discord.gg/ZpPwXMfU',
    label: 'Discord',
    icon: IconBrandDiscord,
  },
]
