import type { LoadConfigOptions } from 'c12'
import { loadOptions } from './options'
import { scanCommands, scanEvents } from './scan'
import { resolveHarmonixCommand } from './commands'
import { resolveHarmonixEvent } from './events'
import {
  initCient,
  registerCommands,
  registerEvents,
  registerSlashCommands
} from './discord'
import type { Harmonix, HarmonixConfig, HarmonixOptions } from './types'

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadOptions(config, opts)
  const harmonix: Harmonix = {
    options: options as HarmonixOptions
  }

  const scannedCommands = await scanCommands(harmonix)
  const _commands = [...(harmonix.options.commands || []), ...scannedCommands]
  const commands = _commands.map((cmd) =>
    resolveHarmonixCommand(cmd, harmonix.options)
  )

  const scannedEvents = await scanEvents(harmonix)
  const _events = [...(harmonix.options.events || []), ...scannedEvents]
  const events = _events.map((evt) =>
    resolveHarmonixEvent(evt, harmonix.options)
  )

  if (!process.env.HARMONIX_CLIENT_TOKEN) {
    throw new Error(
      'Client token is required. Please provide it in the environment variable HARMONIX_CLIENT_TOKEN.'
    )
  }
  if (!harmonix.options.clientId && !process.env.HARMONIX_CLIENT_ID) {
    throw new Error(
      'Client ID is required. You can provide it in the configuration file or in the environment variable HARMONIX_CLIENT_ID.'
    )
  }
  harmonix.client = initCient(harmonix.options)
  registerCommands(
    harmonix,
    commands.filter((cmd) => !cmd.options.slash)
  )
  await registerSlashCommands(
    harmonix,
    commands.filter((cmd) => cmd.options.slash)
  )
  registerEvents(harmonix, events)

  return harmonix
}
