import type { C12InputConfig } from 'c12'
import type {
  Client,
  BitFieldResolvable,
  GatewayIntentsString
} from 'discord.js'
import type { HarmonixCommandInput } from './commands'
import type { HarmonixEventInput } from './events'

export interface HarmonixOptions {
  rootDir: string
  srcDir: string
  scanDirs: string[]
  ignore: string[]
  commands: HarmonixCommandInput[]
  events: HarmonixEventInput[]
  defaultPrefix: string
  intents: BitFieldResolvable<GatewayIntentsString, number>
  clientId: string
  ownerId: string | string[]
}

type DeepPartial<T> =
  T extends Record<string, any>
    ? { [P in keyof T]?: DeepPartial<T[P]> | T[P] }
    : T

export interface HarmonixConfig
  extends DeepPartial<HarmonixOptions>,
    C12InputConfig<HarmonixConfig> {}

export interface Harmonix {
  options: HarmonixOptions
  client?: Client
}
