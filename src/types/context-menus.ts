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

export interface ContextMenuConfig {
  name?: string
  type?: 'message' | 'user'
  userPermissions?: PermissionsString[]
  guildOnly?: boolean
  preconditions?: string[]
}

export type DefineContextMenu = <Type extends 'message' | 'user'>(
  callback: ContextMenuCallback<Type>
) => HarmonixContextMenu
export type DefineContextMenuWithOptions = <Type extends 'message' | 'user'>(
  config: ContextMenuConfig,
  callback: ContextMenuCallback<Type>
) => HarmonixContextMenu

export type HarmonixContextMenuInput = string | HarmonixContextMenu

export interface HarmonixContextMenu {
  config: ContextMenuConfig
  callback: ContextMenuCallback<'message' | 'user'>
}
