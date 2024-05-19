import type {
  APISelectMenuDefaultValue,
  AnySelectMenuInteraction,
  ChannelType,
  ComponentEmojiResolvable,
  SelectMenuDefaultValueType
} from 'discord.js'

type SelectMenuCallback = (interaction: AnySelectMenuInteraction) => void

export interface StringSelectMenuConfig {
  type: 'String'
  options: {
    label: string
    value: string
    description?: string
    emoji?: ComponentEmojiResolvable
    default?: boolean
  }[]
}

export interface UserSelectMenuConfig {
  type: 'User'
  defaultUsers?: string[]
}

export interface ChannelSelectMenuConfig {
  type: 'Channel'
  channelTypes?: ChannelType[]
  defaultChannels?: string[]
}

export interface RoleSelectMenuConfig {
  type: 'Role'
  defaultRoles?: string[]
}

export interface MentionableSelectMenuConfig {
  type: 'Mentionable'
  defaultValues?:
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>[]
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>[]
}

interface BaseSelectMenuConfig {
  id?: string
  placeholder: string
  disabled?: boolean
  minValues?: number
  maxValues?: number
}

export type SelectMenuConfig = BaseSelectMenuConfig &
  (
    | StringSelectMenuConfig
    | UserSelectMenuConfig
    | ChannelSelectMenuConfig
    | RoleSelectMenuConfig
    | MentionableSelectMenuConfig
  )

export type DefineSelectMenu = (
  config: SelectMenuConfig,
  callback: SelectMenuCallback
) => HarmonixSelectMenu

export type HarmonixSelectMenuInput = string | HarmonixSelectMenu

export interface HarmonixSelectMenu {
  config: SelectMenuConfig
  callback: SelectMenuCallback
}
