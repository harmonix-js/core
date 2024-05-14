import {
  Client,
  REST,
  Routes,
  Events,
  type User,
  ApplicationCommandOptionType
} from 'discord.js'
import consola from 'consola'
import {
  type CommandArg,
  CommandArgType,
  type Harmonix,
  type HarmonixCommand,
  type HarmonixEvent,
  type MessageOrInteraction,
  type HarmonixContextMenu,
  type HarmonixPrecondition
} from './types'
import 'dotenv/config'
import { slashToJSON, contextMenuToJSON } from './commands'
import { createError } from './harmonix'
import { colors } from 'consola/utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client({ intents: harmonixOptions.intents })

  client.login(process.env.HARMONIX_CLIENT_TOKEN)

  return client
}

export const refreshApplicationCommands = async (
  harmonix: Harmonix,
  commands: (HarmonixCommand<true, CommandArg[]> | HarmonixContextMenu)[]
) => {
  const rest = new REST().setToken(process.env.HARMONIX_CLIENT_TOKEN!)

  try {
    consola.info('Started refreshing application commands.')
    await rest.put(
      Routes.applicationCommands(
        harmonix.options.clientId || process.env.HARMONIX_CLIENT_ID || ''
      ),
      {
        body: commands.map((cmd) =>
          isHarmonixCommand(cmd) ? slashToJSON(cmd) : contextMenuToJSON(cmd)
        )
      }
    )
    consola.success('Successfully reloaded application commands.\n')
  } catch {
    createError('Failed to reload application commands.\n')
  }
}

export const registerEvents = (harmonix: Harmonix, events: HarmonixEvent[]) => {
  for (const event of events.filter((evt) => !evt.options.type)) {
    if (event.options.once) {
      harmonix.client?.once(event.options.name!, event.callback)
    } else {
      harmonix.client?.on(event.options.name!, event.callback)
    }
  }

  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isModalSubmit()) return
    const event = events
      .filter((evt) => evt.options.type === 'modal')
      .find((evt) => evt.options.name === interaction.customId)

    if (!event) return
    event.callback(interaction)
  })
}

export const registerCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<false, CommandArg[]>[]
) => {
  harmonix.client?.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    const prefix = harmonix.options.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.find((cmd) => cmd.options.name === command)

    if (!cmd || cmd.options.slash) return
    const resolvedArgs = await Promise.all(
      (cmd?.options.args || []).map(async (arg, i) => [
        arg.name,
        await resolveArgument(message, arg.type, args[i])
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    if (cmd.options.preconditions) {
      for (const prc of cmd.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'message',
          message
        })

        if (!result) return
      }
    }
    cmd.execute(harmonix.client!, message, { slash: false, args: fullArgs })
  })
}

export const registerSlashCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<true, CommandArg[]>[]
) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.find(
      (cmd) => cmd.options.name === interaction.commandName
    )

    if (!cmd || !cmd.options.slash) return
    const resolvedArgs = await Promise.all(
      interaction.options.data.map(async (opt) => [
        opt.name,
        await resolveArgument(
          interaction,
          commandArgType(opt.type),
          String(opt.value)
        )
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    if (cmd.options.preconditions) {
      for (const prc of cmd.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'slash',
          interaction
        })

        if (!result) return
      }
    }
    cmd.execute(harmonix.client!, interaction, {
      slash: false,
      args: fullArgs
    })
  })
}

export const registerContextMenu = (
  harmonix: Harmonix,
  contextMenus: HarmonixContextMenu[]
) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isContextMenuCommand()) return
    const ctm = contextMenus.find(
      (ctm) => ctm.options.name === interaction.commandName
    )

    if (!ctm) return
    if (ctm.options.preconditions) {
      for (const prc of ctm.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'context-menu',
          interaction
        })

        if (!result) return
      }
    }
    ctm.callback(interaction)
  })
}

export const registerPreconditions = (
  harmonix: Harmonix,
  preconditions: HarmonixPrecondition[]
) => {
  for (const prc of preconditions) {
    harmonix.preconditions.set(prc.options.name!, prc)
  }
}

const isHarmonixCommand = (
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

const commandArgType = (type: ApplicationCommandOptionType | null) => {
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
