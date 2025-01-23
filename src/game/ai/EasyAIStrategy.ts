import { AIStrategy, Move } from './AIStrategy';
import { GameState, HexCoord } from '../types';
import { getValidMoves, makeMove } from '../gameState';
import { hexToString } from '../hexUtils';

export class EasyAIStrategy implements AIStrategy {
  title = 'Easy';

  private isEndgame(state: GameState): boolean {
    return state.scores.player1 + state.scores.player2 > 20;
  }

  findBestMove(state: GameState): { from: HexCoord; to: HexCoord } | null {
    const possibleMoves: Move[] = [];
    const isEndgame = this.isEndgame(state);
    
    console.log(`AI Level: ${this.title} ${isEndgame ? '(Endgame)' : '(Early/Mid Game)'}`);
    
    // Find computer's pieces and their valid moves
    state.board.forEach((hex, key) => {
      if (hex.player === state.currentPlayer) {
        const validMoves = getValidMoves(state, hex);
        
        validMoves.forEach(move => {
          const newState = makeMove(state, hex, move);
          let score = 0;

          // Prioritize capturing pieces
          const pieceDifference = state.currentPlayer === 1 
            ? newState.scores.player1 - state.scores.player1
            : newState.scores.player2 - state.scores.player2;
          score += pieceDifference * 10; // Increase weight for captures

          // Calculate distance to this move
          const distance = Math.max(
            Math.abs(move.q - hex.q),
            Math.abs(move.r - hex.r),
            Math.abs(-move.q-move.r+hex.q+hex.r)
          );

          // Prefer duplicating over jumping in early game
          if (distance === 1 && !isEndgame) {
            score += 2;
          }

          // Add some randomness to make it less predictable
          score += Math.random();

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

    // Sort moves by score and pick one of the top moves
    possibleMoves.sort((a, b) => b.score - a.score);
    const topMoves = possibleMoves.slice(0, Math.min(3, possibleMoves.length));
    const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    
    return {
      from: selectedMove.from,
      to: selectedMove.to
    };
  }
} 