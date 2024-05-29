import { chatInputApplicationCommandMention } from 'discord.js'
import { defineCommand } from './define'
import { useHarmonix } from './harmonix'
import { useEmbed } from './uses'
import type { CommandConfig } from './types'

const groupCommandsByCategory = (commands: CommandConfig[]) => {
  return commands.reduce((acc: Record<string, CommandConfig[]>, command) => {
    if (!acc[command.category ?? 'uncategorized']) {
      acc[command.category ?? 'uncategorized'] = []
    }
    acc[command.category ?? 'uncategorized'].push(command)
    acc[command.category ?? 'uncategorized'].sort((a, b) =>
      a.name!.localeCompare(b.name!)
    )
    return acc
  }, {})
}

const capitalize = (str: string | undefined) => {
  return str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : str
}

export const helpCommand = defineCommand(
  {
    name: 'help',
    description: 'Shows a list of available commands.',
    category: 'utils',
    options: {
      command: {
        type: 'String',
        description: 'The command to get help for.',
        autocomplete: true,
        required: false
      }
    },
    autocomplete(interaction) {
      const { commands } = useHarmonix()
      const options = commands.map((cmd) => ({
        name: cmd.config.name!,
        value: cmd.config.name!
      }))

      return interaction.respond(options)
    }
  },
  async (client, interaction, ctx) => {
    const { command } = ctx.options
    const { commands } = useHarmonix()

    if (!command) {
      const groupedCommands = groupCommandsByCategory(
        commands.map((cmd) => cmd.config)
      )
      const description = Object.entries(groupedCommands)
        .map(
          ([category, cmds]) =>
            `**${capitalize(category)}**\n${cmds.map((cmd) => `> ${chatInputApplicationCommandMention(cmd.name!, cmd.id!)} **-** ${cmd.description}`).join('\n')}`
        )
        .join('\n\n')
      const embed = useEmbed({
        author: { name: 'Help', iconURL: client.user?.displayAvatarURL() },
        color: 'Random',
        title: 'Available Commands',
        description
      })

      return interaction.reply({ embeds: [embed] })
    } else {
      const cmd = commands.get(command)

      if (!cmd) {
        return interaction.reply(`Command ${command} not found.`)
      }

      const cmdOptions = cmd.config.options
        ? Object.entries(cmd.config.options)
        : null
      const embed = useEmbed({
        color: 'Random',
        author: {
          name: `Help for ${cmd.config.name}`,
          iconURL: client.user?.displayAvatarURL()
        },
        description: cmd.config.description,
        fields: [
          {
            name: 'Category',
            value: capitalize(cmd.config.category) ?? 'None',
            inline: true
          },
          {
            name: 'Preconditions',
            value:
              cmd.config.preconditions
                ?.map((prc) => `\`${prc}\``)
                ?.join(', ') ?? 'None',
            inline: true
          },
          {
            name: 'Options',
            value:
              cmdOptions
                ?.map(
                  ([name, option]) =>
                    `\`${name}\`${option.required ? '*' : ''} - ${option.description}`
                )
                .join('\n') ?? 'None'
          }
        ]
      })

      return interaction.reply({ embeds: [embed] })
    }
  }
)
