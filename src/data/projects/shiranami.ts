import { Project } from '@/types'

export const shiranami: Project = {
  id: 'shiranami',
  slug: 'shiranami',
  title: 'Shiranami',
  summary:
    'Desktop music player for the library on your disk. Version 2 moved it from Electron to a Rust core in a Tauri shell: the Windows installer went from 110 MB to 12.5 MB and idle memory dropped by more than half.',
  description: [
    'Shiranami is a desktop music player for people who keep their music as files. It scans your folders and adds the things streaming apps do well on top: synced lyrics, internet radio, YouTube and Spotify playlist import, crossfade, an equalizer, listening history and Discord Rich Presence.',
    'Version 2.0 (September 2026) is a rewrite underneath the same app. The core is now a Rust workspace split into focused crates (audio, library, metadata, database, downloader, integrations) behind a thin Tauri 2 shell, with the React UI carried over. Audio decoding runs on Symphonia, tags on Lofty, and the database on SQLite through sqlx.',
    'The numbers I measured: the Windows installer went from 110 MB to 12.5 MB, the macOS download from 134 MB to 17 MB, idle memory from roughly 688 MB to roughly 291 MB, and a cold boot takes about 189 ms. The Rust side has more than 1,500 tests. Existing 1.x libraries, playlists, history and settings are copied over on first launch, never moved, so nobody lost data in the upgrade.',
    'I wrote up the whole migration, including what went wrong, on my blog: shirone.blog/blog/shiranami-v2-rust-rewrite.',
  ],
  image: '/projects/shiranami/thumbnail.webp',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/shiranami/overview.webp',
      alt: 'Shiranami: Overview',
      caption:
        'Overview: your evening at a glance, with the weekly recap and a year-ago memory.',
    },
    {
      src: '/projects/shiranami/library.webp',
      alt: 'Shiranami: Library',
      caption: 'Library: browse and play straight from your own folders.',
    },
    {
      src: '/projects/shiranami/playlists.webp',
      alt: 'Shiranami: Playlists',
      caption: 'Playlists: custom covers and quick access from the sidebar.',
    },
    {
      src: '/projects/shiranami/history.webp',
      alt: 'Shiranami: History',
      caption: 'History: play counts, listening time and daily activity.',
    },
    {
      src: '/projects/shiranami/mixes.webp',
      alt: 'Shiranami: Mixes',
      caption:
        'Mixes: smart collections built from your listening and the time of day.',
    },
    {
      src: '/projects/shiranami/import-playlist.webp',
      alt: 'Shiranami: Import Playlist',
      caption:
        'Import: bring a whole YouTube or Spotify playlist in, with match confidence.',
    },
    {
      src: '/projects/shiranami/radio.webp',
      alt: 'Shiranami: Radio',
      caption:
        'Radio: browse and stream internet stations from around the world.',
    },
    {
      src: '/projects/shiranami/settings.webp',
      alt: 'Shiranami: Settings',
      caption:
        'Settings: themes, accent colors, audio, integrations and language.',
    },
  ],
  technologies: ['Rust', 'Tauri', 'SQLite', 'React', 'TypeScript', 'Symphonia'],
  features: [
    'Rust core behind a Tauri 2 shell: 12.5 MB Windows installer, about 17 MB on macOS',
    'Local library scanner with playlists, favorites, smart playlists and a library health check',
    'Tempo and key detected locally for every track',
    'Synced lyrics, saved as .lrc files next to your music so they work offline',
    'Internet radio with a log of the songs each station played',
    'YouTube and Spotify playlist import, downloaded with yt-dlp and ffmpeg the app installs for you',
    '10-band equalizer, per-album volume leveling and equal-power crossfade',
    'Listening history, weekly recaps and auto-generated mixes',
    'Compact mini player, sleep timer, command palette and remappable shortcuts',
    'English and Polish UI, Discord Rich Presence, in-app updates on Windows',
  ],
  techDetails: {
    stack: [
      'Rust',
      'Tauri 2',
      'sqlx + SQLite',
      'Symphonia',
      'Lofty',
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'i18next',
      'yt-dlp + ffmpeg',
    ],
  },
  status: 'shipped',
  duration: 'Ongoing (maintained)',
  demoUrl: 'https://shiranami.app',
  githubUrl: 'https://github.com/Shironex/shiranami',
  featured: true,
}
