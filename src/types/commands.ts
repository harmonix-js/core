import type {
  Client,
  Message,
  ChatInputCommandInteraction,
  CacheType,
  PermissionsString
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

type ExecuteArgument<Slash extends boolean> = Slash extends true
  ? ChatInputCommandInteraction<CacheType>
  : Slash extends false
    ? Message
    : MessageOrInteraction

type CommandExecuteOptions<Args extends CommandArg[]> = {
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

interface MessageCommandOptions {
  name?: string
  description?: string
  slash?: boolean
  category?: string
  args?: CommandArg[]
  preconditions?: string[]
}

interface SlashCommandOptions {
  name?: string
  description?: string
  slash?: boolean
  category?: string
  args?: CommandArg[]
  nsfw?: boolean
  userPermissions?: PermissionsString[]
  preconditions?: string[]
}

export type CommandOptions<Slash extends boolean> = Slash extends true
  ? SlashCommandOptions
  : MessageCommandOptions

export type HarmonixCommandInput =
  | string
  | HarmonixCommand<boolean, CommandArg[]>

export interface HarmonixCommand<
  Slash extends boolean,
  Args extends CommandArg[]
> {
  options: CommandOptions<Slash>
  execute: CommandExecute<Slash, Args>
}
