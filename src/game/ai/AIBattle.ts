import { AIStrategy } from './AIStrategy';
import { GameState, HexCoord, Player } from '../types';
import { getValidMoves, makeMove, hasValidMoves } from '../gameState';
import { EasyAIStrategy } from './EasyAIStrategy';
import { MediumAIStrategy } from './MediumAIStrategy';
import { LEVELS } from '../levels';

function createInitialGameState(): GameState {
  const board = new Map();
  const level = LEVELS[0]; // Use the first level for AI battles
  
  // Set up initial board with empty hexes in a hexagonal pattern
  for (let q = -4; q <= 4; q++) {
    const r1 = Math.max(-4, -q - 4);
    const r2 = Math.min(4, -q + 4);
    for (let r = r1; r <= r2; r++) {
      board.set(`${q},${r}`, { q, r });
    }
  }

  // Initial positions for player 1 (Easy AI)
  const player1Positions = [
    { q: -4, r: 0 },
    { q: -4, r: 4 },
    { q: 0, r: -4 }
  ];

  // Initial positions for player 2 (Medium AI)
  const player2Positions = [
    { q: 4, r: -4 },
    { q: 4, r: 0 },
    { q: 0, r: 4 }
  ];

  // Set initial pieces
  player1Positions.forEach(pos => {
    board.set(`${pos.q},${pos.r}`, { ...pos, player: 1 });
  });

  player2Positions.forEach(pos => {
    board.set(`${pos.q},${pos.r}`, { ...pos, player: 2 });
  });
  
  return {
    board,
    currentPlayer: 1,
    selectedHex: null,
    validMoves: [],
    scores: {
      player1: 3,
      player2: 3
    },
    level,
    levelIndex: 0,
    moveCount: 0
  };
}

function playGame(strategy1: AIStrategy, strategy2: AIStrategy): { winner: number, scores: { player1: number, player2: number } } {
  let state = createInitialGameState();
  let moveCount = 0;
  const maxMoves = 200; // Prevent infinite games
  
  while (hasValidMoves(state) && moveCount < maxMoves) {
    const currentStrategy = state.currentPlayer === 1 ? strategy1 : strategy2;
    const move = currentStrategy.findBestMove({...state, currentPlayer: state.currentPlayer});
    
    if (!move) {
      console.log(`Player ${state.currentPlayer} has no valid moves`);
      break;
    }
    
    const fromHex = state.board.get(`${move.from.q},${move.from.r}`);
    if (!fromHex) {
      console.log(`Invalid from hex at ${move.from.q},${move.from.r}`);
      break;
    }
    
    state = makeMove(state, fromHex, move.to);
    moveCount++;

    if (moveCount % 10 === 0) {
      console.log(`Move ${moveCount}: Player ${state.currentPlayer === 1 ? 2 : 1} moved, scores: ${state.scores.player1}-${state.scores.player2}`);
    }
  }

  if (moveCount >= maxMoves) {
    console.log('Game reached move limit');
  }
  
  const winner = state.scores.player1 > state.scores.player2 ? 1 : 
                state.scores.player1 < state.scores.player2 ? 2 : 0;
  
  return {
    winner,
    scores: state.scores
  };
}

export function runAIBattle(numGames: number = 10): void {
  const easyAI = new EasyAIStrategy();
  const mediumAI = new MediumAIStrategy();
  
  let easyWins = 0;
  let mediumWins = 0;
  let draws = 0;
  let totalEasyScore = 0;
  let totalMediumScore = 0;
  
  console.log(`Starting ${numGames} games between Easy AI and Medium AI...`);
  
  for (let i = 0; i < numGames; i++) {
    console.log(`\nGame ${i + 1}:`);
    const result = playGame(easyAI, mediumAI);
    
    if (result.winner === 1) easyWins++;
    else if (result.winner === 2) mediumWins++;
    else draws++;
    
    totalEasyScore += result.scores.player1;
    totalMediumScore += result.scores.player2;
    
    console.log(`Game ${i + 1} finished: Easy ${result.scores.player1} - ${result.scores.player2} Medium (Winner: ${result.winner === 0 ? 'Draw' : result.winner === 1 ? 'Easy' : 'Medium'})`);
  }
  
  console.log('\nFinal Results:');
  console.log(`Easy AI wins: ${easyWins}`);
  console.log(`Medium AI wins: ${mediumWins}`);
  console.log(`Draws: ${draws}`);
  console.log(`Average score - Easy: ${(totalEasyScore / numGames).toFixed(1)}, Medium: ${(totalMediumScore / numGames).toFixed(1)}`);
} 