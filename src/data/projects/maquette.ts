import { Project } from '@/types'

export const maquette: Project = {
  id: 'maquette',
  slug: 'maquette',
  title: 'Maquette',
  summary:
    'A desktop studio that takes one asset from a concept image to a small, compressed 3D model in a website or game repo. Concept lab, 3D providers, a headless Blender pipeline and an MCP server for agents, built with Tauri and Rust.',
  description: [
    'Maquette is a desktop studio I built for 3D on websites and in games. One Board follows every asset through the stages: concept, refs, 3D model, Blender, web or export, and ship. Blender does the heavy lifting headless in the background, and the numbers that decide whether a page stays fast (triangles, texture memory, transfer size, frame time) sit next to the model the whole way.',
    'The Lab turns a prompt and reference images into concept images through the Codex CLI. Picks become refs, tagged by view, and go to Tripo or Meshy over their API, or by hand on their site with Maquette picking the export up from Downloads. Every new model lands in an Inbox that checks it against the budgets (triangles, textures, rig, origin) and offers a fix-up where one exists. Accepted models are built, sized, cleaned and baked in Blender, then compressed with meshopt and KTX2 for the web, or exported as plain files into a game.',
    'Before anything ships, the Inspector compares two versions of the scene with a slider and shows each model’s numbers, and the Page view runs the site’s own dev server and reads frame time and draw calls from the page. On the scenes I made with it, a listening corner of 10 props went from 27.4 MB of source models to 0.89 MB shipped.',
    'A local MCP server lets Claude Code or Codex drive the whole flow with the same rules as the app: anything that spends credits or ships waits for my approval in the app. There is no account and no cloud project; a workspace is a folder on disk and API keys live in the OS keychain. It runs on macOS and Windows, is in early development, and the newest release is v0.8.0.',
  ],
  image: '/projects/maquette/thumbnail.webp',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/maquette/board.webp',
      alt: 'Maquette: the Board of a sample project, with an asset in every column from Concept to Ship',
      caption:
        'Board: every asset of a project on its way from concept to ship.',
    },
    {
      src: '/projects/maquette/lab.webp',
      alt: 'Maquette: the Lab with six concept images, one picked and two starred',
      caption:
        'Lab: concept images from the Codex CLI, starred and picked as refs.',
    },
    {
      src: '/projects/maquette/inbox.webp',
      alt: 'Maquette: the Inbox previewing a rigged character with its checks',
      caption:
        'Inbox: each new model checked for triangles, textures, rig and origin.',
    },
    {
      src: '/projects/maquette/pipeline.webp',
      alt: 'Maquette: the Pipeline view mid run with its steps, bake settings and log',
      caption:
        'Pipeline: build, bake and export in headless Blender, then compress, capture posters and ship.',
    },
    {
      src: '/projects/maquette/inspector.webp',
      alt: 'Maquette: the Inspector comparing two versions of a scene with a split slider',
      caption:
        'Inspector: two versions of the scene side by side, with each model’s numbers and compression.',
    },
    {
      src: '/projects/maquette/recipe-editor.webp',
      alt: 'Maquette: the animation recipe editor with pose keys on a clay figure',
      caption:
        'Animation recipes: pose keys laid over a clip, with a rough preview of the bake.',
    },
    {
      src: '/projects/maquette/library.webp',
      alt: 'Maquette: the Library grid of reusable models',
      caption:
        'Library: finished models reused across projects, no credits spent.',
    },
    {
      src: '/projects/maquette/agents.webp',
      alt: 'Maquette: the Board with two approval prompts from an agent',
      caption:
        'Agents: Claude Code or Codex over MCP; shipping and paid sends wait for my approval.',
    },
  ],
  technologies: ['Rust', 'Tauri', 'React', 'three.js', 'Blender', 'MCP'],
  features: [
    'One Board per project: concept, refs, 3D model, Blender, web or export, ship',
    'Concept lab on the Codex CLI, with refs tagged by view and missing views drawn',
    'Models from Tripo or Meshy over their API, or by hand with the export picked up from Downloads',
    'An Inbox that checks every model against the budgets and offers fix-ups',
    'Headless Blender pipeline with a cache: build, real size, fix-ups, bake, export',
    'Web output compressed with meshopt and KTX2, with a poster per camera stop',
    'Inspector and Page view: compare versions and read real numbers from the site',
    'Animation recipes, a rig doctor and VRM avatars (early) for rigged characters',
    'A local MCP server and agent skills for Claude Code and Codex; paid sends and shipping wait for approval',
    'No account: a workspace is a folder on disk, keys live in the OS keychain',
  ],
  techDetails: {
    stack: [
      'Vite',
      'Tailwind CSS',
      'zustand',
      'React Three Fiber',
      'rmcp (MCP server)',
      'tauri-specta',
      'gltf-transform + KTX-Software',
      'Codex CLI',
      'Tripo + Meshy APIs',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: 'https://shironex.github.io/maquette/',
  githubUrl: 'https://github.com/Shironex/maquette',
  links: [
    {
      label: 'docs',
      url: 'https://shironex.github.io/maquette/docs/',
      kind: 'docs',
    },
    {
      label: 'latest release',
      url: 'https://github.com/Shironex/maquette/releases/latest',
      kind: 'release',
    },
  ],
  featured: true,
}
