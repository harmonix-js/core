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

export interface HarmonixOptions {
  rootDir: string
  srcDir: string
  scanDirs: string[]
  ignore: string[]
  commands: HarmonixCommandInput[]
  events: HarmonixEventInput[]
  contextMenus: HarmonixContextMenuInput[]
  buttons: HarmonixButtonInput[]
  modals: HarmonixModalInput[]
  selectMenus: HarmonixSelectMenuInput[]
  preconditions: HarmonixPreconditionInput[]
  defaultPrefix: string
  client: ClientOptions
  clientId: string
  ownerIds: string[]
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
  events: Collection<string, HarmonixEvent>
  commands: Collection<string, HarmonixCommand>
  contextMenus: Collection<string, HarmonixContextMenu>
  buttons: Collection<string, HarmonixButton>
  modals: Collection<string, HarmonixModal>
  selectMenus: Collection<string, HarmonixSelectMenu>
  preconditions: Collection<string, HarmonixPrecondition>
}
