import { Client, REST, Routes } from 'discord.js'
import consola from 'consola'
import type { Harmonix } from './types'
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
      await rest.put(
        Routes.applicationCommands(harmonix.options.clientId || client.user.id),
        {
          body: commands.map((cmd) => toJSON(cmd))
        }
      )
      consola.success('Successfully reloaded application commands.\n')
      const readyEvent = harmonix.events.get('ready')

      if (readyEvent) {
        ctx.call(harmonix, () => readyEvent.callback(client))
      }
    } catch (error: any) {
      createError(error.message)
    }
  })
}
