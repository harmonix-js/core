#!/usr/bin/env node

import { createHarmony } from '../dist/index.mjs'
import 'dotenv/config'

const initHarmony = async () => {
  const harmony = await createHarmony(
    { rootDir: './playground' },
    { cwd: './playground' }
  )
  console.log(harmony)
}

initHarmony()
