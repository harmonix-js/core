import jiti from 'jiti'
import { filename } from 'pathe/utils'
import type {
  DefineEvent,
  DefineEventWithOptions,
  EventCallback,
  EventOptions,
  HarmonyEvent,
  HarmonyEventInput
} from '../types'
import { Harmony } from './harmony'

export const resolveHarmonyEvent = (
  evt: HarmonyEventInput,
  harmonyOptions: Harmony['options']
): HarmonyEvent => {
  if (typeof evt === 'string') {
    const _jiti = jiti(harmonyOptions.rootDir, {
      interopDefault: true
    })
    const _evtPath = _jiti.resolve(evt)
    const event = _jiti(_evtPath) as HarmonyEvent
    const options: EventOptions = {
      name: filename(_evtPath).split('.')[0],
      once: event.options.once || filename(_evtPath).endsWith('.once')
    }

    return { options, callback: event.callback }
  } else {
    return evt
  }
}

export const defineEvent: DefineEvent & DefineEventWithOptions = (
  ...args: [EventOptions | EventCallback, EventCallback?]
): HarmonyEvent => {
  let options: EventOptions = {}

  if (args.length === 1) {
    const [callback] = args as [EventCallback]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [EventOptions, EventCallback]

    options = opts
    return {
      options,
      callback
    }
  }
}
