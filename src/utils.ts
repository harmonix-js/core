import fs from 'node:fs'
import { resolve } from 'pathe'

export const getAllFiles = (dirPath: string, filesArray: string[] = []) => {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = resolve(dirPath, file)
    const fileStat = fs.statSync(filePath)

    if (fileStat.isDirectory()) {
      getAllFiles(filePath, filesArray)
    } else {
      filesArray.push(filePath)
    }
  })

  return filesArray
}
