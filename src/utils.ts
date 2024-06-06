import {
  ApplicationCommandType,
  type ChatInputCommandInteraction,
  type Collection,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextBasedChannel,
  parseEmoji
} from 'discord.js'
import type {
  HarmonixCommand,
  HarmonixContextMenu,
  OptionType,
  OptionsDef,
  ParsedOptionType
} from './types'

const commandToJSON = (cmd: HarmonixCommand) => {
  const builder = new SlashCommandBuilder()
    .setName(cmd.config.name!)
    .setDescription(cmd.config.description ?? 'No description provided')
    .setDefaultMemberPermissions(
      cmd.config.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )
    .setNSFW(cmd.config.nsfw ?? false)
    .setDMPermission(cmd.config.dm ?? false)

  if (cmd.config.options) {
    for (const name in cmd.config.options) {
      const arg = cmd.config.options[name]

      switch (arg.type) {
        case 'String':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minLength) {
              opt.setMinLength(arg.minLength)
            }
            if (arg.maxLength) {
              opt.setMaxLength(arg.maxLength)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Integer':
          builder.addIntegerOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minValue) {
              opt.setMinValue(arg.minValue)
            }
            if (arg.maxValue) {
              opt.setMaxValue(arg.maxValue)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Boolean':
          builder.addBooleanOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
          )
          break
        case 'User':
          builder.addUserOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
          )
          break
        case 'Channel':
          builder.addChannelOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)

            if (arg.types) {
              opt.addChannelTypes(...arg.types)
            }

            return opt
          })
          break
        case 'Role':
          builder.addRoleOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
          )
          break
        case 'Number':
          builder.addNumberOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minValue) {
              opt.setMinValue(arg.minValue)
            }
            if (arg.maxValue) {
              opt.setMaxValue(arg.maxValue)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Mentionable':
          builder.addMentionableOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
          )
          break
        case 'Attachment':
          builder.addAttachmentOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
          )
          break
        case 'SubCommand':
          builder.addSubcommand((sub) => {
            sub
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')

            return sub
          })
          break
        case 'Message':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minLength) {
              opt.setMinLength(arg.minLength)
            }
            if (arg.maxLength) {
              opt.setMaxLength(arg.maxLength)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Emoji':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minLength) {
              opt.setMinLength(arg.minLength)
            }
            if (arg.maxLength) {
              opt.setMaxLength(arg.maxLength)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Date':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minLength) {
              opt.setMinLength(arg.minLength)
            }
            if (arg.maxLength) {
              opt.setMaxLength(arg.maxLength)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
        case 'Url':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required ?? true)
              .setAutocomplete(arg.autocomplete ?? false)

            if (arg.minLength) {
              opt.setMinLength(arg.minLength)
            }
            if (arg.maxLength) {
              opt.setMaxLength(arg.maxLength)
            }
            if (arg.choices) {
              opt.addChoices(...arg.choices)
            }

            return opt
          })
          break
      }
    }
  }

  return builder.toJSON()
}

const contextMenuToJSON = (ctm: HarmonixContextMenu) => {
  const builder = new ContextMenuCommandBuilder()
    .setName(ctm.config.name!)
    .setType(
      ctm.config.type === 'Message'
        ? ApplicationCommandType.Message
        : ctm.config.type === 'User'
          ? ApplicationCommandType.User
          : ApplicationCommandType.Message
    )
    .setDefaultMemberPermissions(
      ctm.config.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )
    .setDMPermission(ctm.config.dm ?? false)

  return builder.toJSON()
}

const isHarmonixCommand = (
  command: HarmonixCommand<OptionsDef> | HarmonixContextMenu
): command is HarmonixCommand<OptionsDef> => {
  return 'execute' in command && 'config' in command
}

export const toJSON = (
  cmd: HarmonixCommand<OptionsDef> | HarmonixContextMenu
) => {
  return isHarmonixCommand(cmd) ? commandToJSON(cmd) : contextMenuToJSON(cmd)
}

const resolveMessage = async (
  interaction: ChatInputCommandInteraction,
  resolvable: string
) => {
  const match = resolvable.match(
    /^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?:\d{17,20}|@me)\/(?<channelId>\d{17,20})\/(?<messageId>\d{17,20})$/
  )

  if (match && match.groups) {
    const { channelId, messageId } = match.groups
    const channel = interaction.guild?.channels.cache.get(channelId) as
      | TextBasedChannel
      | undefined

    if (channel?.isTextBased()) {
      try {
        return await channel.messages.fetch(messageId)
      } catch {
        return null
      }
    }
    return null
  }
  const channels = interaction.guild?.channels.cache.filter((channel) =>
    channel.isTextBased()
  ) as Collection<string, TextBasedChannel> | undefined

  if (!channels) return null
  for (const [, channel] of channels) {
    try {
      return await channel.messages.fetch(resolvable)
    } catch {
      continue
    }
  }
  return null
}

const resolveEmoji = async (
  interaction: ChatInputCommandInteraction,
  resolvable: string
) => {
  const emoji = parseEmoji(resolvable)

  if (emoji?.id) {
    return interaction.client.emojis.cache.get(emoji.id) ?? emoji
  }
  if (emoji?.name?.match(/\p{Extended_Pictographic}/gu)) {
    return emoji
  }

  return resolvable.match(/^\d{17,20}$/)
    ? interaction.client.emojis.cache.get(resolvable) ?? null
    : null
}

const resolveDate = (resolvable: string) => {
  const date = new Date(resolvable)

  if (isNaN(date.getTime())) return null

  return date
}

const resolveUrl = (resolvable: string) => {
  try {
    const url = new URL(resolvable)

    return url
  } catch {
    return null
  }
}

export const resolveOption = async (
  interaction: ChatInputCommandInteraction,
  type: OptionType,
  name: string
): Promise<ParsedOptionType> => {
  switch (type) {
    case 'String':
      return interaction.options.getString(name)
    case 'Integer':
      return interaction.options.getInteger(name)
    case 'Boolean':
      return interaction.options.getBoolean(name)
    case 'User':
      return interaction.options.getUser(name)
    case 'Channel':
      return interaction.options.getChannel(name)
    case 'Role':
      return interaction.options.getRole(name)
    case 'Number':
      return interaction.options.getNumber(name)
    case 'Mentionable':
      return interaction.options.getMentionable(name)
    case 'Attachment':
      return interaction.options.getAttachment(name)
    case 'SubCommand':
      return interaction.options.getSubcommand() === name
    case 'Message': {
      const string = interaction.options.getString(name)

      if (!string) return null
      const message = await resolveMessage(interaction, string)

      return message
    }
    case 'Emoji': {
      const string = interaction.options.getString(name)

      if (!string) return null
      const emoji = await resolveEmoji(interaction, string)

      return emoji
    }
    case 'Date': {
      const string = interaction.options.getString(name)

      if (!string) return null
      return resolveDate(string)
    }
    case 'Url': {
      const string = interaction.options.getString(name)

      if (!string) return null
      return resolveUrl(string)
    }
    default:
      return null
  }
}
