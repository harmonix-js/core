#!/usr/bin/env node

import { createHarmonix } from '../dist/index.mjs'
import 'dotenv/config'

const init = async () => {
  await createHarmonix(
    { rootDir: './playground' },
    { cwd: './playground' },
    true
  )
}

init()
