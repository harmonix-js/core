import type {
  Client,
  Message,
  ChatInputCommandInteraction,
  PermissionsString,
  User,
  GuildBasedChannel,
  Role
} from 'discord.js'

export type ArgType =
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Number'

type _ArgDef<T extends ArgType> = {
  type: T
  description?: string
  required?: boolean
  metadata?: Record<string, any>
}

type StringArgDef = _ArgDef<'String'>
type IntegerArgDef = _ArgDef<'Integer'>
type BooleanArgDef = _ArgDef<'Boolean'>
type UserArgDef = _ArgDef<'User'>
type ChannelArgDef = _ArgDef<'Channel'>
type RoleArgDef = _ArgDef<'Role'>
type NumberArgDef = _ArgDef<'Number'>

type ArgDef =
  | StringArgDef
  | IntegerArgDef
  | BooleanArgDef
  | UserArgDef
  | ChannelArgDef
  | RoleArgDef
  | NumberArgDef
export type ArgsDef = Record<string, ArgDef>

interface MessageCommandOptions<T extends ArgsDef = ArgsDef> {
  name?: string
  description?: string
  slash?: boolean
  category?: string
  args?: T
  preconditions?: string[]
}

interface SlashCommandOptions<T extends ArgsDef = ArgsDef> {
  name?: string
  description?: string
  slash?: boolean
  category?: string
  args?: T
  nsfw?: boolean
  userPermissions?: PermissionsString[]
  preconditions?: string[]
}

export type ParsedArgs<T extends ArgsDef = ArgsDef> = Record<
  {
    [K in keyof T]: T[K] extends {
      type: 'String'
    }
      ? K
      : never
  }[keyof T],
  string | undefined
> &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Integer'
      }
        ? K
        : never
    }[keyof T],
    number | undefined
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Boolean'
      }
        ? K
        : never
    }[keyof T],
    boolean | undefined
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'User'
      }
        ? K
        : never
    }[keyof T],
    User | undefined
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Channel'
      }
        ? K
        : never
    }[keyof T],
    GuildBasedChannel | undefined
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Role'
      }
        ? K
        : never
    }[keyof T],
    Role | undefined
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Number'
      }
        ? K
        : never
    }[keyof T],
    number | undefined
  >

interface CommandContext<T extends ArgsDef = ArgsDef> {
  slash: boolean
  args: ParsedArgs<T>
}

export type CommandOptions<Slash extends boolean> = Slash extends true
  ? SlashCommandOptions
  : MessageCommandOptions

export type MessageOrInteraction =
  | Message
  | ChatInputCommandInteraction

type ExecuteArgument<Slash extends boolean> = Slash extends true
  ? ChatInputCommandInteraction
  : Slash extends false
    ? Message
    : MessageOrInteraction

export type CommandExecute<
  Slash extends boolean,
  T extends ArgsDef = ArgsDef
> = (
  client: Client,
  entity: ExecuteArgument<Slash>,
  context: CommandContext<T>
) => void

export type HarmonixCommandInput = string | HarmonixCommand<boolean, ArgsDef>

export interface HarmonixCommand<
  Slash extends boolean,
  T extends ArgsDef = ArgsDef
> {
  options: CommandOptions<Slash>
  execute: CommandExecute<Slash, T>
}
