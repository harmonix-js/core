import type { Client, Message, Interaction } from 'discord.js'

export enum ArgType {
  STRING,
  INTEGER,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE,
  MENTIONABLE,
  NUMBER
}

export interface Arg {
  name: string
  description?: string
  type: ArgType
  required: boolean
}

export interface CommandOptions {
  slash?: boolean
  description?: string
  args?: Arg[]
}

export type CommandExecute = (client: Client, message: Message) => void

export interface CommandResult {
  data: CommandOptions
  execute: CommandExecute
}

export type DefineCommand = (
  options: CommandOptions,
  execute: CommandExecute
) => CommandResult
