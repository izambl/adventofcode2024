export type Position = [number, number];
export type Tile = {
  up: Tile | null;
  right: Tile | null;
  down: Tile | null;
  left: Tile | null;
  value: string;
  position: Position;
};
export type TileMap = Map<Position, Tile>;

const positionCache = new Map<string, Position>();

export function P(x: number, y: number): Position {
  const key = `${x}|${y}`;

  if (positionCache.has(key)) return positionCache.get(key);

  const tuple: Position = [x, y] as const;
  positionCache.set(key, tuple);

  return tuple;
}

export function buildMap2d(rawMap: string[][]): TileMap {
  const map = new Map<Position, Tile>();

  for (let y = 0; y < rawMap.length; y++) {
    for (let x = 0; x < rawMap[0].length; x++) {
      const tile: Tile = {
        up: null,
        left: null,
        right: null,
        down: null,
        value: rawMap[y][x],
        position: P(x, y),
      };
      map.set(P(x, y), tile);
    }
  }

  for (const [[x, y], tile] of map) {
    tile.up = map.get(P(x, y - 1)) ?? null;
    tile.right = map.get(P(x + 1, y)) ?? null;
    tile.down = map.get(P(x, y + 1)) ?? null;
    tile.left = map.get(P(x - 1, y)) ?? null;
  }

  return map;
}

export function printMap(map: TileMap, path?: Tile[], mapping?: Record<string, string>) {
  let currentTile = map.get(P(0, 0));
  let firstInRow = currentTile;

  while (currentTile) {
    if (path?.includes(currentTile)) {
      process.stdout.write('O');
    } else {
      process.stdout.write(mapping?.[currentTile.value] ?? currentTile.value);
    }

    if (!currentTile.right) {
      currentTile = firstInRow.down;
      firstInRow = currentTile;
      process.stdout.write('\n');
    } else {
      currentTile = currentTile.right;
    }
  }
}
