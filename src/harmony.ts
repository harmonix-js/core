import type { LoadConfigOptions } from 'c12'
import { loadOptions } from './options'
import { scanCommands, scanEvents } from './scan'
import { resolveHarmonyCommand } from './commands'
import { resolveHarmonyEvent } from './events'
import type { Harmony, HarmonyConfig, HarmonyOptions } from './types'

export const createHarmony = async (
  config: HarmonyConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadOptions(config, opts)
  const harmony: Harmony = {
    options: options as HarmonyOptions
  }

  const scannedCommands = await scanCommands(harmony)
  const _commands = [...(harmony.options.commands || []), ...scannedCommands]
  const commands = new Map(
    _commands.map((cmd) => {
      const command = resolveHarmonyCommand(cmd, harmony.options)

      return [command.options.name!, command]
    })
  )

  const scannedEvents = await scanEvents(harmony)
  const _events = [...(harmony.options.events || []), ...scannedEvents]
  const events = new Map(
    _events.map((evt) => {
      const event = resolveHarmonyEvent(evt, harmony.options)

      return [event.options.name!, event]
    })
  )

  console.log('commands', commands)
  console.log('events', events)

  return harmony
}
