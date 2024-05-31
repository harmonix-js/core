import type {
  Client,
  ChatInputCommandInteraction,
  PermissionsString,
  User,
  GuildBasedChannel,
  Role,
  APIRole,
  APIInteractionDataResolvedChannel,
  GuildMember,
  APIInteractionDataResolvedGuildMember,
  Attachment,
  AutocompleteInteraction
} from 'discord.js'

type OptionType =
  | 'String'
  | 'Integer'
  | 'Boolean'
  | 'User'
  | 'Channel'
  | 'Role'
  | 'Number'
  | 'Mentionable'
  | 'Attachment'
  | 'SubCommand'

interface _OptionDef<T extends OptionType> {
  type: T
  description?: string
  required?: boolean
  metadata?: Record<string, any>
}

interface _AutocompleteOptionDef {
  autocomplete?: boolean
}

interface _SubCommandOptionDef {
  options?: Record<string, Exclude<OptionDef, SubCommandOptionDef>>
}

type StringOptionDef = _OptionDef<'String'> & _AutocompleteOptionDef
type IntegerOptionDef = _OptionDef<'Integer'> & _AutocompleteOptionDef
type BooleanOptionDef = _OptionDef<'Boolean'>
type UserOptionDef = _OptionDef<'User'>
type ChannelOptionDef = _OptionDef<'Channel'>
type RoleOptionDef = _OptionDef<'Role'>
type NumberOptionDef = _OptionDef<'Number'> & _AutocompleteOptionDef
type MentionableOptionDef = _OptionDef<'Mentionable'>
type AttachmentOptionDef = _OptionDef<'Attachment'>
type SubCommandOptionDef = _OptionDef<'SubCommand'> & _SubCommandOptionDef

type OptionDef =
  | StringOptionDef
  | IntegerOptionDef
  | BooleanOptionDef
  | UserOptionDef
  | ChannelOptionDef
  | RoleOptionDef
  | NumberOptionDef
  | MentionableOptionDef
  | AttachmentOptionDef
  | SubCommandOptionDef

export type OptionsDef = Record<string, OptionDef>

export type ParsedOptionType =
  | string
  | number
  | boolean
  | User
  | GuildBasedChannel
  | APIInteractionDataResolvedChannel
  | Role
  | APIRole
  | GuildMember
  | APIInteractionDataResolvedGuildMember
  | Attachment
  | null

export type ParsedOptions<T extends OptionsDef = OptionsDef> = Record<
  {
    [K in keyof T]: T[K] extends {
      type: 'String'
    }
      ? K
      : never
  }[keyof T],
  string | null
> &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Integer'
      }
        ? K
        : never
    }[keyof T],
    number | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Boolean'
      }
        ? K
        : never
    }[keyof T],
    boolean | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'User'
      }
        ? K
        : never
    }[keyof T],
    User | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Channel'
      }
        ? K
        : never
    }[keyof T],
    GuildBasedChannel | APIInteractionDataResolvedChannel | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Role'
      }
        ? K
        : never
    }[keyof T],
    Role | APIRole | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Number'
      }
        ? K
        : never
    }[keyof T],
    number | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Mentionable'
      }
        ? K
        : never
    }[keyof T],
    GuildMember | APIInteractionDataResolvedGuildMember | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Attachment'
      }
        ? K
        : never
    }[keyof T],
    Attachment | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'SubCommand'
      }
        ? K
        : never
    }[keyof T],
    boolean | null
  >

interface CommandContext<T extends OptionsDef = OptionsDef> {
  options: ParsedOptions<T>
}

export interface CommandConfig<T extends OptionsDef = OptionsDef> {
  id?: string
  name?: string
  description?: string
  category?: string
  options?: T
  nsfw?: boolean
  userPermissions?: PermissionsString[]
  dm?: boolean
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void
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
