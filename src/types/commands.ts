import {
  Client,
  Message,
  ChatInputCommandInteraction,
  CacheType
} from 'discord.js'

export enum CommandArgType {
  String = 'String',
  Integer = 'Integer',
  Boolean = 'Boolean',
  User = 'User',
  Channel = 'Channel',
  Role = 'Role',
  Mentionable = 'Mentionable',
  Number = 'Number',
  Attachment = 'Attachment'
}

export interface HarmonyCommandArgType {
  String: []
  Integer: []
  Boolean: []
  User: []
  Channel: []
  Role: []
  Mentionable: []
  Number: []
  Attachment: []
}

export interface CommandArg {
  type: CommandArgType
  name: string
  description: string
  required?: boolean
}

export type MessageOrInteraction =
  | Message
  | ChatInputCommandInteraction<CacheType>

export type ExecuteArgument<Slash extends boolean> = Slash extends true
  ? ChatInputCommandInteraction<CacheType>
  : Slash extends false
    ? Message
    : MessageOrInteraction

export interface CommandExecuteOptions {
  slash: boolean
  params: any
}

export interface ArgumentResolver {
  get: <T>(name: string) => T
}

export type CommandExecute<Slash extends boolean> = (
  client: Client,
  entity: ExecuteArgument<Slash>,
  options: CommandExecuteOptions
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
  args?: CommandArg[]
  nsfw?: boolean
  slash?: boolean
  ownerOnly?: boolean
  guildOnly?: boolean
  userPermissions?: any[]
  botPermissions?: any[]
  cooldown?: number
}

export type HarmonyCommandInput = string | HarmonyCommand<boolean>

export interface HarmonyCommand<Slash extends boolean> {
  options: CommandOptions
  execute: CommandExecute<Slash>
}
