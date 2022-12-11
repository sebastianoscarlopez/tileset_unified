import fs from 'fs'
import path from "path";
import { getTilesetFiles, getFilesAndDirectories, writeListOfFileNamesToFile } from "../../readStructureTree";

import dotenv from "dotenv"
dotenv.config()

describe('Check files within input directory are ok', () => {
  it('Get list json files and directories from NODE_PATH_IN_DIR', async () => {
    const tilesetFiles = await getFilesAndDirectories(process.env.NODE_PATH_IN_DIR ?? '')
    expect(tilesetFiles?.dirPath).toBeDefined()
    expect(tilesetFiles?.directories?.length).toBeGreaterThan(0);
  });

  it('Get list json files and save in file', async () => {
    const tilesetFiles = await getTilesetFiles(process.env.NODE_PATH_IN_DIR ?? '')
    expect(tilesetFiles.length).toBeGreaterThan(0);

    const fileName = path.join(process.env.NODE_PATH_OUT, process.env.NODE_FILE_LIST)
    await writeListOfFileNamesToFile(tilesetFiles, fileName)
    expect(fs.existsSync(fileName)).toBe(true)
  });
});
