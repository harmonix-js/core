import { LoadConfigOptions, loadConfig } from 'c12'
import { resolve } from 'pathe'
import type { HarmonixConfig } from './types'
import { createError } from './harmonix'

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
  const { config } = await loadConfig<HarmonixConfig>({
    name: 'harmonix',
    configFile: 'harmonix.config',
    rcFile: '.harmonixrc',
    dotenv: true,
    globalRc: true,
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
  options.client = options.client || {}

  return options
}
