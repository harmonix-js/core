[![Harmonix banner](./.github/assets/banner.svg)](https://harmonix-js.netlify.app)

<p align=center>
  <a href="https://www.npmjs.com/package/@harmonix-js/core"><img src="https://img.shields.io/npm/v/@harmonix-js/core?style=flat&colorA=191717&colorB=4b43ee" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@harmonix-js/core"><img src="https://img.shields.io/npm/dm/@harmonix-js/core.svg?style=flat&colorA=191717&colorB=4b43ee" alt="Downloads"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/harmonix-js/core.svg?style=flat&colorA=191717&colorB=4b43ee" alt="License"></a>
  <a href="https://harmonix-js.netlify.app"><img src="https://img.shields.io/badge/Harmonix%20Docs-18181B?logo=gitbook&logoColor=4b43ee" alt="Website"></a>
  <a href="https://discord.gg/A3rVnG4JGV"><img src="https://img.shields.io/badge/Harmonix%20Discord-18181B?logo=discord" alt="Discord"></a>
</p>

# Harmonix

Open-source framework to make Discord bots.

## ⚡ Quick Start

This will set up a starter project with all the required files and dependencies:

```bash
npx @harmonix-js/cli init <my-bot>
```

## 🤖 Development

Harmonix offers a straightforward, user-friendly, and robust solution for writing commands naturally. It automates all repetitive tasks, allowing you to concentrate on developing your bot features with assurance.

Example of a `commands/ping.ts`:

```ts
import { defineCommand } from '@harmonix-js/core'

export default defineCommand(
  {
    description: 'Ping command'
  },
  (client, interaction) => {
    interaction.reply('Pong!')
  }
)
```

## 📖 Documentation

Check out the Harmonix documentation to enhance your skills. It's an excellent resource for deepening your understanding of the framework, covering a large bunch of topics.

## 🤝 Contribution

We welcome your support to enhance Harmonix. To do that you can report bugs or give us feedback and ideas.

## ⚖️ License

Published under the [MIT](https://github.com/harmonix-js/core/blob/main/LICENSE) license.

## 🌱 Contributors

<a href="https://github.com/harmonix-js/core/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=harmonix-js/core" />
</a>
