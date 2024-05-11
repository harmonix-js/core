import type {
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
  Number = 'Number'
}

export interface HarmonixCommandArgType {
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

export type CommandExecuteOptions<Args extends CommandArg[]> = {
  slash: boolean
  args: {
    [K in Args[number]['name']]: any
  }
}

export type CommandExecute<Slash extends boolean, Args extends CommandArg[]> = (
  client: Client,
  entity: ExecuteArgument<Slash>,
  options: CommandExecuteOptions<Args>
) => void

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

export type HarmonixCommandInput =
  | string
  | HarmonixCommand<boolean, CommandArg[]>

export interface HarmonixCommand<
  Slash extends boolean,
  Args extends CommandArg[]
> {
  options: CommandOptions
  execute: CommandExecute<Slash, Args>
}
