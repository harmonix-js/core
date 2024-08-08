import type {
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

export interface OptionsDef {
  [x: string]: OptionDef
}

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

type OptionTypeMap = {
  String: string
  Integer: number
  Boolean: boolean
  User: User
  Channel: GuildBasedChannel | APIInteractionDataResolvedChannel
  Role: Role | APIRole
  Number: number
  Mentionable: GuildMember | APIInteractionDataResolvedGuildMember
  Attachment: Attachment
  SubCommand: boolean
  Message: Message | null
  Emoji: GuildEmoji | PartialEmoji | null
  Date: Date | null
  Url: URL | null
}

type RequiredOptionValue<T extends OptionDef> = T['required'] extends false
  ? OptionTypeMap[T['type']] | null
  : OptionTypeMap[T['type']]

export type ParsedOptions<T extends OptionsDef = OptionsDef> = {
  [K in keyof T]: RequiredOptionValue<T[K]>
}

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
  interaction: ChatInputCommandInteraction,
  context: CommandContext<T>
) => void

export type HarmonixCommandInput = string | HarmonixCommand

export interface HarmonixCommand<T extends OptionsDef = OptionsDef> {
  config: CommandConfig<T>
  execute: CommandExecute<T>
}
