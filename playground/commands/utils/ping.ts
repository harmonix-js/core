import { defineArgument, defineCommand, useArguments } from '../../../src'

export default defineCommand(
  {
    slash: false,
    description: 'Pong!',
    args: [
      defineArgument({
        type: 'String',
        name: 'message',
        description: 'The message to send'
      }),
      defineArgument({
        type: 'String',
        name: 'user',
        description: 'The user to ping'
      })
    ]
  },
  (client, message, options) => {
    const { get } = useArguments(options)

    message.reply(`Pong ${client.ws.ping}ms! ${get<string>('user')}`)
  }
)
