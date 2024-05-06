import { Client } from 'discord.js'

export interface EventOptions {
  once?: boolean
}

export type EventCallback = (client: Client) => void

export interface EventResult {
  data: EventOptions
  callback: EventCallback
}

export type DefineEvent = (
  options: EventOptions,
  callback: EventCallback
) => EventResult
