import { defineEvent } from '../../src'

export default defineEvent<'ready'>((client) => {
  console.log(`Ready! Logged in as ${client.user?.tag}`)
})
