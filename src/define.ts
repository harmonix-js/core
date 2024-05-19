import {
  ActionRowBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  type BufferResolvable,
  type AnyComponentBuilder,
  type RestOrArray,
  ClientEvents
} from 'discord.js'
import type { Stream } from 'node:stream'
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
  DefineModal,
  DefinePrecondition,
  DefinePreconditionWithName,
  DefineSelectMenu,
  EmbedOptions,
  EmbedSetters,
  EventCallback,
  EventOptions,
  HarmonixCommand,
  HarmonixConfig,
  HarmonixContextMenu,
  HarmonixEvent,
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

export const defineModal: DefineModal = (config, callback) => {
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

export const defineActionRow = <
  T extends AnyComponentBuilder = AnyComponentBuilder
>(
  ...components: RestOrArray<T>
): ActionRowBuilder<T> => {
  const builder = new ActionRowBuilder<T>().addComponents(...components)

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
