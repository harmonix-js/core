import {
  type ColorResolvable,
  type EmbedAuthorOptions,
  type EmbedFooterOptions,
  type APIEmbedField,
  type TextInputStyle
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
