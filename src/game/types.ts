import { LevelConfig } from './levels';

export type Player = 1 | 2;

export interface HexCoord {
  q: number;  // axial coordinate q
  r: number;  // axial coordinate r
}

export interface Hex extends HexCoord {
  player?: Player;
  isHighlighted?: boolean;
  isValidMove?: boolean;
}

export type MoveType = 'duplicate' | 'jump';

export interface GameState {
  board: Map<string, Hex>;
  currentPlayer: Player;
  selectedHex: HexCoord | null;
  validMoves: HexCoord[];
  scores: {
    player1: number;
    player2: number;
  };
  level: LevelConfig;
  levelIndex: number;
  moveCount: number;
}

export interface HexMetrics {
  size: number;      // size of a hexagon (distance from center to corner)
  width: number;     // width of a hexagon
  height: number;    // height of a hexagon
  vertDist: number;  // vertical distance between hexagons
  horizDist: number; // horizontal distance between hexagons
}
