import {
  ActionRowBuilder,
  type AnyComponentBuilder,
  AttachmentBuilder,
  type BufferResolvable,
  EmbedBuilder,
  type RestOrArray,
  type ButtonBuilder,
  type ModalBuilder,
  type StringSelectMenuBuilder,
  type UserSelectMenuBuilder,
  type ChannelSelectMenuBuilder,
  type RoleSelectMenuBuilder,
  type MentionableSelectMenuBuilder
} from 'discord.js'
import { kebabCase, camelCase } from 'scule'
import type { Stream } from 'node:stream'
import { useHarmonix } from './harmonix'
import type { EmbedOptions } from './types'
import { getButton, getModal, getSelectMenu } from './getters'

export const useRuntimeEnv = (): Record<string, string | undefined> => {
  const harmonix = useHarmonix()
  const env = Object.entries(process.env).reduce(
    (acc, [key, value]) => {
      if (/^(HMX_)/.test(key) && value) {
        const _key = kebabCase(key.replace('HMX_', ''))

        acc[camelCase(_key)] = value
      }
      return acc
    },
    {} as Record<string, string | undefined>
  )

  return { ...harmonix.options.env, ...env }
}

export const useButtons = () => {
  const { components } = useHarmonix()

  return components.buttons.reduce(
    (acc, button) => {
      if (button.config.id) {
        acc[button.config.id] = getButton(button.config.id) ?? undefined
      }
      return acc
    },
    {} as Record<string, ButtonBuilder | undefined>
  )
}

export const useModals = () => {
  const { components } = useHarmonix()

  return components.modals.reduce(
    (acc, modal) => {
      if (modal.config.id) {
        acc[modal.config.id] = getModal(modal.config.id) ?? undefined
      }
      return acc
    },
    {} as Record<string, ModalBuilder | undefined>
  )
}

export const useSelectMenus = () => {
  const { components } = useHarmonix()

  return components.selectMenus.reduce(
    (acc, selectMenu) => {
      if (selectMenu.config.id) {
        acc[selectMenu.config.id] =
          getSelectMenu(selectMenu.config.id) ?? undefined
      }
      return acc
    },
    {} as Record<
      string,
      | StringSelectMenuBuilder
      | UserSelectMenuBuilder
      | ChannelSelectMenuBuilder
      | RoleSelectMenuBuilder
      | MentionableSelectMenuBuilder
      | undefined
    >
  )
}

export const useActionRow = <
  T extends AnyComponentBuilder = AnyComponentBuilder
>(
  ...components: RestOrArray<T | undefined>
): ActionRowBuilder<T> => {
  return new ActionRowBuilder<T>().addComponents(
    [...components].filter((c) => c) as T[]
  )
}

export const useEmbed = (options: EmbedOptions) => {
  const builder = new EmbedBuilder()

  if (options.color) {
    builder.setColor(options.color)
  }
  if (options.title) {
    builder.setTitle(options.title)
  }
  if (options.url) {
    builder.setURL(options.url)
  }
  if (options.author) {
    builder.setAuthor(options.author)
  }
  if (options.description) {
    builder.setDescription(options.description)
  }
  if (options.thumbnail) {
    builder.setThumbnail(options.thumbnail)
  }
  if (options.image) {
    builder.setImage(options.image)
  }
  if (options.timestamp) {
    builder.setTimestamp(
      options.timestamp === true ? new Date() : options.timestamp
    )
  }
  if (options.footer) {
    builder.setFooter(options.footer)
  }
  if (options.fields) {
    builder.addFields(...options.fields)
  }

  return builder
}

export const useAttachment = (args: BufferResolvable | Stream) => {
  return new AttachmentBuilder(args)
}
