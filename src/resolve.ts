import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import type {
  ButtonConfig,
  CommandConfig,
  ContextMenuConfig,
  ContextMenuType,
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
    const matchSuffix = filename(_evtPath).match(/\.(on|once)?$/)
    const type = event.options.type ?? (matchSuffix ? matchSuffix[1] : null)
    const options: EventOptions = {
      name:
        event.options.name || filename(_evtPath).replace(/\.(on|once)?$/, ''),
      once: event.options.once || type === 'once'
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
      name: command.config.name || filename(_cmdPath),
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
    const matchSuffix = filename(_ctmPath).match(/\.(user|message)?$/)
    const type =
      contextMenu.config.type ??
      (matchSuffix ? (matchSuffix[1] as ContextMenuType) : null)
    const name =
      contextMenu.config.name ??
      filename(_ctmPath).replace(/\.(user|message)?$/, '')
    const config: ContextMenuConfig = {
      name,
      type: type ?? 'Message',
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
      id: button.config.id || filename(_btnPath),
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
      id: modal.config.id || filename(_mdlPath),
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
      id: selectMenu.config.id || filename(_slmPath),
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
    const name = precondition.name || filename(_prcPath)

    return { name, callback: precondition.callback }
  } else {
    return prc
  }
}
