import {
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  ModalBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder
} from 'discord.js'
import { createError, useHarmonix } from './harmonix'
import { defineActionRow } from './define'
import type {
  ChannelSelectMenuConfig,
  MentionableSelectMenuConfig,
  RoleSelectMenuConfig,
  StringSelectMenuConfig,
  UserSelectMenuConfig
} from './types'

export const getButton = (id: string) => {
  const harmonix = useHarmonix()
  const button = harmonix.buttons.get(id)

  if (!button) return null
  const builder = new ButtonBuilder()
    .setCustomId(button.config.id!)
    .setLabel(button.config.label)
    .setStyle(
      button.config.style
        ? ButtonStyle[button.config.style]
        : ButtonStyle.Primary
    )

  if (button.config.emoji) {
    builder.setEmoji(button.config.emoji)
  }
  if (button.config.url) {
    builder.setURL(button.config.url)
  }
  if (button.config.disabled) {
    builder.setDisabled(button.config.disabled)
  }

  return builder
}

export const getModal = (id: string) => {
  const harmonix = useHarmonix()
  const modal = harmonix.modals.get(id)

  if (!modal) return null
  const builder = new ModalBuilder()
    .setCustomId(modal.config.id!)
    .setTitle(modal.config.title)

  if (modal.config.textInputs) {
    for (const input of modal.config.textInputs) {
      const inputBuilder = new TextInputBuilder()
        .setCustomId(input.id)
        .setLabel(input.label)
        .setStyle(
          input.style ? TextInputStyle[input.style] : TextInputStyle.Short
        )

      if (input.minLength) {
        inputBuilder.setMinLength(input.minLength)
      }
      if (input.maxLength) {
        inputBuilder.setMaxLength(input.maxLength)
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
      builder.addComponents(defineActionRow(inputBuilder))
    }
  }

  return builder
}

export const getSelectMenu = (id: string) => {
  const harmonix = useHarmonix()
  const selectMenu = harmonix.selectMenus.get(id)

  if (!selectMenu) return null
  const { placeholder, type, disabled, minValues, maxValues } =
    selectMenu.config

  switch (type) {
    case 'String': {
      const config = selectMenu.config as StringSelectMenuConfig
      const builder = new StringSelectMenuBuilder()
        .setCustomId(selectMenu.config.id!)
        .setPlaceholder(placeholder)

      if (disabled) {
        builder.setDisabled(disabled)
      }
      if (minValues) {
        builder.setMinValues(minValues)
      }
      if (maxValues) {
        builder.setMaxValues(maxValues)
      }
      config.options.forEach((option) => {
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

        builder.addOptions(optionBuilder)
      })

      return builder
    }
    case 'User': {
      const config = selectMenu.config as UserSelectMenuConfig
      const builder = new UserSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        builder.setDisabled(disabled)
      }
      if (minValues) {
        builder.setMinValues(minValues)
      }
      if (maxValues) {
        builder.setMaxValues(maxValues)
      }
      if (config.defaultUsers) {
        builder.setDefaultUsers(config.defaultUsers)
      }

      return builder
    }
    case 'Channel': {
      const config = selectMenu.config as ChannelSelectMenuConfig
      const builder = new ChannelSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        builder.setDisabled(disabled)
      }
      if (minValues) {
        builder.setMinValues(minValues)
      }
      if (maxValues) {
        builder.setMaxValues(maxValues)
      }
      if (config.channelTypes) {
        builder.addChannelTypes(...config.channelTypes)
      }
      if (config.defaultChannels) {
        builder.setDefaultChannels(config.defaultChannels)
      }

      return builder
    }
    case 'Role': {
      const config = selectMenu.config as RoleSelectMenuConfig
      const builder = new RoleSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        builder.setDisabled(disabled)
      }
      if (minValues) {
        builder.setMinValues(minValues)
      }
      if (maxValues) {
        builder.setMaxValues(maxValues)
      }
      if (config.defaultRoles) {
        builder.setDefaultRoles(config.defaultRoles)
      }

      return builder
    }
    case 'Mentionable': {
      const config = selectMenu.config as MentionableSelectMenuConfig
      const builder = new MentionableSelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(placeholder)

      if (disabled) {
        builder.setDisabled(disabled)
      }
      if (minValues) {
        builder.setMinValues(minValues)
      }
      if (maxValues) {
        builder.setMaxValues(maxValues)
      }
      if (config.defaultValues) {
        builder.setDefaultValues(config.defaultValues)
      }

      return builder
    }
    default:
      throw createError('Invalid select menu type')
  }
}
