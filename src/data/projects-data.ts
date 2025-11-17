import { Project } from '@/types'

import { agAnimeBot } from './projects/ag-anime-bot'
import { agGdriveGenerator } from './projects/ag-gdrive-generator'
import { claudeCodeDiscordBot } from './projects/claude-code-discord-bot'
import { cliTemplate } from './projects/cli-template'
import { envVault } from './projects/env-vault'
import { ghLabelsCli } from './projects/gh-labels-cli'
import { matmajka } from './projects/matmajka'
import { nextJsSaasTemplate } from './projects/next-js-saas-template'
import { perfectCleanCarHouse } from './projects/perfect-clean-car-house'
import { shiniJsLogger } from './projects/shinijs-logger'
import { shiniJsRateLimit } from './projects/shinijs-rate-limit'
import { snsDiscordForwarder } from './projects/sns-discord-forwarder'
import { sudeko } from './projects/sudeko'
import { toriime } from './projects/toriime'
import { writeWiz } from './projects/write-wiz'

export const projectsData: Project[] = [
  matmajka,
  perfectCleanCarHouse,
  sudeko,
  toriime,
  writeWiz,
  nextJsSaasTemplate,
  envVault,
  cliTemplate,
  shiniJsLogger,
  shiniJsRateLimit,
  ghLabelsCli,
  agGdriveGenerator,
  agAnimeBot,
  claudeCodeDiscordBot,
  snsDiscordForwarder,
] as const
