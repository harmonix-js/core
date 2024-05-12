import type {
  CacheType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'

export type ContextMenuCallback = (
  interaction:
    | MessageContextMenuCommandInteraction<CacheType>
    | UserContextMenuCommandInteraction<CacheType>
) => void

export interface ContextMenuOptions {
  name?: string
  type?: 'message' | 'user'
}

export type DefineContextMenu = (
  callback: ContextMenuCallback
) => HarmonixContextMenu
export type DefineContextMenuWithOptions = (
  options: ContextMenuOptions,
  callback: ContextMenuCallback
) => HarmonixContextMenu

export type HarmonixContextMenuInput = string | HarmonixContextMenu

export interface HarmonixContextMenu {
  options: ContextMenuOptions
  callback: ContextMenuCallback
}
