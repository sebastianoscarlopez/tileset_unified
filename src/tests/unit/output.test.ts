import fs from 'fs'
import path from "path";
import { readTilesetFile, getRefToChildrenAndChildWithJson, getAbsolutePathFromChild, getTilsetWithAbsolutePath, unifiedFromRootPath, writeTilesetToFile, getTilesetWithRelativePath } from "../../unifying";

import dotenv from "dotenv"
import { TileRoot } from '../../definitions/tile';
dotenv.config()

describe('Checking the input was processed', () => {
  it('Check exists the file with the list of files', async () => {
    const fileName = path.join(process.env.NODE_PATH_OUT, process.env.NODE_FILE_LIST)
    expect(fs.existsSync(fileName)).toBe(true)
  });
})

describe('Checking the output', () => {
  const rootFilePath = `${process.env.NODE_PATH_IN_DIR}/${process.env.NODE_PATH_IN_ROOT}`;
  it('Root json is readable', async () => {
    const tileset = await readTilesetFile(rootFilePath);
    expect(tileset?.root).toBeDefined();
  });
  it('Find content with a json file', async () => {
    const tileset = await readTilesetFile(rootFilePath);
    const withJsonRef = getRefToChildrenAndChildWithJson(tileset)
    expect(Array.isArray(withJsonRef.children)).toBe(true);
    expect(withJsonRef.child.content.uri.endsWith(".json")).toBe(true);
  });
  it('Getting tileset from to related paths', async () => {
    const tileset = await readTilesetFile(rootFilePath);
    const withJsonRef = getRefToChildrenAndChildWithJson(tileset)
    const jsonChildrenFilePath = getAbsolutePathFromChild(rootFilePath, withJsonRef.child)
    expect(jsonChildrenFilePath.length).toBeGreaterThan(0)
  });
  it('Append relative path to children from json', async () => {
    const tilesetReferenced = await getTilsetWithAbsolutePath(rootFilePath)
    expect(path.dirname(tilesetReferenced.root.content.uri)).toEqual(path.dirname(rootFilePath))
  });
  let unifiedTileset: TileRoot = null
  it('Read and append the children from its json files', async () => {
    unifiedTileset = await unifiedFromRootPath(rootFilePath);
    const withJsonRef = getRefToChildrenAndChildWithJson(unifiedTileset)
    expect(withJsonRef).toBeNull();
  });
  it('Check relative path', async () => {
    const rootContenUriAbsolute = unifiedTileset.root.content.uri
    const tileset = await getTilesetWithRelativePath(unifiedTileset, process.env.NODE_PATH_IN_ROOT)
    expect(path.resolve(process.env.NODE_PATH_IN_ROOT, tileset.root.content.uri)).toEqual(rootContenUriAbsolute)
  });
});
