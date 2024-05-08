import type { LoadConfigOptions } from 'c12'
import { loadOptions } from './options'
import { scanCommands, scanEvents } from './scan'
import { resolveHarmonyCommand } from './commands'
import { resolveHarmonyEvent } from './events'
import {
  initCient,
  registerCommands,
  registerEvents,
  registerSlashCommands
} from './discord'
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
  const commands = _commands.map((cmd) =>
    resolveHarmonyCommand(cmd, harmony.options)
  )

  const scannedEvents = await scanEvents(harmony)
  const _events = [...(harmony.options.events || []), ...scannedEvents]
  const events = _events.map((evt) => resolveHarmonyEvent(evt, harmony.options))

  harmony.client = initCient(harmony.options)
  registerCommands(
    harmony,
    commands.filter((cmd) => !cmd.options.slash)
  )
  await registerSlashCommands(
    harmony,
    commands.filter((cmd) => cmd.options.slash)
  )
  registerEvents(harmony, events)

  return harmony
}
