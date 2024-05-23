import createJiti from 'jiti'
import { resolve } from 'pathe'
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
import consola from 'consola'

export const resolveEvent = (
  evt: HarmonixEventInput,
  harmonixOptions: Harmonix['options']
): HarmonixEvent => {
  if (typeof evt === 'string') {
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _evtPath = jiti.resolve(evt)
    const event = jiti(_evtPath) as HarmonixEvent

    if (!event.options || !event.callback) {
      consola.warn(`Event ${filename(_evtPath)} does not export a valid event.`)
      return { options: { name: filename(_evtPath) }, callback: () => {} }
    }
    const matchSuffix = filename(_evtPath).match(/\.(on|once)?$/)
    const once =
      event.options.once ?? (matchSuffix ? matchSuffix[1] === 'once' : false)
    const options: EventOptions = {
      name:
        event.options.name || filename(_evtPath).replace(/\.(on|once)?$/, ''),
      once: event.options.once || once
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _cmdPath = jiti.resolve(cmd)
    const command = jiti(_cmdPath) as HarmonixCommand

    if (!command.config || !command.execute) {
      consola.warn(
        `Command ${filename(_cmdPath)} does not export a valid command.`
      )
      return { config: { name: filename(_cmdPath) }, execute: () => {} }
    }
    const relativePath = resolve(_cmdPath).replace(harmonixOptions.rootDir, '')
    const categoryMatch = relativePath.match(
      /\/commands\/(.+?)\/[^\/]+\.(ts|js)/
    )
    const category = categoryMatch ? categoryMatch[1] : undefined
    const config: CommandConfig = {
      name: command.config.name || filename(_cmdPath),
      category: command.config.category ?? category,
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _ctmPath = jiti.resolve(ctm)
    const contextMenu = jiti(_ctmPath) as HarmonixContextMenu

    if (!contextMenu.config || !contextMenu.callback) {
      consola.warn(
        `Context Menu ${filename(_ctmPath)} does not export a valid context menu.`
      )
      return { config: { name: filename(_ctmPath) }, callback: () => {} }
    }
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _btnPath = jiti.resolve(btn)
    const button = jiti(_btnPath) as HarmonixButton

    if (!button.config || !button.callback) {
      consola.warn(
        `Button ${filename(_btnPath)} does not export a valid button.`
      )
      return {
        config: { id: filename(_btnPath), label: '' },
        callback: () => {}
      }
    }
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _mdlPath = jiti.resolve(mdl)
    const modal = jiti(_mdlPath) as HarmonixModal

    if (!modal.config || !modal.callback) {
      consola.warn(`Modal ${filename(_mdlPath)} does not export a valid modal.`)
      return {
        config: { id: filename(_mdlPath), title: '' },
        callback: () => {}
      }
    }
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _slmPath = jiti.resolve(slm)
    const selectMenu = jiti(_slmPath) as HarmonixSelectMenu

    if (!selectMenu.config || !selectMenu.callback) {
      consola.warn(
        `Select Menu ${filename(_slmPath)} does not export a valid select menu.`
      )
      return {
        config: {
          id: filename(_slmPath),
          placeholder: '',
          type: 'String',
          options: []
        },
        callback: () => {}
      }
    }
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
    const jiti = createJiti(harmonixOptions.rootDir, {
      cache: false,
      interopDefault: true,
      requireCache: false,
      esmResolve: true
    })
    const _prcPath = jiti.resolve(prc)
    const precondition = jiti(_prcPath) as HarmonixPrecondition

    if (!precondition.callback) {
      consola.warn(
        `Precondition ${filename(_prcPath)} does not export a valid precondition.`
      )
      return { name: filename(_prcPath), callback: () => {} }
    }
    const name = precondition.name || filename(_prcPath)

    return { name, callback: precondition.callback }
  } else {
    return prc
  }
}
