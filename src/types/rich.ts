import type {
  ColorResolvable,
  EmbedAuthorOptions,
  EmbedFooterOptions,
  APIEmbedField,
  TextInputStyle,
  ButtonStyle,
  ComponentEmojiResolvable
} from 'discord.js'

interface TextInput {
  id: string
  label: string
  style: TextInputStyle
  maxLength?: number
  minLength?: number
  placeholder?: string
  value?: string
  required?: boolean
}

export interface ModalOptions {
  id: string
  title: string
  textInputs?: TextInput[]
}

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

export interface ButtonOptions {
  id: string
  label?: string
  style?: keyof typeof ButtonStyle
  emoji?: ComponentEmojiResolvable
  url?: string
  disabled?: boolean
}
