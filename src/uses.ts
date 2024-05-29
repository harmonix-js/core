import {
  ActionRowBuilder,
  type AnyComponentBuilder,
  AttachmentBuilder,
  type BufferResolvable,
  EmbedBuilder,
  type RestOrArray
} from 'discord.js'
import type { Stream } from 'node:stream'
import type { EmbedOptions } from './types'

export const useActionRow = <
  T extends AnyComponentBuilder = AnyComponentBuilder
>(
  ...components: RestOrArray<T>
): ActionRowBuilder<T> => {
  const builder = new ActionRowBuilder<T>().addComponents(...components)

  return builder
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
