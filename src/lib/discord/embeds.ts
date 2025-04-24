import { hexToDecimal } from '@/lib/utils'

import { EmbedField, FullDiscordEmbed } from '@/types'

import { AUTHOR_NAME } from '../constants'

interface DefaultEmbedProps {
  title: string
  image?: string
  message: string
  fields?: EmbedField[]
}

export const generateDefaultEmbed = ({
  title,
  image,
  message,
  fields,
}: DefaultEmbedProps): FullDiscordEmbed => {
  return {
    author: {
      name: AUTHOR_NAME,
    },
    image: {
      url: image,
    },
    title: title,
    description: message,
    fields: fields || [],
    color: hexToDecimal('#6a0dad'),
    footer: {
      text: 'Powered by Next.js',
    },
    timestamp: new Date().toISOString(),
  }
}
