import { Collection } from 'discord.js'
import type { LoadConfigOptions } from 'c12'
import { getContext } from 'unctx'
import consola from 'consola'
import { colors } from 'consola/utils'
import { watch } from 'chokidar'
import { resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import { loadOptions } from './options'
import {
  scanButtons,
  scanCommands,
  scanContextMenus,
  scanEvents,
  scanModals,
  scanPreconditions,
  scanSelectMenus
} from './scan'
import {
  loadButtons,
  loadCommands,
  loadContextMenus,
  loadEvents,
  loadModals,
  loadPreconditions,
  loadSelectMenus
} from './load'
import { initCient, refreshApplicationCommands } from './discord'
import {
  registerContextMenu,
  registerEvents,
  registerCommands,
  registerButtons,
  registerModals,
  registerSelectMenus,
  registerAutocomplete
} from './register'
import {
  resolveButton,
  resolveCommand,
  resolveContextMenu,
  resolveEvent,
  resolveModal,
  resolvePrecondition,
  resolveSelectMenu
} from './resolve'
import type { Harmonix, HarmonixConfig, HarmonixOptions } from './types'
import { version } from '../package.json'
import { Stats } from 'fs'

export const ctx = getContext<Harmonix>('harmonix')

export const useHarmonix = ctx.use

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  if (!process.env.DISCORD_CLIENT_TOKEN) {
    createError(
      'Client token is required. Please provide it in the environment variable DISCORD_CLIENT_TOKEN.'
    )
  }
  const options = await loadOptions(config, opts)
  const harmonix: Harmonix = {
    options: options as HarmonixOptions,
    events: new Collection(),
    commands: new Collection(),
    contextMenus: new Collection(),
    buttons: new Collection(),
    modals: new Collection(),
    selectMenus: new Collection(),
    preconditions: new Collection()
  }

  consola.log(colors.blue(`Harmonix ${colors.bold(version)}\n`))
  const watcher = watch(harmonix.options.scanDirs, {
    ignored: harmonix.options.ignore,
    ignoreInitial: true
  })

  const reload = debounce(
    async (event: string, path: string, stats: Stats | undefined) => {
      if (stats?.size === 0) return
      consola.info(
        `${colors.blue(`lr: ${event}`)}`,
        `${colors.gray(resolve(path).replace(harmonix.options.rootDir, ''))}`
      )
      clearHarmonix(harmonix)
      try {
        await loadHarmonix(harmonix, config, opts)
      } catch (error: any) {
        createError(error.message)
      }
    },
    100
  )

  await loadHarmonix(harmonix, config, opts)
  watcher.on('all', (event, path, stats) => reload(event, path, stats))

  return harmonix
}

export const clearHarmonix = async (harmonix: Harmonix) => {
  harmonix.client?.destroy()
  harmonix.events.clear()
  harmonix.commands.clear()
  harmonix.contextMenus.clear()
  harmonix.buttons.clear()
  harmonix.modals.clear()
  harmonix.selectMenus.clear()
  harmonix.preconditions.clear()
}

export const loadHarmonix = async (
  harmonix: Harmonix,
  config: HarmonixConfig,
  opts: LoadConfigOptions
) => {
  const options = await loadOptions(config, opts)

  harmonix.options = options as HarmonixOptions
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

  const scannedButtons = await scanButtons(harmonix)
  const _buttons = [...(harmonix.options.buttons || []), ...scannedButtons]
  const buttons = _buttons.map((btn) => resolveButton(btn, harmonix.options))

  const scannedModals = await scanModals(harmonix)
  const _modals = [...(harmonix.options.modals || []), ...scannedModals]
  const modals = _modals.map((mdl) => resolveModal(mdl, harmonix.options))

  const scannedSelectMenus = await scanSelectMenus(harmonix)
  const _selectMenus = [
    ...(harmonix.options.selectMenus || []),
    ...scannedSelectMenus
  ]
  const selectMenus = _selectMenus.map((slm) =>
    resolveSelectMenu(slm, harmonix.options)
  )

  const scannedPreconditions = await scanPreconditions(harmonix)
  const _preconditions = [
    ...(harmonix.options.preconditions || []),
    ...scannedPreconditions
  ]
  const preconditions = _preconditions.map((prc) =>
    resolvePrecondition(prc, harmonix.options)
  )

  loadEvents(harmonix, events)
  loadCommands(harmonix, commands)
  loadContextMenus(harmonix, contextMenus)
  loadButtons(harmonix, buttons)
  loadModals(harmonix, modals)
  loadSelectMenus(harmonix, selectMenus)
  loadPreconditions(harmonix, preconditions)

  harmonix.client = initCient(harmonix.options)

  registerEvents(harmonix)
  await refreshApplicationCommands(harmonix)
  registerCommands(harmonix)
  registerContextMenu(harmonix)
  registerButtons(harmonix)
  registerModals(harmonix)
  registerSelectMenus(harmonix)
  registerAutocomplete(harmonix)
}

export const createError = (message: string) => {
  consola.error(new Error(message))
  process.exit(1)
}
