import { AIStrategy, Move, evaluateBaseMove } from './AIStrategy';
import { GameState, HexCoord, Player } from '../types';
import { getValidMoves, makeMove, hasValidMoves } from '../gameState';
import { hexToString } from '../hexUtils';

export class HardAIStrategy implements AIStrategy {
  title = 'Hard';
  private readonly MAX_DEPTH = 3;

  findBestMove(state: GameState): { from: HexCoord; to: HexCoord } | null {
    const possibleMoves: Move[] = [];
    const isEndgame = this.evaluatePosition(state) > 20;
    
    console.log(`AI Level: ${this.title} ${isEndgame ? '(Endgame)' : '(Early/Mid Game)'}`);
    
    // Find computer's pieces and their valid moves
    state.board.forEach((hex, key) => {
      if (hex.player === 2) { // Computer is player 2
        const validMoves = getValidMoves({...state, currentPlayer: 2}, hex);
        
        validMoves.forEach(move => {
          const newState = makeMove(state, hex, move);
          const score = this.minimax(newState, this.MAX_DEPTH, -Infinity, Infinity, false);
          possibleMoves.push({
            from: hex,
            to: move,
            score
          });
        });
      }
    });

    if (possibleMoves.length === 0) {
      return null;
    }

    // Sort moves by score and pick the best one
    possibleMoves.sort((a, b) => b.score - a.score);
    const selectedMove = possibleMoves[0]; // Always pick the best move
    
    return {
      from: selectedMove.from,
      to: selectedMove.to
    };
  }

  private minimax(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    // Terminal conditions
    if (depth === 0 || !hasValidMoves(state)) {
      return this.evaluatePosition(state);
    }

    const currentPlayer = isMaximizing ? 2 : 1;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    
    // Get all possible moves for current player
    state.board.forEach((hex, key) => {
      if (hex.player === currentPlayer) {
        const validMoves = getValidMoves({...state, currentPlayer}, hex);
        
        for (const move of validMoves) {
          const newState = makeMove(state, hex, move);
          const score = this.minimax(newState, depth - 1, alpha, beta, !isMaximizing);
          
          if (isMaximizing) {
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);
          } else {
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);
          }
          
          // Alpha-beta pruning
          if (beta <= alpha) {
            break;
          }
        }
      }
    });
    
    return bestScore;
  }

  private evaluatePosition(state: GameState): number {
    const pieceDifference = state.scores.player2 - state.scores.player1;
    
    // Calculate center control
    let centerControl = 0;
    state.board.forEach((hex) => {
      if (hex.player === 2) {
        const centerDistance = Math.abs(hex.q) + Math.abs(hex.r);
        centerControl += (4 - centerDistance) * 0.2;
      }
    });
    
    // Calculate mobility (number of valid moves)
    let mobility = 0;
    state.board.forEach((hex) => {
      if (hex.player === 2) {
        const validMoves = getValidMoves({...state, currentPlayer: 2}, hex);
        mobility += validMoves.length * 0.1;
      }
    });
    
    return pieceDifference * 2 + centerControl + mobility;
  }
} 