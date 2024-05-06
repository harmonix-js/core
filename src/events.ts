import createJiti from 'jiti'
import { filename } from 'pathe/utils'
import { getAllFiles } from './utils'
import type { EventCallback, EventOptions, EventResult } from '../types'

const jiti = createJiti(undefined as unknown as string, {
  interopDefault: true,
  requireCache: false,
  esmResolve: true,
  extensions: ['.ts', '.js']
})

const eventsPath = getAllFiles('./playground/events')

const parseFileName = (fileName: string) => {
  const parts = fileName.split('.')
  const name = parts[0]
  const hasOnce = parts[parts.length - 1] === 'once'

  return [name, hasOnce]
}

export const loadEvents = () => {
  const events = Object.fromEntries(
    eventsPath.map((path) => {
      const [name, isOnce] = parseFileName(filename(path))!

      return [name, () => ({ once: isOnce, ...jiti(path) })]
    })
  ) as Record<string, () => { once: boolean } & EventResult>

  return events
}

export const defineEvent = (
  options: EventOptions,
  callback: EventCallback
): EventResult => {
  return {
    data: options,
    callback
  }
}
