import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { NodeDirectory } from "./definitions/node"

import { TileRoot } from "./definitions/tile"

// Read file from input directory
export const readRoot = async (path: string): Promise<TileRoot> => {
  return promisify(fs.readFile)(path, 'utf8')
    .then((data: string) => {
      return JSON.parse(data.toString())
  })
}

// Get list of files and directories from input directory
export const readNode = async (pathDir: string): Promise<NodeDirectory> => {
  return promisify(fs.readdir)(pathDir)
    .then((files: string[]) => {  
      const jsonFile = files.find((file: string) => file.endsWith('.json'))
      const directories = files
        .filter((file: string) => fs.statSync(path.join(pathDir, file)).isDirectory())
        .map((dir: string) => path.join(pathDir, dir))
      return {
        dirPath: pathDir,
        file: jsonFile,
        directories
      }
    }
  )
}

export const getTilesetFiles = async (pathDir: string): Promise<string[]> => {
  const files = []
  const queue: string[] = []
  
  queue.push(pathDir)
  while (queue.length > 0) {
    const dir = queue.shift() as string
    const node = await readNode(dir)
    if (node.file) {
      files.push(path.join(dir, node.file).slice(pathDir.length + 1))
    }
    if (node.directories) {
      queue.push(...node.directories)
    }
  }
  return files
}

/// Save de tileset files list to a file
export const saveFilesList = (filesList: string[], fileListName: string): Promise<void> => {
  return promisify(fs.writeFile)(fileListName, JSON.stringify(filesList), { flag: 'w' })
}