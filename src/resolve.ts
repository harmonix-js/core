import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import type {
  CommandOptions,
  ContextMenuOptions,
  EventOptions,
  Harmonix,
  HarmonixCommand,
  HarmonixCommandInput,
  HarmonixContextMenu,
  HarmonixContextMenuInput,
  HarmonixEvent,
  HarmonixEventInput,
  HarmonixPrecondition,
  HarmonixPreconditionInput,
  PreconditionOptions
} from './types'

export const resolveEvent = (
  evt: HarmonixEventInput,
  harmonixOptions: Harmonix['options']
): HarmonixEvent => {
  if (typeof evt === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _evtPath = _jiti.resolve(evt)
    const event = _jiti(_evtPath) as HarmonixEvent
    const options: EventOptions = {
      name: event.options.name || filename(_evtPath).split('.')[0],
      once: event.options.once || filename(_evtPath).endsWith('.once'),
      type:
        event.options.type || filename(dirname(_evtPath)) === 'modals'
          ? 'modal'
          : undefined
    }

    return { options, callback: event.callback }
  } else {
    return evt
  }
}

export const resolveMessageCommand = (
  cmd: HarmonixCommandInput,
  harmonixOptions: Harmonix['options']
): HarmonixCommand => {
  if (typeof cmd === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _cmdPath = _jiti.resolve(cmd)
    const command = _jiti(_cmdPath) as HarmonixCommand
    const options: CommandOptions = {
      name: command.options.name || filename(_cmdPath).split('.')[0],
      category: command.options.category || filename(dirname(_cmdPath)),
      slash: command.options.slash || filename(_cmdPath).endsWith('.slash'),
      ...command.options
    }

    return { options, execute: command.execute }
  } else {
    return cmd
  }
}

export const resolveContextMenu = (
  ctm: HarmonixContextMenuInput,
  harmonixOptions: Harmonix['options']
): HarmonixContextMenu => {
  if (typeof ctm === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _ctmPath = _jiti.resolve(ctm)
    const contextMenu = _jiti(_ctmPath) as HarmonixContextMenu
    const options: ContextMenuOptions = {
      name: contextMenu.options.name || filename(_ctmPath).split('.')[0],
      type: contextMenu.options.type || 'message',
      ...contextMenu.options
    }

    return { options, callback: contextMenu.callback }
  } else {
    return ctm
  }
}

export const resolvePrecondition = (
  prc: HarmonixPreconditionInput,
  harmonixOptions: Harmonix['options']
) => {
  if (typeof prc === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _prcPath = _jiti.resolve(prc)
    const precondition = _jiti(_prcPath) as HarmonixPrecondition
    const options: PreconditionOptions = {
      name: precondition.options.name || filename(_prcPath).split('.')[0]
    }

    return { options, callback: precondition.callback }
  } else {
    return prc
  }
}
