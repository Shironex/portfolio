import { Project } from '@/types'

import { auth } from './projects/auth'
import { automaker } from './projects/automaker'
import { businessErp } from './projects/business-erp'
import { claudeCodeDiscordBot } from './projects/claude-code-discord-bot'
import { cliTemplate } from './projects/cli-template'
import { eslintPlugins } from './projects/eslint-plugins'
import { ghLabelsCli } from './projects/gh-labels-cli'
import { gitchorus } from './projects/gitchorus'
import { harness } from './projects/harness'
import { hinomi } from './projects/hinomi'
import { kireiManga } from './projects/kirei-manga'
import { maquette } from './projects/maquette'
import { matmajka } from './projects/matmajka'
import { moekoder } from './projects/moekoder'
import { nightMaze } from './projects/night-maze'
import { nightcore } from './projects/nightcore'
import { nysia } from './projects/nysia'
import { omniscribe } from './projects/omniscribe'
import { rumi } from './projects/rumi'
import { shiniJsLogger } from './projects/shinijs-logger'
import { shiniJsRateLimit } from './projects/shinijs-rate-limit'
import { shiranami } from './projects/shiranami'
import { shiroani } from './projects/shiroani'
import { shironeBlog } from './projects/shirone-blog'
import { showcaseKit } from './projects/showcase-kit'
import { stackward } from './projects/stackward'
import { sudeko } from './projects/sudeko'
import { writeWiz } from './projects/write-wiz'

/**
 * Display order. Featured and active work first, then shipped client sites
 * and libraries, then the archive (finished, no longer maintained).
 */
export const projectsData: Project[] = [
  shiranami,
  nightMaze,
  // Newest work, newest first
  harness,
  auth,
  stackward,
  hinomi,
  maquette,
  automaker,
  eslintPlugins,
  showcaseKit,
  nightcore,
  omniscribe,
  shiroani,
  businessErp,
  nysia,
  moekoder,
  rumi,
  shironeBlog,
  sudeko,
  matmajka,
  // Archive
  kireiManga,
  gitchorus,
  writeWiz,
  claudeCodeDiscordBot,
  cliTemplate,
  ghLabelsCli,
  shiniJsLogger,
  shiniJsRateLimit,
] as const
