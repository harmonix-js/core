import type {
  MessageContextMenuCommandInteraction,
  PermissionsString,
  UserContextMenuCommandInteraction
} from 'discord.js'

export type ContextMenuCallback<Type extends 'message' | 'user'> = (
  interaction: Type extends 'message'
    ? MessageContextMenuCommandInteraction
    : UserContextMenuCommandInteraction
) => void

export interface ContextMenuOptions {
  name?: string
  type?: 'message' | 'user'
  userPermissions?: PermissionsString[]
  preconditions?: string[]
}

export type DefineContextMenu = <Type extends 'message' | 'user'>(
  callback: ContextMenuCallback<Type>
) => HarmonixContextMenu
export type DefineContextMenuWithOptions = <Type extends 'message' | 'user'>(
  options: ContextMenuOptions,
  callback: ContextMenuCallback<Type>
) => HarmonixContextMenu

export type HarmonixContextMenuInput = string | HarmonixContextMenu

export interface HarmonixContextMenu {
  options: ContextMenuOptions
  callback: ContextMenuCallback<'message' | 'user'>
}
