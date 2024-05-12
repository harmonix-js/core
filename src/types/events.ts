import type { ClientEvents, ModalSubmitInteraction } from 'discord.js'

export interface HarmonixEvents extends ClientEvents {
  modal: [interaction: ModalSubmitInteraction]
}

export type EventCallback<Event extends keyof HarmonixEvents | any = any> = (
  ...args: Event extends keyof HarmonixEvents ? HarmonixEvents[Event] : any[]
) => void

export interface EventOptions {
  name?: string
  once?: boolean
  type?: 'modal'
}

export type DefineEvent = <Event extends keyof HarmonixEvents = any>(
  callback: EventCallback<Event>
) => HarmonixEvent
export type DefineEventWithOptions = <Event extends keyof HarmonixEvents = any>(
  options: EventOptions,
  callback: EventCallback<Event>
) => HarmonixEvent

export type HarmonixEventInput = string | HarmonixEvent

export interface HarmonixEvent {
  options: EventOptions
  callback: EventCallback<keyof HarmonixEvents>
}
