import type {
  Client,
  ChatInputCommandInteraction,
  PermissionsString,
  User,
  GuildBasedChannel,
  Role
} from 'discord.js'

export type OptionType =
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Number'

type _OptionDef<T extends OptionType> = {
  type: T
  description?: string
  required?: boolean
  metadata?: Record<string, any>
}

type StringOptionDef = _OptionDef<'String'>
type IntegerOptionDef = _OptionDef<'Integer'>
type BooleanOptionDef = _OptionDef<'Boolean'>
type UserOptionDef = _OptionDef<'User'>
type ChannelOptionDef = _OptionDef<'Channel'>
type RoleOptionDef = _OptionDef<'Role'>
type NumberOptionDef = _OptionDef<'Number'>

type OptionDef =
  | StringOptionDef
  | IntegerOptionDef
  | BooleanOptionDef
  | UserOptionDef
  | ChannelOptionDef
  | RoleOptionDef
  | NumberOptionDef
export type OptionsDef = Record<string, OptionDef>

export type ParsedOptions<T extends OptionsDef = OptionsDef> = Record<
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

interface CommandContext<T extends OptionsDef = OptionsDef> {
  options: ParsedOptions<T>
}

export interface CommandConfig<T extends OptionsDef = OptionsDef> {
  name?: string
  description?: string
  category?: string
  options?: T
  nsfw?: boolean
  userPermissions?: PermissionsString[]
  preconditions?: string[]
}

export type CommandExecute<T extends OptionsDef = OptionsDef> = (
  client: Client,
  interaction: ChatInputCommandInteraction,
  context: CommandContext<T>
) => void

export type HarmonixCommandInput = string | HarmonixCommand

export interface HarmonixCommand<T extends OptionsDef = OptionsDef> {
  config: CommandConfig<T>
  execute: CommandExecute<T>
}
