import { loadConfig } from 'c12'
import { resolve } from 'pathe'
import { defu } from 'defu'
import type { HarmonyConfig } from '../types'

export const loadHarmonyConfig = async () => {
  const { config } = await loadConfig<HarmonyConfig>({
    name: 'harmony',
    configFile: 'harmony.config',
    rcFile: '.harmonyrc',
    dotenv: true,
    globalRc: true,
    cwd: resolve('./playground')
  })

  return defu(config, {
    defaultPrefix: '!'
  })
}

export const defineHarmonyConfig = (config: HarmonyConfig) => {
  return config
}
