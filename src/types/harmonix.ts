import type { C12InputConfig } from 'c12'
import type {
  Client,
  BitFieldResolvable,
  GatewayIntentsString
} from 'discord.js'
import type { HarmonixCommandInput } from './commands'
import type { HarmonixEventInput } from './events'
import type { HarmonixContextMenuInput } from './contextMenus'
import type {
  HarmonixPrecondition,
  HarmonixPreconditionInput
} from './preconditions'

export interface HarmonixOptions {
  rootDir: string
  srcDir: string
  scanDirs: string[]
  ignore: string[]
  commands: HarmonixCommandInput[]
  events: HarmonixEventInput[]
  contextMenus: HarmonixContextMenuInput[]
  preconditions: HarmonixPreconditionInput[]
  defaultPrefix: string
  intents: BitFieldResolvable<GatewayIntentsString, number>
  clientId: string
  ownerId: string[]
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
  preconditions: Map<string, HarmonixPrecondition>
}
