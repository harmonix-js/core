import type {
  ColorResolvable,
  EmbedAuthorOptions,
  EmbedFooterOptions,
  APIEmbedField,
  TextInputStyle,
  ButtonStyle,
  ComponentEmojiResolvable,
  ChannelType,
  APISelectMenuDefaultValue,
  SelectMenuDefaultValueType
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

export interface StringSelectMenuOptions {
  type: 'String'
  options: {
    label: string
    value: string
    description?: string
    emoji?: ComponentEmojiResolvable
    default?: boolean
  }[]
}

export interface UserSelectMenuOptions {
  type: 'User'
  defaultUsers?: string[]
}

export interface ChannelSelectMenuOptions {
  type: 'Channel'
  channelTypes?: ChannelType[]
  defaultChannels?: string[]
}

export interface RoleSelectMenuOptions {
  type: 'Role'
  defaultRoles?: string[]
}

export interface MentionableSelectMenuOptions {
  type: 'Mentionable'
  defaultValues?:
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[]
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>[]
}

export interface BaseSelectMenuOptions {
  id: string
  placeholder: string
  disabled?: boolean
  minValues?: number
  maxValues?: number
}

export type SelectMenuOptions = BaseSelectMenuOptions &
  (
    | StringSelectMenuOptions
    | UserSelectMenuOptions
    | ChannelSelectMenuOptions
    | RoleSelectMenuOptions
    | MentionableSelectMenuOptions
  )
