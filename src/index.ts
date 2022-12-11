import { getTilesetWithRelativePath, unifiedFromRootPath, writeTilesetToFile } from "./unifying";

import dotenv from "dotenv"
dotenv.config()

console.log(process.env.NODE_ENV, process.env.NODE_PATH_IN_DIR)
const rootFilePath = `${process.env.NODE_PATH_IN_DIR}/${process.env.NODE_PATH_IN_ROOT}`;
const fileUnifiedPath = `${process.env.NODE_PATH_OUT}/${process.env.NODE_FILE_UNIFIED}`;

(async () => {
  console.log(`Unifying file to: ${fileUnifiedPath}`)
  const unifiedTileset = await unifiedFromRootPath(rootFilePath);
  const unifiedTilesetRelativePaths = await getTilesetWithRelativePath(unifiedTileset, process.env.NODE_PATH_IN_DIR)
  await writeTilesetToFile(unifiedTilesetRelativePaths, fileUnifiedPath)
  console.log('SAVED UNIFIED FILE')
})()
