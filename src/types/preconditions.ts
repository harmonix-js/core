import type {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'

type SlashEntity = {
  readonly type: 'slash'
  readonly interaction: ChatInputCommandInteraction
}

type ContextMenuEntity = {
  readonly type: 'context-menu'
  readonly interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
}

export type PreconditionCallback = (
  entity: SlashEntity | ContextMenuEntity
) => boolean

export interface PreconditionOptions {
  name?: string
}

export type DefinePrecondition = (
  callback: PreconditionCallback
) => HarmonixPrecondition

export type HarmonixPreconditionInput = string | HarmonixPrecondition

export interface HarmonixPrecondition {
  options: PreconditionOptions
  callback: PreconditionCallback
}
