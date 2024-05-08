import { LoadConfigOptions, loadConfig } from 'c12'
import { resolve } from 'pathe'
import type { HarmonyConfig } from './types'

const HarmonyDefaults: HarmonyConfig = {
  scanDirs: [],
  ignore: [],
  intents: ['Guilds', 'GuildMessages', 'MessageContent']
}

export const loadOptions = async (
  configOverrides: HarmonyConfig = {},
  opts: LoadConfigOptions
) => {
  const { config } = await loadConfig<HarmonyConfig>({
    name: 'harmony',
    configFile: 'harmony.config',
    rcFile: '.harmonyrc',
    dotenv: true,
    globalRc: true,
    overrides: configOverrides,
    defaults: HarmonyDefaults,
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

export const defineHarmonyConfig = (config: HarmonyConfig) => {
  return config
}
