import { APIApplicationCommand, Client, REST, Routes } from 'discord.js'
import consola from 'consola'
import type { Harmonix, RuntimeHarmonix } from './types'
import 'dotenv/config'
import { createError, ctx } from './harmonix'
import { toJSON } from './utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  try {
    const client = new Client(harmonixOptions.client)

    client.login(process.env.DISCORD_CLIENT_TOKEN)

    return client
  } catch (error: any) {
    createError(error.message)
  }
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
      const apiCommands = (await rest.put(
        Routes.applicationCommands(harmonix.options.clientId || client.user.id),
        {
          body: commands.map((cmd) => toJSON(cmd))
        }
      )) as APIApplicationCommand[]

      consola.info('Syncing commands with API.')
      for (const cmd of commands) {
        const command = apiCommands.find((c) => c.name === cmd.config.name)

        if (!command) {
          consola.warn(`Command \`${cmd.config.name}\` not found in API.`)
          continue
        }
        cmd.config.id = command.id
      }
      consola.success('Successfully reloaded application commands.\n')
      const readyEvents = harmonix.events.filter(
        (event) => event.config.name === 'ready'
      )

      if (readyEvents.size > 0) {
        for (const [, readyEvent] of readyEvents) {
          ctx.call(harmonix as RuntimeHarmonix, () =>
            readyEvent.callback(client)
          )
        }
      }
    } catch (error: any) {
      createError(error.message)
    }
  })
}
