#!/usr/bin/env node

import { loadCommands, loadEvents, loadHarmonyConfig } from '../dist/index.mjs'
import {
  Client,
  Collection,
  SlashCommandBuilder,
  REST,
  Routes
} from 'discord.js'
import 'dotenv/config'

const commands = loadCommands()
const events = loadEvents()

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent']
})

client.commands = new Collection()
console.log('commands', commands)
console.log('events', events)

for (const command in commands) {
  const { slash, data, execute } = commands[command]()

  if (slash || data.slash) {
    client.commands.set(command, {
      data: new SlashCommandBuilder()
        .setName(command)
        .setDescription(data.description),
      slash: slash || data.slash,
      execute
    })
  } else {
    client.commands.set(command, {
      data,
      slash: false,
      execute
    })
  }
}

for (const event in events) {
  const { once, data, callback } = events[event]()

  if (once || data.once) {
    client.once(event, callback)
  } else {
    client.on(event, callback)
  }
}

const rest = new REST().setToken(process.env.CLIENT_TOKEN)

const refreshSlashCommands = async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    const commands = client.commands
      .filter((command) => command.slash)
      .map(({ data }) => data.toJSON())

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.log(error)
  }
}

refreshSlashCommands()

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const command = interaction.client.commands.get(interaction.commandName)

  if (!command || !command.slash) {
    console.log(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(client, interaction)
  } catch (error) {
    console.log(error)
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
})

client.on('messageCreate', async (message) => {
  const config = await loadHarmonyConfig()

  if (message.author.bot) return
  if (!message.content.startsWith(config.defaultPrefix)) return

  const commandName = message.content.slice(config.defaultPrefix.length)
  const command = client.commands.get(commandName)

  if (!command || command.slash) return

  try {
    await command.execute(client, message)
  } catch (error) {
    console.log(error)
    message.reply('There was an error while executing this command!')
  }
})

client.login(process.env.CLIENT_TOKEN)
