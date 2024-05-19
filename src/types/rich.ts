import type {
  ColorResolvable,
  EmbedAuthorOptions,
  EmbedFooterOptions,
  APIEmbedField
} from 'discord.js'

export interface EmbedOptions {
  color?: ColorResolvable
  title?: string
  url?: string
  author?: EmbedAuthorOptions
  description?: string
  thumbnail?: string
  image?: string
  timestamp?: number | Date | null
  footer?: EmbedFooterOptions
  fields?: APIEmbedField[]
}

export type EmbedSetters = {
  [K in keyof EmbedOptions]: (value: EmbedOptions[K]) => void
}
