import type {
  MessageContextMenuCommandInteraction,
  PermissionsString,
  UserContextMenuCommandInteraction
} from 'discord.js'

export type ContextMenuType = 'Message' | 'User'

export type ContextMenuCallback<T extends ContextMenuType = ContextMenuType> = (
  interaction: T extends 'Message'
    ? MessageContextMenuCommandInteraction
    : UserContextMenuCommandInteraction
) => void

export interface ContextMenuConfig<
  T extends ContextMenuType = ContextMenuType
> {
  name?: string
  type?: T
  userPermissions?: PermissionsString[]
  guildOnly?: boolean
  preconditions?: string[]
}

export type HarmonixContextMenuInput = string | HarmonixContextMenu

export interface HarmonixContextMenu<
  T extends ContextMenuType = ContextMenuType
> {
  config: ContextMenuConfig<T>
  callback: ContextMenuCallback<T>
}
