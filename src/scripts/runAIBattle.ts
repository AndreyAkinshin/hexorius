import { GameState, HexCoord, Player, Hex } from '../game/types';
import { hexToString } from '../game/hexUtils';
import { makeMove } from '../game/gameState';
import { EasyAIStrategy } from '../game/ai/EasyAIStrategy';
import { MediumAIStrategy } from '../game/ai/MediumAIStrategy';
import { LEVELS } from '../game/levels';

function createInitialGameState(): GameState {
  const board = new Map();
  const level = LEVELS[0]; // Use the first level for AI battles
  
  // Set up initial board with empty hexes in a hexagonal pattern
  for (let q = -4; q <= 4; q++) {
    const r1 = Math.max(-4, -q - 4);
    const r2 = Math.min(4, -q + 4);
    for (let r = r1; r <= r2; r++) {
      board.set(hexToString({ q, r }), { q, r });
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
    board.set(hexToString(pos), { ...pos, player: 1 });
  });

  player2Positions.forEach(pos => {
    board.set(hexToString(pos), { ...pos, player: 2 });
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

function playGame(easyAI: EasyAIStrategy, mediumAI: MediumAIStrategy): GameState {
  let state = createInitialGameState();
  let moveCount = 0;
  const maxMoves = 200;

  while (moveCount < maxMoves) {
    const currentAI = state.currentPlayer === 1 ? easyAI : mediumAI;
    const move = currentAI.findBestMove(state);

    if (!move) {
      console.log(`Player ${state.currentPlayer} has no valid moves`);
      break;
    }

    state = makeMove(state, move.from, move.to);
    moveCount++;

    if (moveCount % 10 === 0) {
      console.log(`Move ${moveCount}: Player ${state.currentPlayer === 1 ? 2 : 1} moved, scores: ${state.scores.player1}-${state.scores.player2}`);
    }
  }

  if (moveCount >= maxMoves) {
    console.log('Game reached move limit');
  }

  return state;
}

function runAIBattle(numGames: number = 100) {
  console.log(`Starting ${numGames} games between Easy AI and Medium AI...\n`);
  
  const easyAI = new EasyAIStrategy();
  const mediumAI = new MediumAIStrategy();
  
  let easyWins = 0;
  let mediumWins = 0;
  let draws = 0;
  let totalEasyScore = 0;
  let totalMediumScore = 0;

  for (let i = 1; i <= numGames; i++) {
    console.log(`Game ${i}:`);
    const finalState = playGame(easyAI, mediumAI);
    
    totalEasyScore += finalState.scores.player1;
    totalMediumScore += finalState.scores.player2;

    if (finalState.scores.player1 > finalState.scores.player2) {
      easyWins++;
      console.log(`Game ${i} finished: Easy ${finalState.scores.player1} - ${finalState.scores.player2} Medium (Winner: Easy)\n`);
    } else if (finalState.scores.player2 > finalState.scores.player1) {
      mediumWins++;
      console.log(`Game ${i} finished: Easy ${finalState.scores.player1} - ${finalState.scores.player2} Medium (Winner: Medium)\n`);
    } else {
      draws++;
      console.log(`Game ${i} finished: Easy ${finalState.scores.player1} - ${finalState.scores.player2} Medium (Winner: Draw)\n`);
    }
  }

  console.log('Final Results:');
  console.log(`Easy AI wins: ${easyWins}`);
  console.log(`Medium AI wins: ${mediumWins}`);
  console.log(`Draws: ${draws}`);
  console.log(`Average score - Easy: ${(totalEasyScore / numGames).toFixed(1)}, Medium: ${(totalMediumScore / numGames).toFixed(1)}\n`);
}

runAIBattle(100); 