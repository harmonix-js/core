import type { LoadConfigOptions } from 'c12'
import consola from 'consola'
import { colors } from 'consola/utils'
import { loadOptions } from './options'
import {
  scanCommands,
  scanContextMenus,
  scanEvents,
  scanPreconditions
} from './scan'
import { initCient, refreshApplicationCommands } from './discord'
import {
  registerCommands,
  registerContextMenu,
  registerEvents,
  registerPreconditions,
  registerSlashCommands
} from './register'
import type { Harmonix, HarmonixConfig, HarmonixOptions } from './types'
import { version } from '../package.json'
import {
  resolveCommand,
  resolveContextMenu,
  resolveEvent,
  resolvePrecondition
} from './resolve'

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadOptions(config, opts)
  const harmonix: Harmonix = {
    options: options as HarmonixOptions,
    preconditions: new Map()
  }

  const scannedCommands = await scanCommands(harmonix)
  const _commands = [...(harmonix.options.commands || []), ...scannedCommands]
  const commands = _commands.map((cmd) => resolveCommand(cmd, harmonix.options))

  const scannedEvents = await scanEvents(harmonix)
  const _events = [...(harmonix.options.events || []), ...scannedEvents]
  const events = _events.map((evt) => resolveEvent(evt, harmonix.options))

  const scannedContextMenus = await scanContextMenus(harmonix)
  const _contextMenus = [
    ...(harmonix.options.contextMenus || []),
    ...scannedContextMenus
  ]
  const contextMenus = _contextMenus.map((ctm) =>
    resolveContextMenu(ctm, harmonix.options)
  )

  const scannedPreconditions = await scanPreconditions(harmonix)
  const _preconditions = [
    ...(harmonix.options.preconditions || []),
    ...scannedPreconditions
  ]
  const preconditions = _preconditions.map((prc) =>
    resolvePrecondition(prc, harmonix.options)
  )

  if (!process.env.HARMONIX_CLIENT_TOKEN) {
    createError(
      'Client token is required. Please provide it in the environment variable HARMONIX_CLIENT_TOKEN.'
    )
  }
  if (!harmonix.options.clientId && !process.env.HARMONIX_CLIENT_ID) {
    createError(
      'Client ID is required. You can provide it in the configuration file or in the environment variable HARMONIX_CLIENT_ID.'
    )
  }
  consola.log(colors.blue(`Harmonix ${colors.bold(version)}\n`))
  harmonix.client = initCient(harmonix.options)
  registerEvents(harmonix, events)
  registerPreconditions(harmonix, preconditions)
  await refreshApplicationCommands(harmonix, [
    ...commands.filter((cmd) => cmd.options.slash),
    ...contextMenus
  ])
  registerCommands(
    harmonix,
    commands.filter((cmd) => !cmd.options.slash)
  )
  registerSlashCommands(
    harmonix,
    commands.filter((cmd) => cmd.options.slash)
  )
  registerContextMenu(harmonix, contextMenus)

  return harmonix
}

export const createError = (message: string) => {
  consola.error(new Error(message))
  process.exit(1)
}
