import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type User
} from 'discord.js'
import {
  type CommandArg,
  CommandArgType,
  type HarmonixCommand,
  type HarmonixContextMenu,
  type MessageOrInteraction
} from './types'

export const slashToJSON = (cmd: HarmonixCommand<true, CommandArg[]>) => {
  const builder = new SlashCommandBuilder()
    .setName(cmd.options.name!)
    .setDescription(cmd.options.description || 'No description provided')
    .setDefaultMemberPermissions(
      cmd.options.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )
    .setNSFW(cmd.options.nsfw || false)

  if (cmd.options.args) {
    for (const arg of cmd.options.args) {
      switch (arg.type) {
        case CommandArgType.String:
          builder.addStringOption((opt) => {
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)

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
        case CommandArgType.Integer:
          builder.addIntegerOption((opt) => {
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)

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
        case CommandArgType.Boolean:
          builder.addBooleanOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.User:
          builder.addUserOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Channel:
          builder.addChannelOption((opt) => {
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)

            if (arg.metadata?.channelTypes) {
              for (const type of arg.metadata.channelTypes) {
                opt.addChannelTypes(type)
              }
            }

            return opt
          })
          break
        case CommandArgType.Role:
          builder.addRoleOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Number:
          builder.addNumberOption((opt) => {
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)

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
    .setName(ctm.options.name!)
    .setType(
      ctm.options.type === 'message'
        ? ApplicationCommandType.Message
        : ctm.options.type === 'user'
          ? ApplicationCommandType.User
          : ApplicationCommandType.Message
    )
    .setDefaultMemberPermissions(
      ctm.options.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )

  return builder.toJSON()
}

export const isHarmonixCommand = (
  command: HarmonixCommand<true, CommandArg[]> | HarmonixContextMenu
): command is HarmonixCommand<true, CommandArg[]> => {
  return (
    (command as HarmonixCommand<true, CommandArg[]>).options.slash !== undefined
  )
}

export const resolveArgument = async (
  entity: MessageOrInteraction,
  type: CommandArgType | null,
  value: string
) => {
  switch (type) {
    case CommandArgType.String:
      return value
    case CommandArgType.Integer:
      return parseInt(value)
    case CommandArgType.Boolean:
      return value === 'true'
    case CommandArgType.User:
      const user = await resolveUser(entity, value)

      return user
    case CommandArgType.Channel:
      const channel = await resolveChannel(entity, value)

      return channel
    case CommandArgType.Role:
      const role = await resolveRole(entity, value)

      return role
    case CommandArgType.Number:
      return parseFloat(value)
  }
}

const resolveUser = async (
  entity: MessageOrInteraction,
  value: string
): Promise<User | undefined> => {
  return entity.guild?.members.cache.find(
    (member) =>
      member.user.username === value ||
      member.nickname === value ||
      member.id === value ||
      value == `<@${member.id}>` ||
      value == `<@!${member.id}>`
  )?.user
}

const resolveChannel = async (entity: MessageOrInteraction, value: string) => {
  return entity.guild?.channels.cache.find(
    (channel) =>
      channel.name === value ||
      channel.id === value ||
      value == `<#${channel.id}>`
  )
}

const resolveRole = async (entity: MessageOrInteraction, value: string) => {
  return entity.guild?.roles.cache.find(
    (role) =>
      role.name === value || role.id === value || value == `<@&${role.id}>`
  )
}

export const optionToArg = (type: ApplicationCommandOptionType | null) => {
  switch (type) {
    case ApplicationCommandOptionType.String:
      return CommandArgType.String
    case ApplicationCommandOptionType.Integer:
      return CommandArgType.Integer
    case ApplicationCommandOptionType.Boolean:
      return CommandArgType.Boolean
    case ApplicationCommandOptionType.User:
      return CommandArgType.User
    case ApplicationCommandOptionType.Channel:
      return CommandArgType.Channel
    case ApplicationCommandOptionType.Role:
      return CommandArgType.Role
    case ApplicationCommandOptionType.Number:
      return CommandArgType.Number
    default:
      return null
  }
}
