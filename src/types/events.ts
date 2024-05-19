import type { ClientEvents } from 'discord.js'

export type EventCallback<Event extends keyof ClientEvents | any = any> = (
  ...args: Event extends keyof ClientEvents ? ClientEvents[Event] : any[]
) => void

export interface EventOptions {
  name?: string
  once?: boolean
  type?: 'modal' | 'button' | 'select'
}

export type DefineEvent = <Event extends keyof ClientEvents = any>(
  callback: EventCallback<Event>
) => HarmonixEvent
export type DefineEventWithOptions = <Event extends keyof ClientEvents = any>(
  options: EventOptions,
  callback: EventCallback<Event>
) => HarmonixEvent

export type HarmonixEventInput = string | HarmonixEvent

export interface HarmonixEvent {
  options: EventOptions
  callback: EventCallback<keyof ClientEvents>
}
