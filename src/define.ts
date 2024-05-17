import {
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  type BufferResolvable
} from 'discord.js'
import type { Stream } from 'node:stream'
import type {
  CommandConfig,
  CommandExecute,
  ContextMenuCallback,
  ContextMenuConfig,
  DefineContextMenu,
  DefineContextMenuWithOptions,
  DefineEvent,
  DefineEventWithOptions,
  DefinePrecondition,
  DefinePreconditionWithName,
  EmbedOptions,
  EmbedSetters,
  EventCallback,
  EventOptions,
  HarmonixCommand,
  HarmonixConfig,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixEvents,
  ModalOptions,
  OptionsDef,
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

export const defineEmbed = (options: EmbedOptions) => {
  const builder = new EmbedBuilder()
  const setters: EmbedSetters = {
    color: (value) => builder.setColor(value ?? null),
    title: (value) => builder.setTitle(value ?? null),
    url: (value) => builder.setURL(value ?? null),
    author: (value) => builder.setAuthor(value ?? null),
    description: (value) => builder.setDescription(value ?? null),
    thumbnail: (value) => builder.setThumbnail(value ?? null),
    image: (value) => builder.setImage(value ?? null),
    timestamp: () => builder.setTimestamp(),
    footer: (value) => builder.setFooter(value ?? null),
    fields: (value) => builder.addFields(...(value ?? []))
  }

  Object.entries(options).forEach(([key, value]) => {
    const _key = key as keyof EmbedOptions

    setters[_key]!(value)
  })

  return builder
}

export const defineAttachment = (args: BufferResolvable | Stream) => {
  return new AttachmentBuilder(args)
}
