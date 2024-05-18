import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  type BufferResolvable,
  ButtonBuilder,
  ButtonStyle,
  type AnyComponentBuilder,
  type RestOrArray,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MentionableSelectMenuBuilder
} from 'discord.js'
import type { Stream } from 'node:stream'
import type {
  ButtonOptions,
  ChannelSelectMenuOptions,
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
  MentionableSelectMenuOptions,
  ModalOptions,
  OptionsDef,
  PreconditionCallback,
  RoleSelectMenuOptions,
  SelectMenuOptions,
  StringSelectMenuOptions,
  UserSelectMenuOptions
} from './types'
import { createError } from './harmonix'

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

export const defineActionRow = <
  T extends AnyComponentBuilder = AnyComponentBuilder
>(
  ...components: RestOrArray<T>
): ActionRowBuilder<T> => {
  const builder = new ActionRowBuilder<T>().addComponents(...components)

  return builder
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
      const row = defineActionRow(inputBuilder)

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

export const defineButton = (options: ButtonOptions) => {
  const builder = new ButtonBuilder()
    .setCustomId(options.id)
    .setStyle(options.style ? ButtonStyle[options.style] : ButtonStyle.Primary)

  if (options.label) {
    builder.setLabel(options.label)
  }
  if (options.emoji) {
    builder.setEmoji(options.emoji)
  }
  if (options.url) {
    builder.setURL(options.url)
  }
  if (options.disabled) {
    builder.setDisabled(options.disabled)
  }

  return builder
}

export const defineSelectMenu = (options: SelectMenuOptions) => {
  const { id, placeholder, type, disabled, minValues, maxValues } = options

  switch (type) {
    case 'String': {
      const stringOptions = options as StringSelectMenuOptions
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        selectMenu.setDisabled(disabled)
      }
      if (minValues) {
        selectMenu.setMinValues(minValues)
      }
      if (maxValues) {
        selectMenu.setMaxValues(maxValues)
      }
      stringOptions.options.forEach((option) => {
        const optionBuilder = new StringSelectMenuOptionBuilder()
          .setLabel(option.label)
          .setValue(option.value)

        if (option.description) {
          optionBuilder.setDescription(option.description)
        }
        if (option.emoji) {
          optionBuilder.setEmoji(option.emoji)
        }
        if (option.default) {
          optionBuilder.setDefault(true)
        }

        selectMenu.addOptions(optionBuilder)
      })

      return selectMenu
    }
    case 'User': {
      const userOptions = options as UserSelectMenuOptions
      const selectMenu = new UserSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        selectMenu.setDisabled(disabled)
      }
      if (minValues) {
        selectMenu.setMinValues(minValues)
      }
      if (maxValues) {
        selectMenu.setMaxValues(maxValues)
      }
      if (userOptions.defaultUsers) {
        selectMenu.setDefaultUsers(userOptions.defaultUsers)
      }

      return selectMenu
    }
    case 'Channel': {
      const channelOptions = options as ChannelSelectMenuOptions
      const selectMenu = new ChannelSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        selectMenu.setDisabled(disabled)
      }
      if (minValues) {
        selectMenu.setMinValues(minValues)
      }
      if (maxValues) {
        selectMenu.setMaxValues(maxValues)
      }
      if (channelOptions.channelTypes) {
        selectMenu.addChannelTypes(...channelOptions.channelTypes)
      }
      if (channelOptions.defaultChannels) {
        selectMenu.setDefaultChannels(channelOptions.defaultChannels)
      }

      return selectMenu
    }
    case 'Role': {
      const roleOptions = options as RoleSelectMenuOptions
      const selectMenu = new RoleSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        selectMenu.setDisabled(disabled)
      }
      if (minValues) {
        selectMenu.setMinValues(minValues)
      }
      if (maxValues) {
        selectMenu.setMaxValues(maxValues)
      }
      if (roleOptions.defaultRoles) {
        selectMenu.setDefaultRoles(roleOptions.defaultRoles)
      }

      return selectMenu
    }
    case 'Mentionable': {
      const mentionableOptions = options as MentionableSelectMenuOptions
      const selectMenu = new MentionableSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        selectMenu.setDisabled(disabled)
      }
      if (minValues) {
        selectMenu.setMinValues(minValues)
      }
      if (maxValues) {
        selectMenu.setMaxValues(maxValues)
      }
      if (mentionableOptions.defaultValues) {
        selectMenu.setDefaultValues(mentionableOptions.defaultValues)
      }

      return selectMenu
    }
    default:
      throw createError('Invalid select menu type')
  }
}
