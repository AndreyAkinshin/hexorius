import { GameState, Hex, HexCoord, Player } from './types';
import { hexToString, getNeighbors, getJumpNeighbors, hexDistance } from './hexUtils';
import { LevelConfig, LEVELS } from './levels';

export function createInitialState(levelIndex: number = 0): GameState {
  const level = LEVELS[levelIndex];
  const board = new Map<string, Hex>();
  
  // Set up board with hexes in a hexagonal pattern based on level's grid size
  for (let q = -level.gridSize; q <= level.gridSize; q++) {
    const r1 = Math.max(-level.gridSize, -q - level.gridSize);
    const r2 = Math.min(level.gridSize, -q + level.gridSize);
    for (let r = r1; r <= r2; r++) {
      board.set(hexToString({ q, r }), { q, r });
    }
  }

  // Set up initial pieces according to level configuration
  [...level.startingPositions.player1, ...level.startingPositions.player2].forEach(([pos, player]) => {
    const key = hexToString(pos);
    board.set(key, { ...pos, player });
  });

  return {
    board,
    currentPlayer: 1,
    selectedHex: null,
    validMoves: [],
    scores: {
      player1: level.startingPositions.player1.length,
      player2: level.startingPositions.player2.length
    },
    level,
    levelIndex,
    moveCount: 0,
  };
}

export function getValidMoves(state: GameState, hex: HexCoord): HexCoord[] {
  const validMoves: HexCoord[] = [];
  const hexKey = hexToString(hex);
  const currentHex = state.board.get(hexKey);

  if (!currentHex || currentHex.player !== state.currentPlayer) {
    return [];
  }

  // Check all cells on the board for valid moves
  state.board.forEach((targetHex, targetKey) => {
    if (targetHex.player) return; // Skip occupied cells

    const distance = Math.max(
      Math.abs(targetHex.q - hex.q),
      Math.abs(targetHex.r - hex.r),
      Math.abs(-targetHex.q-targetHex.r+hex.q+hex.r)
    );

    // Valid moves are either adjacent (distance=1) or within jump distance
    if (distance === 1 || (distance <= state.level.maxJumpDistance)) {
      validMoves.push(targetHex);
    }
  });

  return validMoves;
}

export function makeMove(state: GameState, from: HexCoord, to: HexCoord): GameState {
  const newBoard = new Map(state.board);
  const fromHex = newBoard.get(hexToString(from))!;
  const player = fromHex.player!;

  // Add new piece at destination
  newBoard.set(hexToString(to), { ...to, player });

  // Handle jump vs clone based on distance
  const distance = hexDistance(from, to);
  if (distance > 1) {
    // Jump: keep the hex but remove the player
    newBoard.set(hexToString(from), { q: from.q, r: from.r });
  }
  // For distance === 1, we keep the original piece (cloning)

  // Convert adjacent enemy pieces
  const neighbors = getNeighbors(to);
  neighbors.forEach(hex => {
    const hexKey = hexToString(hex);
    const existingHex = newBoard.get(hexKey);
    if (existingHex && existingHex.player && existingHex.player !== player) {
      newBoard.set(hexKey, { ...existingHex, player });
    }
  });

  // Count pieces for each player
  let player1Count = 0;
  let player2Count = 0;
  newBoard.forEach(hex => {
    if (hex.player === 1) player1Count++;
    if (hex.player === 2) player2Count++;
  });

  return {
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    selectedHex: null,
    validMoves: [],
    scores: {
      player1: player1Count,
      player2: player2Count,
    },
    moveCount: state.moveCount + 1,
  };
}

export function hasValidMoves(state: GameState): boolean {
  for (const [key, hex] of state.board.entries()) {
    if (hex.player === state.currentPlayer) {
      const moves = getValidMoves(state, hex);
      if (moves.length > 0) {
        return true;
      }
    }
  }
  return false;
}
