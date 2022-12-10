import fs from "fs";
import path from "path";
import { promisify } from "util";

import { Tile, TileRoot } from "./definitions/tile";

export const readRootFile = async (pathFile: string): Promise<TileRoot> => {
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
