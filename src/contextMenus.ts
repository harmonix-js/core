import jiti from 'jiti'
import type {
  ContextMenuCallback,
  ContextMenuOptions,
  DefineContextMenu,
  DefineContextMenuWithOptions,
  Harmonix,
  HarmonixContextMenu,
  HarmonixContextMenuInput
} from './types'
import { filename } from 'pathe/utils'

export const resolveHarmonixContextMenu = (
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
      type: contextMenu.options.type || 'message'
    }

    return { options, callback: contextMenu.callback }
  } else {
    return ctm
  }
}

export const defineContextMenu: DefineContextMenu &
  DefineContextMenuWithOptions = (
  ...args: [ContextMenuOptions | ContextMenuCallback, ContextMenuCallback?]
): HarmonixContextMenu => {
  let options: ContextMenuOptions = {}

  if (args.length === 1) {
    const [callback] = args as [ContextMenuCallback]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [ContextMenuOptions, ContextMenuCallback]

    options = opts
    return {
      options,
      callback
    }
  }
}
