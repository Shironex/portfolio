import { Project } from '@/types'

export const nightMaze: Project = {
  id: 'night-maze',
  slug: 'night-maze',
  title: 'Night Maze',
  summary:
    'A first person maze game for Windows, written without a game engine in C++20 and OpenGL 4.1. A stone maze at night, one flashlight, crystals to find, and a shadow that hunts by sound and is burned away by the light.',
  description: [
    'Night Maze began as a university project for a computer graphics course and I kept going. You stand in a stone maze at night with a flashlight. Crystals lie in the corridors, and when you carry enough of them the gate at the far end opens. A shadow wanders the maze and listens: it hears a sprint from 14 metres and a walk from 6, and holding the beam on it for 2.5 seconds burns it away for a while.',
    'There is no game engine underneath. The lighting, the two shadow maps, the fog, the HDR pipeline with ACES tone mapping and the bloom are written by hand on top of OpenGL. Small libraries do the window, the math, the menus and the sound. The rules of the game are plain structs and free functions that touch no window, file or clock, so more than 1000 test cases run without one.',
    'The game has a campaign of five nights, each in a bigger maze with a shorter battery, a daily maze that takes the date as its seed, a story told in 24 chalk marks on the walls, and free play with three difficulty levels. The models come from Blender scripts and the 23 sounds and the menu theme are computed by a script.',
    'Friends get it through a small launcher I wrote in Tauri and Rust. It installs the game from GitHub Releases, checks a signed manifest before anything is unpacked, keeps the game and itself up to date, and goes back a version when a new one does not start.',
  ],
  image: '/projects/night-maze/thumbnail.webp',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/night-maze/menu.webp',
      alt: 'Night Maze: Main menu',
      caption:
        'The main menu, over a video loop recorded from the game itself.',
    },
    {
      src: '/projects/night-maze/shade.webp',
      alt: 'Night Maze: The shadow',
      caption:
        'The shadow at the end of a corridor. It stands still while the light is on it.',
    },
    {
      src: '/projects/night-maze/corridor.webp',
      alt: 'Night Maze: A corridor',
      caption: 'A crystal glows in front of the wall at the end of a corridor.',
    },
    {
      src: '/projects/night-maze/gate-closed.webp',
      alt: 'Night Maze: The gatehouse at the exit, closed, with a lantern on each side',
      caption:
        'The gatehouse at the exit, still closed. It opens when you carry enough crystals.',
    },
    {
      src: '/projects/night-maze/lever.webp',
      alt: 'Night Maze: A lever',
      caption:
        'A lever, just pulled: the wall beside it sinks and opens a shortcut.',
    },
    {
      src: '/projects/night-maze/note.webp',
      alt: 'Night Maze: A note',
      caption: 'A note on the wall. This one is a line of the story.',
    },
    {
      src: '/projects/night-maze/map.webp',
      alt: 'Night Maze: The map',
      caption: 'The map while M is held: only the corridors seen so far.',
    },
    {
      src: '/projects/night-maze/intro.webp',
      alt: 'Night Maze: The intro',
      caption: 'One of the five cards of the intro, played live in the game.',
    },
  ],
  technologies: [
    'C++20',
    'OpenGL 4.1',
    'GLSL',
    'CMake',
    'GLFW',
    'RmlUi',
    'miniaudio',
    'Blender',
    'Rust',
    'Tauri',
  ],
  features: [
    'Renderer written by hand: Blinn-Phong lighting, two shadow maps, fog, HDR with ACES tone mapping and bloom',
    'Mazes generated from a seed, with levers that open shortcuts, worn wall variants and fog of war on the map',
    'A shadow that hunts by sound and sight along the corridors, and is burned away by the flashlight beam',
    'Campaign of five nights, a daily maze seeded by the date, and free play with three difficulty levels',
    'A story in 24 chalk marks, kept in a ledger, with an intro played live in the game',
    'More than 1000 test cases for game rules that need no window, file or clock',
    'Models built by Blender scripts, and 23 sounds plus the menu theme computed by a script',
    'Menus in RmlUi with rebindable keys, and a Dear ImGui debug window for every render setting',
    'Launcher in Tauri and Rust: signed manifests, checksums, self update and going back a version',
    'Releases built and signed by GitHub Actions behind a manual approval',
  ],
  techDetails: {
    stack: [
      'C++20',
      'OpenGL 4.1 (core profile)',
      'GLSL',
      'CMake',
      'GLFW',
      'GLM',
      'RmlUi + FreeType',
      'Dear ImGui',
      'miniaudio',
      'doctest',
      'Blender (Python scripts)',
      'Tauri 2 + Rust (launcher)',
      'Astro (website)',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: 'https://shironex.github.io/night-maze/',
  githubUrl: 'https://github.com/Shironex/night-maze',
  links: [
    {
      label: 'launcher',
      url: 'https://github.com/Shironex/night-maze-launcher',
      kind: 'other',
    },
    {
      label: 'latest release',
      url: 'https://github.com/Shironex/night-maze-launcher/releases/latest',
      kind: 'release',
    },
  ],
  featured: true,
}
