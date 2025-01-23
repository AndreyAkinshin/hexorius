import { GameState, HexCoord } from '../types';

export interface Move {
  from: HexCoord;
  to: HexCoord;
  score: number;
}

export interface AIStrategy {
  title: string;
  findBestMove(state: GameState): { from: HexCoord; to: HexCoord } | null;
}

export function evaluateBaseMove(state: GameState, from: HexCoord, to: HexCoord): number {
  const newState = makeMove(state, from, to);
  
  // Calculate position score based on piece difference
  let score = newState.scores.player2 - state.scores.player2;

  // Bonus for center control (pieces closer to center are better)
  const centerDistance = Math.abs(to.q) + Math.abs(to.r);
  score += (4 - centerDistance) * 0.2;

  // Bonus for moves that capture more pieces
  const capturedPieces = newState.scores.player2 - state.scores.player2;
  score += capturedPieces * 2;

  return score;
}

import { makeMove } from '../gameState'; 