import { ClientEvents } from 'discord.js'
import type {
  CommandConfig,
  CommandExecute,
  ContextMenuCallback,
  ContextMenuConfig,
  DefineButton,
  DefineContextMenu,
  DefineContextMenuWithOptions,
  DefineEvent,
  DefineEventWithOptions,
  DefinePrecondition,
  DefinePreconditionWithName,
  DefineSelectMenu,
  EventCallback,
  EventOptions,
  HarmonixCommand,
  HarmonixConfig,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixModal,
  ModalCallback,
  ModalConfig,
  ModalInputs,
  OptionsDef,
  PreconditionCallback
} from './types'

export const defineHarmonixConfig = (config: HarmonixConfig) => {
  return config
}

export const defineEvent: DefineEvent & DefineEventWithOptions = <
  Event extends keyof ClientEvents = any
>(
  ...args: [EventOptions | EventCallback<Event>, EventCallback<Event>?]
): HarmonixEvent => {
  let options: EventOptions = {}

  if (args.length === 1) {
    const [callback] = args as [EventCallback<keyof ClientEvents>]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [
      EventOptions,
      EventCallback<keyof ClientEvents>
    ]

    options = opts
    return {
      options,
      callback
    }
  }
}

export const defineCommand = <T extends OptionsDef = OptionsDef>(
  config: CommandConfig & { options?: T },
  execute: CommandExecute<T>
): HarmonixCommand<T> => {
  return { config, execute }
}

export const defineContextMenu: DefineContextMenu &
  DefineContextMenuWithOptions = <Type extends 'message' | 'user'>(
  ...args: [
    ContextMenuConfig | ContextMenuCallback<Type>,
    ContextMenuCallback<Type>?
  ]
): HarmonixContextMenu => {
  let config: ContextMenuConfig = {}

  if (args.length === 1) {
    const [callback] = args as [ContextMenuCallback<Type>]

    return {
      config,
      callback
    }
  } else {
    const [cfg, callback] = args as [
      ContextMenuConfig,
      ContextMenuCallback<Type>
    ]

    config = cfg
    return {
      config,
      callback
    }
  }
}

export const defineButton: DefineButton = (config, callback) => {
  return { config, callback }
}

export const defineModal = <T extends ModalInputs = ModalInputs>(
  config: ModalConfig & { inputs?: T },
  callback: ModalCallback<T>
): HarmonixModal<T> => {
  return { config, callback }
}

export const defineSelectMenu: DefineSelectMenu = (config, callback) => {
  return { config, callback }
}

export const definePrecondition: DefinePrecondition &
  DefinePreconditionWithName = (
  ...args: [PreconditionCallback | string, PreconditionCallback?]
) => {
  let name = ''
  let callback: PreconditionCallback

  if (args.length === 1) {
    const [cb] = args as [PreconditionCallback]

    callback = cb
  } else {
    const [nm, cb] = args as [string, PreconditionCallback]

    name = nm
    callback = cb
  }

  return { name, callback }
}
