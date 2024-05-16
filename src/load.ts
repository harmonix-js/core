import type {
  Harmonix,
  HarmonixCommand,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixPrecondition
} from './types'

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
    harmonix.commands.set(cmd.options.name!, cmd)
  }
}

export const loadContextMenus = (
  harmonix: Harmonix,
  contextMenus: HarmonixContextMenu[]
) => {
  for (const ctm of contextMenus) {
    harmonix.contextMenus.set(ctm.options.name!, ctm)
  }
}

export const loadPreconditions = (
  harmonix: Harmonix,
  preconditions: HarmonixPrecondition[]
) => {
  for (const prc of preconditions) {
    harmonix.preconditions.set(prc.options.name!, prc)
  }
}
