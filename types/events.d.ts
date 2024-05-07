import type { Client } from 'discord.js'

export type EventCallback = (client: Client) => void

export interface EventContext {
  name: string
  once: boolean
  execute: EventCallback
}

export interface EventOptions {
  name?: string
  once?: boolean
}

export type DefineEvent = (callback: EventCallback) => HarmonyEvent
export type DefineEventWithOptions = (
  options: EventOptions,
  callback: EventCallback
) => HarmonyEvent

export type HarmonyEventInput = string | HarmonyEvent

export interface HarmonyEvent {
  options: EventOptions
  callback: EventCallback
}
