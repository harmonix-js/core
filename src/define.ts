import {
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder
} from 'discord.js'
import type {
  CommandArg,
  CommandExecute,
  CommandOptions,
  ContextMenuCallback,
  ContextMenuOptions,
  DefineContextMenu,
  DefineContextMenuWithOptions,
  DefineEvent,
  DefineEventWithOptions,
  DefinePrecondition,
  EventCallback,
  EventOptions,
  HarmonixCommand,
  HarmonixCommandArgType,
  HarmonixConfig,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixEvents,
  ModalOptions,
  PreconditionCallback
} from './types'

export const defineHarmonixConfig = (config: HarmonixConfig) => {
  return config
}

export const defineEvent: DefineEvent & DefineEventWithOptions = <
  Event extends keyof HarmonixEvents = any
>(
  ...args: [EventOptions | EventCallback<Event>, EventCallback<Event>?]
): HarmonixEvent => {
  let options: EventOptions = {}

  if (args.length === 1) {
    const [callback] = args as [EventCallback<keyof HarmonixEvents>]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [
      EventOptions,
      EventCallback<keyof HarmonixEvents>
    ]

    options = opts
    return {
      options,
      callback
    }
  }
}

export const defineCommand = <
  Slash extends boolean,
  Args extends CommandArg[] = CommandArg[]
>(
  options: CommandOptions<Slash> & { slash?: Slash; args?: Args },
  execute: CommandExecute<Slash, Args>
): HarmonixCommand<Slash, Args> => {
  return { options, execute }
}

export const defineContextMenu: DefineContextMenu &
  DefineContextMenuWithOptions = <Type extends 'message' | 'user'>(
  ...args: [
    ContextMenuOptions | ContextMenuCallback<Type>,
    ContextMenuCallback<Type>?
  ]
): HarmonixContextMenu => {
  let options: ContextMenuOptions = {}

  if (args.length === 1) {
    const [callback] = args as [ContextMenuCallback<Type>]

    return {
      options,
      callback
    }
  } else {
    const [opts, callback] = args as [
      ContextMenuOptions,
      ContextMenuCallback<Type>
    ]

    options = opts
    return {
      options,
      callback
    }
  }
}

export const defineModal = (options: ModalOptions): ModalBuilder => {
  const builder = new ModalBuilder()
    .setCustomId(options.id)
    .setTitle(options.title)

  if (options.textInputs) {
    for (const input of options.textInputs) {
      const inputBuilder = new TextInputBuilder()
        .setCustomId(input.id)
        .setLabel(input.label)
        .setStyle(input.style)

      if (input.maxLength) {
        inputBuilder.setMaxLength(input.maxLength)
      }
      if (input.minLength) {
        inputBuilder.setMinLength(input.minLength)
      }
      if (input.placeholder) {
        inputBuilder.setPlaceholder(input.placeholder)
      }
      if (input.value) {
        inputBuilder.setValue(input.value)
      }
      if (input.required) {
        inputBuilder.setRequired(input.required)
      }
      const row =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          inputBuilder
        )

      builder.addComponents(row)
    }
  }

  return builder
}

export const definePrecondition: DefinePrecondition = (
  callback: PreconditionCallback
) => {
  return { options: {}, callback }
}

export const defineArgument = <
  Type extends keyof HarmonixCommandArgType
>(options: {
  type: Type
  name: string
  description: string
  required?: boolean
}) => {
  return {
    type: options.type,
    name: options.name,
    description: options.description,
    required: options.required ?? true
  } as CommandArg
}
