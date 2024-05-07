import type {
  Client,
  Message,
  ChatInputCommandInteraction,
  CacheType
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

export interface CommandContext {
  name: string
  category: string
  slash: boolean
  execute: CommandExecute<boolean>
}

export interface CommandOptions {
  name?: string
  description?: string
  category?: string
  arguments?: any[]
  nsfw?: boolean
  slash?: boolean
  ownerOnly?: boolean
  guildOnly?: boolean
  userPermissions?: any[]
  botPermissions?: any[]
  cooldown?: number
}

export type HarmonyCommandInput = string | HarmonyCommand

export interface HarmonyCommand<Slash extends boolean> {
  options: CommandOptions
  execute: CommandExecute<Slash>
}
