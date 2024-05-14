import type {
  ChatInputCommandInteraction,
  Message,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'
import type { Harmonix } from './harmonix'

type MessageEntity = {
  readonly type: 'message'
  readonly message: Message
  readonly interaction?: undefined
}

type SlashEntity = {
  readonly type: 'slash'
  readonly message?: undefined
  readonly interaction: ChatInputCommandInteraction
}

type ContextMenuEntity = {
  readonly type: 'context-menu'
  readonly message?: undefined
  readonly interaction:
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
}

export type PreconditionCallback = (
  harmonixOptions: Harmonix['options'],
  entity: MessageEntity | SlashEntity | ContextMenuEntity
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
