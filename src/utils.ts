import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js'
import type {
  HarmonixCommand,
  HarmonixContextMenu,
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
              .setAutocomplete(arg.autocomplete ?? false)

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
              .setAutocomplete(arg.autocomplete ?? false)

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

export const resolveOption = (
  interaction: ChatInputCommandInteraction,
  type: ApplicationCommandOptionType,
  name: string
): ParsedOptionType => {
  switch (type) {
    case ApplicationCommandOptionType.String:
      return interaction.options.getString(name)
    case ApplicationCommandOptionType.Integer:
      return interaction.options.getInteger(name)
    case ApplicationCommandOptionType.Boolean:
      return interaction.options.getBoolean(name)
    case ApplicationCommandOptionType.User:
      return interaction.options.getUser(name)
    case ApplicationCommandOptionType.Channel:
      return interaction.options.getChannel(name)
    case ApplicationCommandOptionType.Role:
      return interaction.options.getRole(name)
    case ApplicationCommandOptionType.Number:
      return interaction.options.getNumber(name)
    case ApplicationCommandOptionType.Mentionable:
      return interaction.options.getMentionable(name)
    case ApplicationCommandOptionType.Attachment:
      return interaction.options.getAttachment(name)
    default:
      return null
  }
}
