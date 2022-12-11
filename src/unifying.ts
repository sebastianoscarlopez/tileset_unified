import fs from "fs";
import path from "path";
import { promisify } from "util";

import { Tile, TileRoot } from "./definitions/tile";

export const readTilesetFile = async (pathFile: string): Promise<TileRoot> => {
  return promisify(fs.readFile)(pathFile, "utf8").then((data: string) => {
    return JSON.parse(data.toString());
  });
};

interface ChildrenAndChild {
  children: Tile[];
  child: Tile;
}

export const getRefToChildrenAndChildWithJson = (tileset: TileRoot): ChildrenAndChild => {
  const queue: Tile[] = [];

  queue.push(tileset.root);
  while (queue.length > 0) {
    const tile = queue.shift() as Tile;
    const { children } = tile;

    if (children?.length > 0) {
      const child = children.find(({ content }) => content.uri.endsWith(".json"))
      if (child) {
        return { children, child }
      }
      queue.push(...children);
    }
  }
  return null;
};

export const getAbsolutePathFromChild = (pathRootFile: string, child: Tile): string => {
  const jsonChildrenPath = child.content.uri;
  return path.resolve(path.dirname(pathRootFile), jsonChildrenPath)
}

export const getTilsetWithAbsolutePath = async (pathFile: string): Promise<TileRoot> => {
  const tileset = await readTilesetFile(pathFile);
  const queue: Tile[] = [];

  queue.push(tileset.root);
  while (queue.length > 0) {
    const tile = queue.shift() as Tile;

    if(tile.content?.uri?.length > 0) {
      tile.content.uri = getAbsolutePathFromChild(pathFile, tile)
    }

    const { children } = tile
    if (children?.length > 0) {
      queue.push(...children);
    }
  }

  return tileset;
}

export const writeTilesetToFile = (tileset: TileRoot, filePath: string): Promise<void> => {
  return promisify(fs.writeFile)(filePath, JSON.stringify(tileset), { flag: 'w' })
}

export const unifiedFromRootPath = async (rootFilePath: string): Promise<TileRoot> => {
  const tileset = await getTilsetWithAbsolutePath(rootFilePath);

  let refWithJson = getRefToChildrenAndChildWithJson(tileset);
  while(refWithJson !== null) {
    const { children, child } = refWithJson;
    const absolutePath = getAbsolutePathFromChild(rootFilePath, child)
    const childrenFromJson = await getTilsetWithAbsolutePath(absolutePath);
    children.splice(children.indexOf(child), 1, ...childrenFromJson.root.children)
    refWithJson = getRefToChildrenAndChildWithJson(tileset);
  }
  return tileset;
};

export const getTilesetWithRelativePath = async (tileset: TileRoot, rootDirPath: string): Promise<TileRoot> => {
  const queue: Tile[] = [];

  queue.push(tileset.root);
  while (queue.length > 0) {
    const tile = queue.shift() as Tile;

    if(tile.content?.uri?.length > 0) {
      tile.content.uri = path.relative(rootDirPath, tile.content.uri)
    }

    const { children } = tile
    if (children?.length > 0) {
      queue.push(...children);
    }
  }

  return tileset;
}
