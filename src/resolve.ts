import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import type {
  ButtonConfig,
  CommandConfig,
  ContextMenuConfig,
  EventOptions,
  Harmonix,
  HarmonixButton,
  HarmonixButtonInput,
  HarmonixCommand,
  HarmonixCommandInput,
  HarmonixContextMenu,
  HarmonixContextMenuInput,
  HarmonixEvent,
  HarmonixEventInput,
  HarmonixModal,
  HarmonixModalInput,
  HarmonixPrecondition,
  HarmonixPreconditionInput,
  ModalConfig
} from './types'
import {
  HarmonixSelectMenu,
  HarmonixSelectMenuInput,
  SelectMenuConfig
} from './types/select-menus'

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
      once: event.options.once || filename(_evtPath).endsWith('.once')
    }

    return { options, callback: event.callback }
  } else {
    return evt
  }
}

export const resolveCommand = (
  cmd: HarmonixCommandInput,
  harmonixOptions: Harmonix['options']
): HarmonixCommand => {
  if (typeof cmd === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _cmdPath = _jiti.resolve(cmd)
    const command = _jiti(_cmdPath) as HarmonixCommand
    const config: CommandConfig = {
      name: command.config.name || filename(_cmdPath).split('.')[0],
      category: command.config.category || filename(dirname(_cmdPath)),
      ...command.config
    }

    return { config, execute: command.execute }
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
    const config: ContextMenuConfig = {
      name: contextMenu.config.name || filename(_ctmPath).split('.')[0],
      type: contextMenu.config.type || 'message',
      ...contextMenu.config
    }

    return { config, callback: contextMenu.callback }
  } else {
    return ctm
  }
}

export const resolveButton = (
  btn: HarmonixButtonInput,
  harmonixOptions: Harmonix['options']
): HarmonixButton => {
  if (typeof btn === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _btnPath = _jiti.resolve(btn)
    const button = _jiti(_btnPath) as HarmonixButton
    const config: ButtonConfig = {
      id: button.config.id || filename(_btnPath).split('.')[0],
      ...button.config
    }

    return { config, callback: button.callback }
  } else {
    return btn
  }
}

export const resolveModal = (
  mdl: HarmonixModalInput,
  harmonixOptions: Harmonix['options']
): HarmonixModal => {
  if (typeof mdl === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _mdlPath = _jiti.resolve(mdl)
    const modal = _jiti(_mdlPath) as HarmonixModal
    const config: ModalConfig = {
      id: modal.config.id || filename(_mdlPath).split('.')[0],
      ...modal.config
    }

    return { config, callback: modal.callback }
  } else {
    return mdl
  }
}

export const resolveSelectMenu = (
  slm: HarmonixSelectMenuInput,
  harmonixOptions: Harmonix['options']
): HarmonixSelectMenu => {
  if (typeof slm === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _slmPath = _jiti.resolve(slm)
    const selectMenu = _jiti(_slmPath) as HarmonixSelectMenu
    const config: SelectMenuConfig = {
      id: selectMenu.config.id || filename(_slmPath).split('.')[0],
      ...selectMenu.config
    }

    return { config, callback: selectMenu.callback }
  } else {
    return slm
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
    const name = precondition.name || filename(_prcPath).split('.')[0]

    return { name, callback: precondition.callback }
  } else {
    return prc
  }
}
