import { HarmonyConfig } from '../types'
import { getCommand, type Command } from './commands'
import { getEvent, type Event } from './events'
import { type LoadHarmonyConfigOptions, loadHarmonyConfig } from './config'
import { getAllFiles } from './utils'
import { resolve } from 'path'
import { Client } from 'discord.js'

export class Harmony {
  private _config: Required<HarmonyConfig> | null = null
  private _commands: Record<string, Command> = {}
  private _events: Record<string, Event> = {}
  private _cwd: string | null = null
  private _client: Client | null = null

  public get config() {
    return this._config
  }

  public get commands() {
    return this._commands
  }

  public get events() {
    return this._events
  }

  constructor() {}

  public static async create(opts: LoadHarmonyConfigOptions) {
    const harmony = new Harmony()

    await harmony._initConfig(opts)
    harmony._initCommands()
    harmony._initEvents()

    return harmony
  }

  private async _initConfig(opts: LoadHarmonyConfigOptions) {
    this._cwd = opts.cwd ?? '.'
    this._config = await loadHarmonyConfig(opts)
  }

  private _initCommands() {
    if (!this._config || !this._cwd) {
      throw new Error('Configuration not initialized')
    }
    const filesPath = getAllFiles(
      resolve(this._cwd, this._config!.dir.commands as string)
    )

    this._commands = Object.fromEntries(
      filesPath.map((path) => {
        const command = getCommand(path)

        return [command.name, command]
      })
    )
  }

  private _initEvents() {
    if (!this._config || !this._cwd) {
      throw new Error('Configuration not initialized')
    }
    const filesPath = getAllFiles(
      resolve(this._cwd, this._config.dir.events as string)
    )

    this._events = Object.fromEntries(
      filesPath.map((path) => {
        const event = getEvent(resolve(this._cwd as string, path))

        return [event.name, event]
      })
    )
  }

  private _refreshSlashCommands() {
    if (!this._client) {
      return
    }

    for (const command in this._commands) {
      const c = this._commands[command]

      if (!c.slash) {
        continue
      }

      this._client.application?.commands.create({
        name: c.name,
        description: c.description,
        options: c.arguments,
        nsfw: c.nsfw
      })
    }
  }

  public initClient() {
    this._client = new Client({
      intents: ['Guilds', 'GuildMessages', 'MessageContent']
    })

    this._refreshSlashCommands()

    for (const event in this._events) {
      const e = this._events[event]

      if (e.once) {
        this._client.once(e.name, e.callback)
      } else {
        this._client.on(e.name, e.callback)
      }
    }

    this._client.on('messageCreate', (message) => {
      if (!this._config || message.author.bot) {
        return
      }
      if (!message.content.startsWith(this._config.defaultPrefix)) {
        return
      }
      const [commandName] = message.content
        .slice(this._config.defaultPrefix.length)
        .split(' ')
      const command = this._commands[commandName]

      if (!command || command.slash) {
        return
      }
      command.execute(this._client!, message)
    })

    this._client.on('interactionCreate', (interaction) => {
      if (!this._config || !interaction.isChatInputCommand()) {
        return
      }
      const command = this._commands[interaction.commandName]

      if (!command || !command.slash) {
        return
      }
      command.execute(this._client!, interaction)
    })

    this._client.login(process.env.CLIENT_TOKEN)
  }
}
