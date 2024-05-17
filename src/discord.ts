import { Client, REST, Routes } from 'discord.js'
import consola from 'consola'
import type { Harmonix } from './types'
import 'dotenv/config'
import { createError, ctx } from './harmonix'
import { contextMenuToJSON, isHarmonixCommand, slashToJSON } from './utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client(harmonixOptions.client)

  client.login(process.env.DISCORD_CLIENT_TOKEN)

  return client
}

export const refreshApplicationCommands = async (harmonix: Harmonix) => {
  const commands = [
    ...harmonix.commands.map((cmd) => cmd),
    ...harmonix.contextMenus.map((cmd) => cmd)
  ]
  const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN!)

  harmonix.client?.once('ready', async (client) => {
    try {
      consola.info('Started refreshing application commands.')
      await rest.put(
        Routes.applicationCommands(harmonix.options.clientId || client.user.id),
        {
          body: commands
            .filter((cmd) => !cmd.config.guildOnly)
            .map((cmd) =>
              isHarmonixCommand(cmd) ? slashToJSON(cmd) : contextMenuToJSON(cmd)
            )
        }
      )
      if (harmonix.options.guildId) {
        for (const guildId of harmonix.options.guildId) {
          await rest.put(
            Routes.applicationGuildCommands(
              harmonix.options.clientId || client.user.id,
              guildId
            ),
            {
              body: commands
                .filter((cmd) => cmd.config.guildOnly)
                .map((cmd) =>
                  isHarmonixCommand(cmd)
                    ? slashToJSON(cmd)
                    : contextMenuToJSON(cmd)
                )
            }
          )
        }
      }
      consola.success('Successfully reloaded application commands.\n')
      const readyEvent = harmonix.events.get('ready')

      if (readyEvent) {
        ctx.call(harmonix, () => readyEvent.callback(client))
      }
    } catch (error: any) {
      console.log(error)
      createError(error.message)
    }
  })
}
