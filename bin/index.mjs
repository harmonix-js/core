#!/usr/bin/env node

import { createHarmonix } from '../dist/index.mjs'
import 'dotenv/config'

process.env.NODE_ENV = 'development'

const init = async () => {
  await createHarmonix({ rootDir: './playground' }, { cwd: './playground' })
}

init()
