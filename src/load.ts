import { helpCommand } from './builtins'
import type {
  Harmonix,
  HarmonixButton,
  HarmonixCommand,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixModal,
  HarmonixPrecondition,
  HarmonixSelectMenu
} from './types'

export const loadEvents = (harmonix: Harmonix, events: HarmonixEvent[]) => {
  for (const evt of events) {
    if (evt.config.order) {
      harmonix.events.set(`${evt.config.order}.${evt.config.name!}`, evt)
    } else {
      harmonix.events.set(evt.config.name!, evt)
    }
  }
}

export const loadCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand[]
) => {
  for (const cmd of commands) {
    harmonix.commands.set(cmd.config.name!, cmd)
  }
  if (!harmonix.commands.has('help')) {
    harmonix.commands.set('help', helpCommand as HarmonixCommand<any>)
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
    harmonix.components.buttons.set(btn.config.id!, btn)
  }
}

export const loadModals = (harmonix: Harmonix, modals: HarmonixModal[]) => {
  for (const mdl of modals) {
    harmonix.components.modals.set(mdl.config.id!, mdl)
  }
}

export const loadSelectMenus = (
  harmonix: Harmonix,
  selectMenus: HarmonixSelectMenu[]
) => {
  for (const slm of selectMenus) {
    harmonix.components.selectMenus.set(slm.config.id!, slm)
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
