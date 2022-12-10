import fs from 'fs'
import path from "path";
import { readRootFile, getRefToChildrenAndChildWithJson } from "../../unifying";

import dotenv from "dotenv"
dotenv.config()

describe('Checking the output', () => {
  it('Check exists the file with the list of files', async () => {
    const fileName = path.join(process.env.NODE_PATH_OUT, process.env.NODE_FILE_LIST)
    expect(fs.existsSync(fileName)).toBe(true)
  });
  it('Root json is readable', async () => {
    const tileset = await readRootFile(`${process.env.NODE_PATH_IN_DIR}/${process.env.NODE_PATH_IN_ROOT}`);
    expect(tileset?.root).toBeDefined();
  });
  it('Find content with a json file', async () => {
    const tileset = await readRootFile(`${process.env.NODE_PATH_IN_DIR}/${process.env.NODE_PATH_IN_ROOT}`);
    const withJsonRef = getRefToChildrenAndChildWithJson(tileset)
    expect(Array.isArray(withJsonRef.children)).toBe(true);
    expect(withJsonRef.child.content.uri.endsWith(".json")).toBe(true);
  });
});
