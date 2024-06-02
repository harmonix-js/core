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
  AutocompleteInteraction,
  Message,
  GuildEmoji,
  PartialEmoji,
  RestOrArray,
  APIApplicationCommandOptionChoice,
  ChannelType
} from 'discord.js'
import type { URL } from 'node:url'

export type OptionType =
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
  | 'Message'
  | 'Emoji'
  | 'Date'
  | 'Url'

interface _OptionDef<T extends OptionType> {
  type: T
  description?: string
  required?: boolean
  metadata?: Record<string, any>
}

interface _StringOptionDef {
  autocomplete?: boolean
  minLength?: number
  maxLength?: number
  choices?: RestOrArray<APIApplicationCommandOptionChoice<string>>
}

interface _IntegerOptionDef {
  autocomplete?: boolean
  minValue?: number
  maxValue?: number
  choices?: RestOrArray<APIApplicationCommandOptionChoice<number>>
}

interface _ChannelOptionDef {
  types: RestOrArray<
    | ChannelType.GuildText
    | ChannelType.GuildVoice
    | ChannelType.GuildCategory
    | ChannelType.GuildAnnouncement
    | ChannelType.AnnouncementThread
    | ChannelType.PublicThread
    | ChannelType.PrivateThread
    | ChannelType.GuildStageVoice
    | ChannelType.GuildForum
    | ChannelType.GuildMedia
  >
}

interface _NumberOptionDef {
  autocomplete?: boolean
  minValue?: number
  maxValue?: number
  choices?: RestOrArray<APIApplicationCommandOptionChoice<number>>
}

interface _SubCommandOptionDef {
  options?: Record<string, Exclude<OptionDef, SubCommandOptionDef>>
}

type StringOptionDef = _OptionDef<'String'> & _StringOptionDef
type IntegerOptionDef = _OptionDef<'Integer'> & _IntegerOptionDef
type BooleanOptionDef = _OptionDef<'Boolean'>
type UserOptionDef = _OptionDef<'User'>
type ChannelOptionDef = _OptionDef<'Channel'> & _ChannelOptionDef
type RoleOptionDef = _OptionDef<'Role'>
type NumberOptionDef = _OptionDef<'Number'> & _NumberOptionDef
type MentionableOptionDef = _OptionDef<'Mentionable'>
type AttachmentOptionDef = _OptionDef<'Attachment'>
type SubCommandOptionDef = _OptionDef<'SubCommand'> & _SubCommandOptionDef
type MessageOptionDef = _OptionDef<'Message'> & _StringOptionDef
type EmojiOptionDef = _OptionDef<'Emoji'> & _StringOptionDef
type DateOptionDef = _OptionDef<'Date'> & _StringOptionDef
type UrlOptionDef = _OptionDef<'Url'> & _StringOptionDef

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
  | MessageOptionDef
  | EmojiOptionDef
  | DateOptionDef
  | UrlOptionDef

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
  | Message
  | GuildEmoji
  | PartialEmoji
  | Date
  | URL
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
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Message'
      }
        ? K
        : never
    }[keyof T],
    Message | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Emoji'
      }
        ? K
        : never
    }[keyof T],
    GuildEmoji | PartialEmoji | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Date'
      }
        ? K
        : never
    }[keyof T],
    Date | null
  > &
  Record<
    {
      [K in keyof T]: T[K] extends {
        type: 'Url'
      }
        ? K
        : never
    }[keyof T],
    URL | null
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
