import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  channelMention,
  roleMention,
  userMention,
  type User
} from 'discord.js'
import type {
  HarmonixCommand,
  HarmonixContextMenu,
  OptionType,
  OptionsDef
} from './types'

export const slashToJSON = (cmd: HarmonixCommand<OptionsDef>) => {
  const builder = new SlashCommandBuilder()
    .setName(cmd.config.name!)
    .setDescription(cmd.config.description || 'No description provided')
    .setDefaultMemberPermissions(
      cmd.config.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )
    .setNSFW(cmd.config.nsfw || false)

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

            if (arg.metadata?.minLength) {
              opt.setMinLength(arg.metadata.minLength)
            }
            if (arg.metadata?.maxLength) {
              opt.setMaxLength(arg.metadata.maxLength)
            }
            if (arg.metadata?.autocomplete) {
              opt.setAutocomplete(arg.metadata.autocomplete)
            }
            if (arg.metadata?.choices) {
              opt.addChoices(arg.metadata.choices)
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

            if (arg.metadata?.minValue) {
              opt.setMinValue(arg.metadata.minValue)
            }
            if (arg.metadata?.maxValue) {
              opt.setMaxValue(arg.metadata.maxValue)
            }
            if (arg.metadata?.autocomplete) {
              opt.setAutocomplete(arg.metadata.autocomplete)
            }
            if (arg.metadata?.choices) {
              opt.addChoices(arg.metadata.choices)
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

            if (arg.metadata?.channelTypes) {
              for (const type of arg.metadata.channelTypes) {
                opt.addChannelTypes(type)
              }
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

            if (arg.metadata?.minValue) {
              opt.setMinValue(arg.metadata.minValue)
            }
            if (arg.metadata?.maxValue) {
              opt.setMaxValue(arg.metadata.maxValue)
            }
            if (arg.metadata?.autocomplete) {
              opt.setAutocomplete(arg.metadata.autocomplete)
            }
            if (arg.metadata?.choices) {
              opt.addChoices(arg.metadata.choices)
            }

            return opt
          })
          break
      }
    }
  }

  return builder.toJSON()
}

export const contextMenuToJSON = (ctm: HarmonixContextMenu) => {
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

  return builder.toJSON()
}

export const isHarmonixCommand = (
  command: HarmonixCommand<OptionsDef> | HarmonixContextMenu
): command is HarmonixCommand<OptionsDef> => {
  return (command as HarmonixCommand<OptionsDef>).config.category !== undefined
}

export const resolveOption = async (
  interaction: ChatInputCommandInteraction,
  type: OptionType | null,
  value: string
) => {
  switch (type) {
    case 'String':
      return value
    case 'Integer':
      return parseInt(value)
    case 'Boolean':
      return value === 'true'
    case 'User':
      const user = await resolveUser(interaction, value)

      return user
    case 'Channel':
      const channel = await resolveChannel(interaction, value)

      return channel
    case 'Role':
      const role = await resolveRole(interaction, value)

      return role
    case 'Number':
      return parseFloat(value)
  }
}

const resolveUser = async (
  interaction: ChatInputCommandInteraction,
  value: string
): Promise<User | undefined> => {
  return interaction.guild?.members.cache.find(
    (member) =>
      member.user.username === value ||
      member.nickname === value ||
      member.id === value ||
      userMention(member.id) === value ||
      `<@!${member.id}>` === value
  )?.user
}

const resolveChannel = async (
  interaction: ChatInputCommandInteraction,
  value: string
) => {
  return interaction.guild?.channels.cache.find(
    (channel) =>
      channel.name === value ||
      channel.id === value ||
      channelMention(channel.id) === value
  )
}

const resolveRole = async (
  interaction: ChatInputCommandInteraction,
  value: string
) => {
  return interaction.guild?.roles.cache.find(
    (role) =>
      role.name === value || role.id === value || roleMention(role.id) === value
  )
}

export const toOption = (type: ApplicationCommandOptionType | null) => {
  switch (type) {
    case ApplicationCommandOptionType.String:
      return 'String'
    case ApplicationCommandOptionType.Integer:
      return 'Integer'
    case ApplicationCommandOptionType.Boolean:
      return 'Boolean'
    case ApplicationCommandOptionType.User:
      return 'User'
    case ApplicationCommandOptionType.Channel:
      return 'Channel'
    case ApplicationCommandOptionType.Role:
      return 'Role'
    case ApplicationCommandOptionType.Number:
      return 'Number'
    default:
      return null
  }
}
