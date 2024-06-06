import type {
  Message,
  MessageContextMenuCommandInteraction,
  PermissionsString,
  User,
  UserContextMenuCommandInteraction
} from 'discord.js'

export type ContextMenuType = 'Message' | 'User'

export type ContextMenuCallback<T extends ContextMenuType = ContextMenuType> = (
  interaction: T extends 'Message'
    ? MessageContextMenuCommandInteraction
    : UserContextMenuCommandInteraction,
  target: T extends 'Message' ? Message : User
) => void

export interface ContextMenuConfig<
  T extends ContextMenuType = ContextMenuType
> {
  id?: string
  name?: string
  type?: T
  userPermissions?: PermissionsString[]
  dm?: boolean
  preconditions?: string[]
}

export interface DefineContextMenu {
  <T extends ContextMenuType = ContextMenuType>(
    callback: ContextMenuCallback<T>
  ): HarmonixContextMenu<T>
  <T extends ContextMenuType = ContextMenuType>(
    config: ContextMenuConfig<T>,
    callback: ContextMenuCallback<T>
  ): HarmonixContextMenu<T>
}

export type HarmonixContextMenuInput = string | HarmonixContextMenu

export interface HarmonixContextMenu<
  T extends ContextMenuType = ContextMenuType
> {
  config: ContextMenuConfig<T>
  callback: ContextMenuCallback<T>
}
