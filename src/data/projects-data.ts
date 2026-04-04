import { Project } from '@/types'

import { automaker } from './projects/automaker'
import { claudeCodeDiscordBot } from './projects/claude-code-discord-bot'
import { cliTemplate } from './projects/cli-template'
import { ghLabelsCli } from './projects/gh-labels-cli'
import { gitchorus } from './projects/gitchorus'
import { kodama } from './projects/kodama'
import { matmajka } from './projects/matmajka'
import { omniscribe } from './projects/omniscribe'
import { shiniJsLogger } from './projects/shinijs-logger'
import { shiniJsRateLimit } from './projects/shinijs-rate-limit'
import { shiranami } from './projects/shiranami'
import { shiroani } from './projects/shiroani'
import { shiroku } from './projects/shiroku'
import { sudeko } from './projects/sudeko'
import { toriime } from './projects/toriime'
import { writeWiz } from './projects/write-wiz'

export const projectsData: Project[] = [
  automaker,
  omniscribe,
  shiroani,
  shiranami,
  kodama,
  shiroku,
  toriime,
  gitchorus,
  sudeko,
  matmajka,
  writeWiz,
  claudeCodeDiscordBot,
  cliTemplate,
  ghLabelsCli,
  shiniJsLogger,
  shiniJsRateLimit,
] as const
