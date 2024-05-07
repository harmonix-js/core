import type { Client } from 'discord.js'

export type EventCallback = (client: Client) => void

export type DefineEvent = (callback: EventCallback) => EventResult
export type DefineEventWithOptions = (options: EventOptions, callback: EventCallback) => EventResult

export interface EventResult {
  options: EventOptions
  callback: EventCallback
}
