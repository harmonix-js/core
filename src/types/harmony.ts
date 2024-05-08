import type { C12InputConfig } from 'c12'
import type {
  Client,
  BitFieldResolvable,
  GatewayIntentsString
} from 'discord.js'
import type { HarmonyCommandInput } from './commands'
import type { HarmonyEventInput } from './events'

export interface HarmonyOptions {
  rootDir: string
  srcDir: string
  scanDirs: string[]
  ignore: string[]
  commands: HarmonyCommandInput[]
  events: HarmonyEventInput[]
  defaultPrefix: string
  intents: BitFieldResolvable<GatewayIntentsString, number>
  clientId: string
}

type DeepPartial<T> =
  T extends Record<string, any>
    ? { [P in keyof T]?: DeepPartial<T[P]> | T[P] }
    : T

export interface HarmonyConfig
  extends DeepPartial<HarmonyOptions>,
    C12InputConfig<HarmonyConfig> {}

export interface Harmony {
  options: HarmonyOptions
  client?: Client
}
