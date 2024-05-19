import {
  ActionRowBuilder,
  type AnyComponentBuilder,
  AttachmentBuilder,
  type BufferResolvable,
  EmbedBuilder,
  type RestOrArray
} from 'discord.js'
import { Stream } from 'node:stream'
import { EmbedOptions, EmbedSetters } from './types'

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

export const useAttachment = (args: BufferResolvable | Stream) => {
  return new AttachmentBuilder(args)
}
