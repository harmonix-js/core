import {
  Client,
  REST,
  Routes,
  Events,
  type User,
  ApplicationCommandOptionType
} from 'discord.js'
import {
  type CommandArg,
  CommandArgType,
  type Harmonix,
  type HarmonixCommand,
  type HarmonixEvent,
  type MessageOrInteraction
} from './types'
import 'dotenv/config'
import { toJSON } from './commands'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client({ intents: harmonixOptions.intents })

  client.login(process.env.HARMONIX_CLIENT_TOKEN)

  return client
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
    const resolvedArgs = await Promise.all(
      (cmd?.options.args || []).map(async (arg, i) => [
        arg.name,
        await resolveArgument(message, arg.type, args[i])
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    if (!cmd || cmd.options.slash) return
    cmd.execute(harmonix.client!, message, { slash: false, args: fullArgs })
  })
}

export const registerSlashCommands = async (
  harmonix: Harmonix,
  commands: HarmonixCommand<true, CommandArg[]>[]
) => {
  if (commands.length === 0) return
  const rest = new REST().setToken(process.env.HARMONIX_CLIENT_TOKEN!)

  await rest.put(
    Routes.applicationCommands(
      harmonix.options.clientId || process.env.HARMONIX_CLIENT_ID!
    ),
    { body: commands.map((cmd) => toJSON(cmd)) }
  )
  harmonix.client?.on('interactionCreate', async (interaction) => {
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
          commandArgType(opt.type)!,
          String(opt.value)
        )
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    cmd.execute(harmonix.client!, interaction, {
      slash: true,
      args: fullArgs
    })
  })
}

export const registerEvents = (harmonix: Harmonix, events: HarmonixEvent[]) => {
  for (const event of events) {
    if (event.options.once) {
      harmonix.client?.once(event.options.name!, event.callback)
    } else {
      harmonix.client?.on(event.options.name!, event.callback)
    }
  }
}

export const resolveArgument = async (
  entity: MessageOrInteraction,
  type: CommandArgType,
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

const commandArgType = (type: ApplicationCommandOptionType) => {
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
  }
}
