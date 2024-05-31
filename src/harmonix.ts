import { Collection } from 'discord.js'
import type { LoadConfigOptions } from 'c12'
import { getContext } from 'unctx'
import consola from 'consola'
import { colors } from 'consola/utils'
import { watch } from 'chokidar'
import { resolve } from 'pathe'
import { debounce } from 'perfect-debounce'
import type { Stats } from 'node:fs'
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

export const ctx = getContext<Harmonix>('harmonix')
export const useHarmonix = ctx.use

const initHarmonix = async (
  config: HarmonixConfig,
  options: LoadConfigOptions
): Promise<Harmonix> => {
  const opts = await loadOptions(config, options)

  return {
    configFile: opts.configFile as string,
    options: opts.options as HarmonixOptions,
    events: new Collection(),
    commands: new Collection(),
    contextMenus: new Collection(),
    buttons: new Collection(),
    modals: new Collection(),
    selectMenus: new Collection(),
    preconditions: new Collection()
  }
}

const watchReload = (
  harmonix: Harmonix,
  config: HarmonixConfig,
  opts: LoadConfigOptions
) => {
  const filesToWatch = [
    harmonix.options.dirs.commands,
    harmonix.options.dirs.events,
    harmonix.options.dirs.contextMenus,
    harmonix.options.dirs.buttons,
    harmonix.options.dirs.modals,
    harmonix.options.dirs.selectMenus,
    harmonix.options.dirs.preconditions
  ].map((file) => resolve(harmonix.options.rootDir, file))
  const watcher = watch([...filesToWatch, harmonix.configFile], {
    ignored: harmonix.options.ignore,
    ignoreInitial: true
  })
  const reload = debounce(
    async (event: string, path: string, stats: Stats | undefined) => {
      if (stats?.size === 0) return
      consola.info(
        `${colors.blue(`lr ${event}`)}`,
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

  watcher.on('all', (event, path, stats) => reload(event, path, stats))
}

export const createHarmonix = async (
  config: HarmonixConfig = {},
  opts: LoadConfigOptions = {}
) => {
  if (!process.env.DISCORD_CLIENT_TOKEN) {
    createError(
      'Client token is required. Please provide it in the environment variable DISCORD_CLIENT_TOKEN.'
    )
  }
  const harmonix = await initHarmonix(config, opts)

  consola.log(colors.blue(`Harmonix ${colors.bold(version)}\n`))
  await loadHarmonix(harmonix, config, opts)
  if (process.env.NODE_ENV === 'development') {
    watchReload(harmonix, config, opts)
  }

  return harmonix
}

const clearHarmonix = async (harmonix: Harmonix) => {
  harmonix.client?.destroy()
  harmonix.events.clear()
  harmonix.commands.clear()
  harmonix.contextMenus.clear()
  harmonix.buttons.clear()
  harmonix.modals.clear()
  harmonix.selectMenus.clear()
  harmonix.preconditions.clear()
}

const loadHarmonix = async (
  harmonix: Harmonix,
  config: HarmonixConfig,
  options: LoadConfigOptions
) => {
  const opts = await loadOptions(config, options)

  harmonix.configFile = opts.configFile as string
  harmonix.options = opts.options as HarmonixOptions
  const [
    scannedEvents,
    scannedCommands,
    scannedContextMenus,
    scannedButtons,
    scannedModals,
    scannedSelectMenus,
    scannedPreconditions
  ] = await Promise.all([
    scanEvents(harmonix),
    scanCommands(harmonix),
    scanContextMenus(harmonix),
    scanButtons(harmonix),
    scanModals(harmonix),
    scanSelectMenus(harmonix),
    scanPreconditions(harmonix)
  ])
  const events = [...(harmonix.options.events || []), ...scannedEvents].map(
    (evt) => resolveEvent(evt, harmonix.options)
  )
  const commands = [
    ...(harmonix.options.commands || []),
    ...scannedCommands
  ].map((cmd) => resolveCommand(cmd, harmonix.options))
  const contextMenus = [
    ...(harmonix.options.contextMenus || []),
    ...scannedContextMenus
  ].map((ctm) => resolveContextMenu(ctm, harmonix.options))
  const buttons = [...(harmonix.options.buttons || []), ...scannedButtons].map(
    (btn) => resolveButton(btn, harmonix.options)
  )
  const modals = [...(harmonix.options.modals || []), ...scannedModals].map(
    (mdl) => resolveModal(mdl, harmonix.options)
  )
  const selectMenus = [
    ...(harmonix.options.selectMenus || []),
    ...scannedSelectMenus
  ].map((slm) => resolveSelectMenu(slm, harmonix.options))
  const preconditions = [
    ...(harmonix.options.preconditions || []),
    ...scannedPreconditions
  ].map((prc) => resolvePrecondition(prc, harmonix.options))

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
