import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type User
} from 'discord.js'
import type {
  HarmonixCommand,
  HarmonixContextMenu,
  MessageOrInteraction,
  ArgsDef,
  ArgType
} from './types'

export const slashToJSON = (cmd: HarmonixCommand<true, ArgsDef>) => {
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
    for (const name in cmd.options.args) {
      const arg = cmd.options.args[name]

      switch (arg.type) {
        case 'String':
          builder.addStringOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required || true)

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
              .setRequired(arg.required || true)

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
              .setRequired(arg.required || true)
          )
          break
        case 'User':
          builder.addUserOption((opt) =>
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required || true)
          )
          break
        case 'Channel':
          builder.addChannelOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required || true)

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
              .setRequired(arg.required || true)
          )
          break
        case 'Number':
          builder.addNumberOption((opt) => {
            opt
              .setName(name)
              .setDescription(arg.description ?? 'No description provided')
              .setRequired(arg.required || true)

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
  command: HarmonixCommand<true, ArgsDef> | HarmonixContextMenu
): command is HarmonixCommand<true, ArgsDef> => {
  return (command as HarmonixCommand<true, ArgsDef>).options.slash !== undefined
}

export const resolveArgument = async (
  entity: MessageOrInteraction,
  type: ArgType | null,
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
      const user = await resolveUser(entity, value)

      return user
    case 'Channel':
      const channel = await resolveChannel(entity, value)

      return channel
    case 'Role':
      const role = await resolveRole(entity, value)

      return role
    case 'Number':
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
