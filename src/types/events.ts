import type { ClientEvents } from 'discord.js'

export type EventCallback<Event extends keyof ClientEvents = any> = (
  ...args: Event extends keyof ClientEvents ? ClientEvents[Event] : any[]
) => void

export interface EventConfig {
  name?: string
  once?: boolean
  order?: number
}

export interface DefineEvent {
  <Event extends keyof ClientEvents = any>(
    callback: EventCallback<Event>
  ): HarmonixEvent
  <Event extends keyof ClientEvents = any>(
    config: EventConfig,
    callback: EventCallback<Event>
  ): HarmonixEvent
}

export type HarmonixEventInput = string | HarmonixEvent

export interface HarmonixEvent {
  config: EventConfig
  callback: EventCallback<keyof ClientEvents>
}
