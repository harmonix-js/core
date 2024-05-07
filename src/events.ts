import createJiti from 'jiti'
import { filename } from 'pathe/utils'
import type { DefineEvent, DefineEventWithOptions, EventCallback, EventResult } from '../types'

const jiti = createJiti(undefined as unknown as string, {
  interopDefault: true,
  requireCache: false,
  esmResolve: true,
  extensions: ['.ts', '.js']
})

interface EventContext {
  name: string
  once: boolean
  execute: EventCallback
}

interface EventOptions {
  once?: boolean
}

export class Event {
  public name: string
  public once: boolean

  public callback: EventCallback

  constructor(context: EventContext, options: EventOptions = {}) {
    this.name = context.name
    this.once = options.once || context.once

    this.callback = context.execute
  }
}

export const getEvent = (path: string) => {
  const event = jiti(path) as EventResult
  const context: EventContext = {
    name: filename(path).split('.')[0],
    once: filename(path).endsWith('.once'),
    execute: event.callback
  }

  return new Event(context, event.options)
}

export const defineEvent: DefineEvent & DefineEventWithOptions = (
  ...args: [EventOptions | EventCallback, EventCallback?]
): EventResult => {
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
