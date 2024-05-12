import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import type {
  DefineEvent,
  DefineEventWithOptions,
  EventCallback,
  EventOptions,
  Harmonix,
  HarmonixEvent,
  HarmonixEventInput,
  HarmonixEvents
} from './types'

export const resolveHarmonixEvent = (
  evt: HarmonixEventInput,
  harmonixOptions: Harmonix['options']
): HarmonixEvent => {
  if (typeof evt === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _evtPath = _jiti.resolve(evt)
    const event = _jiti(_evtPath) as HarmonixEvent
    const options: EventOptions = {
      name: event.options.name || filename(_evtPath).split('.')[0],
      once: event.options.once || filename(_evtPath).endsWith('.once'),
      type:
        event.options.type || filename(dirname(_evtPath)) === 'modals'
          ? 'modal'
          : undefined
    }

    return { options, callback: event.callback }
  } else {
    return evt
  }
}

export const defineEvent: DefineEvent & DefineEventWithOptions = <
  Event extends keyof HarmonixEvents = any
>(
  ...args: [EventOptions | EventCallback<Event>, EventCallback<Event>?]
): HarmonixEvent => {
  let options: EventOptions = {}

  if (args.length === 1) {
    const [callback] = args as [EventCallback<keyof HarmonixEvents>]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [
      EventOptions,
      EventCallback<keyof HarmonixEvents>
    ]

    options = opts
    return {
      options,
      callback
    }
  }
}
