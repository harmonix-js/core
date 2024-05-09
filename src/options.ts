import { LoadConfigOptions, loadConfig } from 'c12'
import { resolve } from 'pathe'
import type { HarmonixConfig } from './types'

const HarmonixDefaults: HarmonixConfig = {
  scanDirs: [],
  ignore: [],
  intents: ['Guilds', 'GuildMessages', 'MessageContent']
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
    throw new Error('No configuration found')
  }
  const options = config

  options.rootDir = resolve(options.rootDir || '.')
  options.srcDir = resolve(options.srcDir || options.rootDir)
  options.scanDirs?.unshift(options.srcDir)
  options.scanDirs = options.scanDirs?.map((dir) =>
    resolve(options.srcDir!, dir!)
  )
  options.scanDirs = [...new Set(options.scanDirs)]
  options.defaultPrefix = options.defaultPrefix || '!'

  return options
}

export const defineHarmonixConfig = (config: HarmonixConfig) => {
  return config
}
