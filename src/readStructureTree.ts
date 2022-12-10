import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { NodeDirectory } from "./definitions/node"

export const getFilesAndDirectories = async (pathDir: string): Promise<NodeDirectory> => {
  return promisify(fs.readdir)(pathDir)
    .then((files: string[]) => {  
      const jsonFiles = files.filter((file: string) => file.endsWith('.json'))
      const directories = files
        .filter((file: string) => fs.statSync(path.join(pathDir, file)).isDirectory())
        .map((dir: string) => path.join(pathDir, dir))
      return {
        dirPath: pathDir,
        files: jsonFiles,
        directories
      }
    }
  )
}

export const getTilesetFiles = async (pathDir: string): Promise<string[]> => {
  const files: string[] = []
  const queue: string[] = []
  
  queue.push(pathDir)
  while (queue.length > 0) {
    const dir = queue.shift() as string
    const node = await getFilesAndDirectories(dir)

    node.files.forEach(file => {
      files.push(path.join(dir, file).slice(pathDir.length + 1))
    })
    if (node.directories) {
      queue.push(...node.directories)
    }
  }
  return files
}

export const writeListOfFileNamesToFile = (listOfFileNames: string[], filePath: string): Promise<void> => {
  return promisify(fs.writeFile)(filePath, JSON.stringify(listOfFileNames), { flag: 'w' })
}
