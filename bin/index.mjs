#!/usr/bin/env node

import { Harmony } from '../dist/index.mjs'
import { resolve } from 'pathe'
import 'dotenv/config'

const initHarmony = async () => {
  const harmony = await Harmony.create({ cwd: resolve('./playground') })

  console.log(harmony)

  harmony.initClient()
}

initHarmony()
