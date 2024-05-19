import type {
  Harmonix,
  HarmonixButton,
  HarmonixCommand,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixModal,
  HarmonixPrecondition
} from './types'
import { HarmonixSelectMenu } from './types/select-menus'

export const loadEvents = (harmonix: Harmonix, events: HarmonixEvent[]) => {
  for (const evt of events) {
    harmonix.events.set(evt.options.name!, evt)
  }
}

export const loadCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand[]
) => {
  for (const cmd of commands) {
    harmonix.commands.set(cmd.config.name!, cmd)
  }
}

export const loadContextMenus = (
  harmonix: Harmonix,
  contextMenus: HarmonixContextMenu[]
) => {
  for (const ctm of contextMenus) {
    harmonix.contextMenus.set(ctm.config.name!, ctm)
  }
}

export const loadButtons = (harmonix: Harmonix, buttons: HarmonixButton[]) => {
  for (const btn of buttons) {
    harmonix.buttons.set(btn.config.id!, btn)
  }
}

export const loadModals = (harmonix: Harmonix, modals: HarmonixModal[]) => {
  for (const mdl of modals) {
    harmonix.modals.set(mdl.config.id!, mdl)
  }
}

export const loadSelectMenus = (
  harmonix: Harmonix,
  selectMenus: HarmonixSelectMenu[]
) => {
  for (const slm of selectMenus) {
    harmonix.selectMenus.set(slm.config.id!, slm)
  }
}

export const loadPreconditions = (
  harmonix: Harmonix,
  preconditions: HarmonixPrecondition[]
) => {
  for (const prc of preconditions) {
    harmonix.preconditions.set(prc.name!, prc)
  }
}
