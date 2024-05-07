import type {
  Client,
  Message,
  Interaction,
  CacheType,
  ChatInputCommandInteraction
} from 'discord.js'

export type MessageOrInteraction =
  | Message
  | ChatInputCommandInteraction<CacheType>

export type ExecuteArgument<Slash extends boolean> = Slash extends true
  ? ChatInputCommandInteraction<CacheType>
  : Slash extends false
    ? Message
    : MessageOrInteraction

export type CommandExecute<Slash extends boolean> = (
  client: Client,
  entity: ExecuteArgument<Slash>
) => void

export interface CommandResult<Slash extends boolean> {
  options: CommandOptions
  execute: CommandExecute<Slash>
}
