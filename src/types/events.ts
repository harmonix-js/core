import type { Client } from 'discord.js'

export type EventCallback = (client: Client) => void

export interface EventOptions {
  name?: string
  once?: boolean
}

export type DefineEvent = (callback: EventCallback) => HarmonixEvent
export type DefineEventWithOptions = (
  options: EventOptions,
  callback: EventCallback
) => HarmonixEvent

export type HarmonixEventInput = string | HarmonixEvent

export interface HarmonixEvent {
  options: EventOptions
  callback: EventCallback
}
