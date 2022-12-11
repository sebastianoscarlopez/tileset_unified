export interface Tile {
  content: {
    uri: string,
  },
  transform: number[],
  children?: Tile[],
  boundingVolume?: {
    box: number[]
  },
  geometricError: number,
  refine: "REPLACE" | "ADD",
}

export interface TileRoot {
  asset: {
    version: string,
    gltfUpAxis: string,
  },
  geometricError: number,
  root: Tile,
}
