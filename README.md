# Harmonix

Create Discord Bot with ease and simplicity.

## Examples

#### Command

`commands/ping.ts`

```ts
import { defineCommand } from '@harmonix-js/core'

export default defineCommand(
  {
    description: 'Ping command'
  },
  (client, message) => {
    message.reply('Pong!')
  }
)
```

#### Event

`events/ready.ts`

```ts
import { defineEvent } from '@harmonix-js/core'

export default defineEvent((client) => {
  console.log('Bot is ready!')
})
```

## License

Published under the [MIT](https://github.com/harmonix-js/core/blob/main/LICENSE) license.
Made by [@nethriis](https://github.com/nethriis) 🖤
