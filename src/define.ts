import { ClientEvents } from 'discord.js'
import type {
  CommandConfig,
  CommandExecute,
  ContextMenuCallback,
  ContextMenuConfig,
  ContextMenuType,
  DefineButton,
  DefineContextMenu,
  DefineEvent,
  DefinePrecondition,
  EventCallback,
  EventConfig,
  HarmonixCommand,
  HarmonixConfig,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixModal,
  HarmonixSelectMenu,
  ModalCallback,
  ModalConfig,
  ModalInputs,
  OptionsDef,
  PreconditionCallback,
  PreconditionType,
  SelectMenuCallback,
  SelectMenuConfig,
  SelectMenuType
} from './types'

export const defineHarmonixConfig = (config: HarmonixConfig) => {
  return config
}

export const defineEvent: DefineEvent = <
  Event extends keyof ClientEvents = any
>(
  ...args: [EventConfig | EventCallback<Event>, EventCallback<Event>?]
): HarmonixEvent => {
  let config: EventConfig = {}

  if (args.length === 1) {
    const [callback] = args as [EventCallback<keyof ClientEvents>]

    return {
      config,
      callback
    }
  } else {
    const [cfg, callback] = args as [
      EventConfig,
      EventCallback<keyof ClientEvents>
    ]

    config = cfg
    return {
      config,
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

export const defineContextMenu: DefineContextMenu = <
  T extends ContextMenuType = 'Message'
>(
  ...args: [
    (ContextMenuConfig & { type?: T }) | ContextMenuCallback<T>,
    ContextMenuCallback<T>?
  ]
): HarmonixContextMenu<T> => {
  let config: ContextMenuConfig<T> = {}

  if (args.length === 1) {
    const [callback] = args as [ContextMenuCallback<T>]

    return {
      config,
      callback
    }
  } else {
    const [cfg, callback] = args as [
      ContextMenuConfig<T>,
      ContextMenuCallback<T>
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

export const defineSelectMenu = <T extends SelectMenuType = SelectMenuType>(
  config: SelectMenuConfig & { type?: T },
  callback: SelectMenuCallback<T>
): HarmonixSelectMenu<T> => {
  return { config, callback }
}

export const definePrecondition: DefinePrecondition = <
  T extends PreconditionType = PreconditionType
>(
  ...args: [PreconditionCallback<T> | string, PreconditionCallback<T>?]
) => {
  let name = ''
  let callback: PreconditionCallback<T>

  if (args.length === 1) {
    const [cb] = args as [PreconditionCallback<T>]

    callback = cb
  } else {
    const [nm, cb] = args as [string, PreconditionCallback<T>]

    name = nm
    callback = cb
  }

  return { name, callback }
}
