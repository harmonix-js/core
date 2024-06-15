import type {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'

export type PreconditionType = 'ChatInput' | 'ContextMenu'

export type PreconditionCallback<
  T extends PreconditionType = PreconditionType
> = (
  interaction: T extends 'ChatInput'
    ? ChatInputCommandInteraction
    : MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction
) => Promise<boolean> | Promise<void> | boolean | void

export interface DefinePrecondition {
  <T extends PreconditionType>(
    callback: PreconditionCallback<T>
  ): HarmonixPrecondition<T>
  <T extends PreconditionType>(
    name: string,
    callback: PreconditionCallback<T>
  ): HarmonixPrecondition<T>
}

export type HarmonixPreconditionInput = string | HarmonixPrecondition

export interface HarmonixPrecondition<
  T extends PreconditionType = PreconditionType
> {
  name: string
  callback: PreconditionCallback<T>
}
