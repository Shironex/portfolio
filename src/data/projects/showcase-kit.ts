import { Project } from '@/types'

export const showcaseKit: Project = {
  id: 'showcase-kit',
  slug: 'showcase-kit',
  title: '@noctcore/showcase-kit',
  summary:
    'A CLI that captures, frames and exports showcase images of web, Electron and terminal apps for READMEs and portfolios, from one config file. Same pixels, every run.',
  description: [
    'Screenshots in a README go stale every time the UI changes, and retaking them by hand never gives the same crop twice. With showcase-kit one config file describes the app and the views worth showing, and the showcase CLI drives it: a web app in headless Chromium, an Electron app over the Chrome DevTools Protocol, or a terminal app in a pseudo terminal.',
    'Before the shutter it turns off motion, zeroes transitions, finishes or resets animations, hides the caret and waits for fonts; a terminal app gets a fixed size, a fixed time zone and locale and a bundled font. Each view is settled and captured at a fixed viewport and device scale factor, so a rerun gives the same pixels.',
    'From one config it writes raw captures in every UI language, framed README images in six frame styles on solid, gradient, mesh, dotted, grainy or transparent backgrounds, exact-size 16:9 portfolio images with a thumbnail and a gallery JSON, a README snippet in five layouts, hero banners in six layouts, animated terminal clips and app icon sets.',
    'Several of the project images on this site come from it: a small config per docs site captures the live pages and exports them straight into the portfolio. Version 0.3.1 is on npm, and the docs gallery shows every output, made from a made-up app with the config that produced it.',
  ],
  image: '/projects/showcase-kit/thumbnail.webp',
  projectType: 'cli',
  gallery: [
    {
      src: '/projects/showcase-kit/home.webp',
      alt: 'noctcore showcase-kit: Docs home',
      caption: 'Docs home: one config file, the same pixels on every run.',
    },
    {
      src: '/projects/showcase-kit/gallery.webp',
      alt: 'noctcore showcase-kit: the hero layouts section of the gallery',
      caption:
        'The gallery: the same hero banner in each layout, with the config that made it.',
    },
    {
      src: '/projects/showcase-kit/portfolio.webp',
      alt: 'noctcore showcase-kit: Portfolio guide',
      caption:
        'The portfolio guide: exact-size images, a thumbnail and the gallery JSON.',
    },
  ],
  technologies: ['TypeScript', 'Playwright', 'Node.js'],
  features: [
    'One config file for web apps, Electron apps over CDP and terminal apps in a pseudo terminal',
    'Deterministic captures: motion off, animations settled, caret hidden, fonts loaded',
    'Raw captures in every UI language at a fixed viewport and scale',
    'Framed README images in six frame styles and six background types, as WebP or PNG',
    'Exact-size portfolio images with a thumbnail and a gallery JSON',
    'README snippets in five layouts and hero banners in six',
    'Animated WebP and GIF clips of terminal apps, and app icon sets',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Node.js 22+',
      'Playwright',
      'Chrome DevTools Protocol',
      'node-pty (terminal apps)',
      'Astro Starlight (docs)',
      'GitHub Actions',
    ],
  },
  status: 'shipped',
  duration: 'Ongoing (maintained)',
  demoUrl: '',
  githubUrl: 'https://github.com/noctcore/showcase-kit',
  links: [
    {
      label: 'docs',
      url: 'https://noctcore.github.io/showcase-kit/',
      kind: 'docs',
    },
    {
      label: 'gallery',
      url: 'https://noctcore.github.io/showcase-kit/gallery/',
      kind: 'other',
    },
    {
      label: 'npm',
      url: 'https://www.npmjs.com/package/@noctcore/showcase-kit',
      kind: 'npm',
    },
    {
      label: 'latest release',
      url: 'https://github.com/noctcore/showcase-kit/releases/latest',
      kind: 'release',
    },
  ],
  featured: false,
}
