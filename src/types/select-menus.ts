import type {
  APISelectMenuDefaultValue,
  ChannelSelectMenuInteraction,
  ChannelType,
  ComponentEmojiResolvable,
  MentionableSelectMenuInteraction,
  RoleSelectMenuInteraction,
  SelectMenuDefaultValueType,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction
} from 'discord.js'

export type SelectMenuType =
  | 'String'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Mentionable'

export type SelectMenuCallback<T extends SelectMenuType = SelectMenuType> = (
  interaction: T extends 'User'
    ? UserSelectMenuInteraction
    : T extends 'Channel'
      ? ChannelSelectMenuInteraction
      : T extends 'Role'
        ? RoleSelectMenuInteraction
        : T extends 'Mentionable'
          ? MentionableSelectMenuInteraction
          : StringSelectMenuInteraction,
  selected: string[]
) => void

interface StringOptionDef {
  label: string
  value: string
  description?: string
  emoji?: ComponentEmojiResolvable
  default?: boolean
}

export interface StringSelectMenuConfig {
  type: 'String'
  options: StringOptionDef[]
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

export type HarmonixSelectMenuInput = string | HarmonixSelectMenu

export interface HarmonixSelectMenu<T extends SelectMenuType = SelectMenuType> {
  config: SelectMenuConfig
  callback: SelectMenuCallback<T>
}
