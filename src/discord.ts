import { Client, REST, Routes, Events } from 'discord.js'
import type { Harmony, HarmonyCommand, HarmonyEvent } from './types'
import 'dotenv/config'
import { toJSON } from './commands'

export const initCient = (harmonyOptions: Harmony['options']) => {
  const client = new Client({ intents: harmonyOptions.intents })

  client.login(process.env.HARMONY_TOKEN)

  return client
}

export const registerCommands = (
  harmony: Harmony,
  commands: HarmonyCommand<false>[]
) => {
  harmony.client?.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return
    const prefix = harmony.options.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.find((cmd) => cmd.options.name === command)

    const params = Object.fromEntries(
      cmd?.options.args?.map((arg, i) => [arg.name, args[i]]) || []
    )
    if (!cmd || cmd.options.slash) return
    cmd.execute(harmony.client!, message, { slash: false, params: params })
  })
}

export const registerSlashCommands = async (
  harmony: Harmony,
  commands: HarmonyCommand<true>[]
) => {
  const rest = new REST().setToken(process.env.HARMONY_TOKEN || '')

  await rest.put(
    Routes.applicationCommands(
      harmony.options.clientId || process.env.HARMONY_CLIENT_ID || ''
    ),
    { body: commands.map((cmd) => toJSON(cmd)) }
  )
  harmony.client?.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.find(
      (cmd) => cmd.options.name === interaction.commandName
    )

    if (!cmd || !cmd.options.slash) return
    cmd.execute(harmony.client!, interaction, {
      slash: true,
      params: interaction.options
    })
  })
}

export const registerEvents = (harmony: Harmony, events: HarmonyEvent[]) => {
  for (const event of events) {
    if (event.options.once) {
      harmony.client?.once(event.options.name!, event.callback)
    } else {
      harmony.client?.on(event.options.name!, event.callback)
    }
  }
}
