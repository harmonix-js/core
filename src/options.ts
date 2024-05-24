import { LoadConfigOptions, loadConfig } from 'c12'
import { resolve } from 'pathe'
import type { HarmonixConfig } from './types'
import { createError } from './harmonix'
import defu from 'defu'

const HarmonixDefaults: HarmonixConfig = {
  scanDirs: [],
  ignore: [],
  commands: [],
  events: [],
  contextMenus: [],
  preconditions: []
}

export const loadOptions = async (
  configOverrides: HarmonixConfig = {},
  opts: LoadConfigOptions
) => {
  const { config, configFile } = await loadConfig<HarmonixConfig>({
    name: 'harmonix',
    configFile: 'harmonix.config',
    dotenv: true,
    overrides: configOverrides,
    defaults: HarmonixDefaults,
    ...opts
  })

  if (!config) {
    return createError('No configuration found')
  }
  const options = config

  options.rootDir = resolve(options.rootDir || '.')
  options.srcDir = resolve(options.srcDir || options.rootDir)
  options.scanDirs?.unshift(options.srcDir)
  options.scanDirs = options.scanDirs?.map((dir) =>
    resolve(options.srcDir!, dir!)
  )
  options.scanDirs = [...new Set(options.scanDirs)]
  const intents = options.client?.intents || []

  options.client = options.client || {}
  options.client.intents = intents
  options.dirs = defu(options.dirs, {
    commands: 'commands',
    events: 'events',
    contextMenus: 'context-menus',
    buttons: 'buttons',
    modals: 'modals',
    selectMenus: 'select-menus',
    preconditions: 'preconditions'
  })

  return { options, configFile }
}
