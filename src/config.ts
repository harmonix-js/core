import { LoadConfigOptions, loadConfig } from 'c12'
import { defu } from 'defu'
import type { HarmonyConfig } from '../types'

export interface LoadHarmonyConfigOptions
  extends LoadConfigOptions<HarmonyConfig> {}

export const loadHarmonyConfig = async (opts: LoadHarmonyConfigOptions) => {
  const { config } = await loadConfig<HarmonyConfig>({
    name: 'harmony',
    configFile: 'harmony.config',
    rcFile: '.harmonyrc',
    dotenv: true,
    globalRc: true,
    ...opts
  })

  return defu(config, {
    defaultPrefix: '!',
    dir: {
      commands: './commands',
      events: './events'
    }
  })
}

export const defineHarmonyConfig = (config: HarmonyConfig) => {
  return config
}
