export type EventCallback = (...args: any) => void

export interface EventOptions {
  name?: string
  once?: boolean
  type?: 'modal'
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
