import { Client, REST, Routes, Events } from 'discord.js'
import type { Harmonix, HarmonixCommand, HarmonixEvent } from './types'
import 'dotenv/config'
import { toJSON } from './commands'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client({ intents: harmonixOptions.intents })

  client.login(process.env.HARMONIX_CLIENT_TOKEN)

  return client
}

export const registerCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<false>[]
) => {
  harmonix.client?.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return
    const prefix = harmonix.options.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.find((cmd) => cmd.options.name === command)

    const params = Object.fromEntries(
      cmd?.options.args?.map((arg, i) => [arg.name, args[i]]) || []
    )
    if (!cmd || cmd.options.slash) return
    cmd.execute(harmonix.client!, message, { slash: false, params: params })
  })
}

export const registerSlashCommands = async (
  harmonix: Harmonix,
  commands: HarmonixCommand<true>[]
) => {
	if (commands.length === 0) return
  const rest = new REST().setToken(process.env.HARMONIX_CLIENT_TOKEN || '')

  await rest.put(
    Routes.applicationCommands(
      harmonix.options.clientId || process.env.HARMONIX_CLIENT_ID || ''
    ),
    { body: commands.map((cmd) => toJSON(cmd)) }
  )
  harmonix.client?.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.find(
      (cmd) => cmd.options.name === interaction.commandName
    )

    if (!cmd || !cmd.options.slash) return
    cmd.execute(harmonix.client!, interaction, {
      slash: true,
      params: interaction.options
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
