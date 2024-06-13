import type { C12InputConfig } from 'c12'
import type { Client, Collection, ClientOptions } from 'discord.js'
import type { HarmonixCommand, HarmonixCommandInput } from './commands'
import type { HarmonixEvent, HarmonixEventInput } from './events'
import type {
  HarmonixContextMenu,
  HarmonixContextMenuInput
} from './context-menus'
import { HarmonixButton, HarmonixButtonInput } from './buttons'
import { HarmonixModal, HarmonixModalInput } from './modals'
import { HarmonixSelectMenu, HarmonixSelectMenuInput } from './select-menus'
import type {
  HarmonixPrecondition,
  HarmonixPreconditionInput
} from './preconditions'

interface HarmonixDirs {
  events: string
  commands: string
  contextMenus: string
  components: {
    dir: string
    buttons: string
    modals: string
    selectMenus: string
  }
  preconditions: string
}

interface RuntimeEnv {
  [key: string]: string | undefined
}

export interface HarmonixOptions {
  rootDir: string
  srcDir: string
  scanDirs: string[]
  dirs: HarmonixDirs
  ignore: string[]
  events: HarmonixEventInput[]
  commands: HarmonixCommandInput[]
  contextMenus: HarmonixContextMenuInput[]
  components: {
    buttons: HarmonixButtonInput[]
    modals: HarmonixModalInput[]
    selectMenus: HarmonixSelectMenuInput[]
  }
  preconditions: HarmonixPreconditionInput[]
  client: ClientOptions
  clientId: string
  env: RuntimeEnv
}

type DeepPartial<T> =
  T extends Record<string, any>
    ? { [P in keyof T]?: DeepPartial<T[P]> | T[P] }
    : T

export interface HarmonixConfig
  extends DeepPartial<HarmonixOptions>,
    C12InputConfig<HarmonixConfig> {}

export interface Harmonix {
  configFile: string
  options: HarmonixOptions
  client?: Client
  events: Collection<string, HarmonixEvent>
  commands: Collection<string, HarmonixCommand>
  contextMenus: Collection<string, HarmonixContextMenu>
  components: {
    buttons: Collection<string, HarmonixButton>
    modals: Collection<string, HarmonixModal>
    selectMenus: Collection<string, HarmonixSelectMenu>
  }
  preconditions: Collection<string, HarmonixPrecondition>
}

export interface RuntimeHarmonix extends Harmonix {
  client: Client
}
