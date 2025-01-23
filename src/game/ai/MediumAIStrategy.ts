import { AIStrategy, Move } from './AIStrategy';
import { GameState, HexCoord } from '../types';
import { getValidMoves, makeMove, hasValidMoves } from '../gameState';
import { hexToString, getNeighbors } from '../hexUtils';

export class MediumAIStrategy implements AIStrategy {
  title = 'Medium';
  private readonly MAX_DEPTH = 2;  // Lower depth than Hard AI for performance

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
          let score = this.evaluatePosition(newState, state.currentPlayer);
          
          // Look ahead for opponent's best response
          let opponentBestScore = -Infinity;
          let opponentThreats = 0;
          
          // Check opponent's possible responses
          newState.board.forEach((opHex, opKey) => {
            if (opHex.player === (state.currentPlayer === 1 ? 2 : 1)) {
              const opponentMoves = getValidMoves({...newState, currentPlayer: opHex.player}, opHex);
              opponentMoves.forEach(opMove => {
                const opponentState = makeMove(newState, opHex, opMove);
                const opponentScore = this.evaluatePosition(opponentState, opHex.player || 0);
                opponentBestScore = Math.max(opponentBestScore, opponentScore);
                
                // Check if opponent can capture any of our pieces
                const neighbors = getNeighbors(opMove);
                neighbors.forEach(neighbor => {
                  const neighborHex = newState.board.get(hexToString(neighbor));
                  if (neighborHex?.player === state.currentPlayer) {
                    opponentThreats++;
                  }
                });
              });
            }
          });
          
          // Heavily penalize moves that allow opponent to trap us
          score -= opponentThreats * 5;
          
          // Consider opponent's best response
          score -= opponentBestScore * 0.5;
          
          // Early game strategy
          if (!isEndgame) {
            // Prefer moves that maintain mobility
            const futureValidMoves = getValidMoves(newState, move);
            score += futureValidMoves.length * 2;
            
            // Prefer moves towards the center in early game
            const centerDistance = Math.max(
              Math.abs(move.q),
              Math.abs(move.r),
              Math.abs(-move.q-move.r)
            );
            score += (3 - centerDistance) * 3;
            
            // Prefer duplicating over jumping in early game
            const distance = Math.max(
              Math.abs(move.q - hex.q),
              Math.abs(move.r - hex.r),
              Math.abs(-move.q-move.r+hex.q+hex.r)
            );
            if (distance === 1) {
              score += 4;
            }
          }
          
          // Add small random factor
          score += Math.random() * 0.1;
          
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
    const topMovesCount = isEndgame ? 1 : 2;
    const topMoves = possibleMoves.slice(0, Math.min(topMovesCount, possibleMoves.length));
    const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    
    return {
      from: selectedMove.from,
      to: selectedMove.to
    };
  }

  private evaluatePosition(state: GameState, player: number): number {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    
    // Piece difference (most important factor)
    const pieceDifference = player === 1 
      ? state.scores.player1 - state.scores.player2
      : state.scores.player2 - state.scores.player1;
    score += pieceDifference * 10;

    // Territory control and mobility
    let mobilityScore = 0;
    let territoryScore = 0;
    let clusterScore = 0;
    
    state.board.forEach((hex, key) => {
      if (hex.player === player) {
        // Evaluate mobility
        const moves = getValidMoves({...state, currentPlayer: player}, hex);
        mobilityScore += moves.length;
        
        // Territory control (center control and area coverage)
        const centerDistance = Math.max(
          Math.abs(hex.q),
          Math.abs(hex.r),
          Math.abs(-hex.q-hex.r)
        );
        territoryScore += (3 - centerDistance);
        
        // Evaluate piece clustering
        const neighbors = getNeighbors(hex);
        neighbors.forEach(neighbor => {
          const neighborHex = state.board.get(hexToString(neighbor));
          if (neighborHex?.player === player) {
            clusterScore++;
          }
        });
      }
    });
    
    // Weight the different factors
    score += mobilityScore * 1.5;
    score += territoryScore * 2;
    score += clusterScore;
    
    return score;
  }
} 