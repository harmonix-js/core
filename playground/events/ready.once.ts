import { defineEvent } from '../../src'

export default defineEvent((client) => {
  console.log(`Ready! Logged in as ${client.user?.tag}`)
})
