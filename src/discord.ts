import { Client } from 'discord.js'
import type { Harmony, HarmonyCommand, HarmonyEvent } from './types'
import 'dotenv/config'

export const initCient = (harmonyOptions: Harmony['options']) => {
  const client = new Client({ intents: harmonyOptions.intents })

  client.login(process.env.HARMONY_TOKEN)

  return client
}

export const registerCommands = (
  harmony: Harmony,
  commands: Map<string, HarmonyCommand<boolean>>
) => {
  harmony.client?.on('messageCreate', (message) => {
    if (message.author.bot) return
    const prefix = harmony.options.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.get(command)

    if (!cmd || cmd.options.slash) return
    cmd.execute(harmony.client!, message)
  })

  harmony.client?.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.get(interaction.commandName)

    if (!cmd || !cmd.options.slash) return
    cmd.execute(harmony.client!, interaction)
  })

  for (const [name, command] of commands) {
    if (!command.options.slash) continue
    harmony.client?.application?.commands.create({
      name: name,
      description: command.options.description || 'No description provided',
      options: command.options.arguments
    })
  }
}

export const registerEvents = (
  harmony: Harmony,
  events: Map<string, HarmonyEvent>
) => {
  for (const [, event] of events) {
    if (event.options.once) {
      harmony.client?.once(event.options.name!, event.callback)
    } else {
      harmony.client?.on(event.options.name!, event.callback)
    }
  }
}
