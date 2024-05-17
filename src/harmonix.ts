import { Collection } from 'discord.js'
import type { LoadConfigOptions } from 'c12'
import { getContext } from 'unctx'
import consola from 'consola'
import { colors } from 'consola/utils'
import { loadOptions } from './options'
import {
  scanCommands,
  scanContextMenus,
  scanEvents,
  scanPreconditions
} from './scan'
import {
  loadCommands,
  loadContextMenus,
  loadEvents,
  loadPreconditions
} from './load'
import { initCient, refreshApplicationCommands } from './discord'
import {
  registerContextMenu,
  registerEvents,
  registerCommands
} from './register'
import {
  resolveCommand,
  resolveContextMenu,
  resolveEvent,
  resolvePrecondition
} from './resolve'
import type { Harmonix, HarmonixConfig, HarmonixOptions } from './types'
import { version } from '../package.json'

export const ctx = getContext<Harmonix>('harmonix')

export const useHarmonix = ctx.use

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  const options = await loadOptions(config, opts)
  const harmonix: Harmonix = {
    options: options as HarmonixOptions,
    events: new Collection(),
    commands: new Collection(),
    contextMenus: new Collection(),
    preconditions: new Collection()
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

  if (!process.env.DISCORD_CLIENT_TOKEN) {
    createError(
      'Client token is required. Please provide it in the environment variable DISCORD_CLIENT_TOKEN.'
    )
  }
  consola.log(colors.blue(`Harmonix ${colors.bold(version)}\n`))

  loadEvents(harmonix, events)
  loadCommands(harmonix, commands)
  loadContextMenus(harmonix, contextMenus)
  loadPreconditions(harmonix, preconditions)

  harmonix.client = initCient(harmonix.options)

  registerEvents(harmonix)
  await refreshApplicationCommands(harmonix)
  registerCommands(harmonix)
  registerContextMenu(harmonix)

  return harmonix
}

export const createError = (message: string) => {
  consola.error(new Error(message))
  process.exit(1)
}
