# Harmonix

Create Discord Bot with ease and simplicity.

## Examples

### Installation

```bash
npx @harmonix-js/cli init bot-name
# pnpm dlx @harmonix-js/cli init bot-name
# yarn dlx @harmonix-js/cli init bot-name
```

#### Command

`commands/utils/ping.ts`

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

export default defineEvent<'ready'>((client) => {
  console.log('Bot is ready!')
})
```

## License

Published under the [MIT](https://github.com/harmonix-js/core/blob/main/LICENSE) license.
Made by [@nethriis](https://github.com/nethriis) 🖤
