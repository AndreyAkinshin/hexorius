import { GameState, HexCoord, Player, Hex } from '../game/types';
import { hexToString } from '../game/hexUtils';
import { makeMove } from '../game/gameState';
import { MediumAIStrategy } from '../game/ai/MediumAIStrategy';
import { HardAIStrategy } from '../game/ai/HardAIStrategy';

function createInitialGameState(): GameState {
  const board = new Map<string, Hex>();
  
  // Set up initial board with 37 hexes in a hexagonal pattern
  for (let q = -3; q <= 3; q++) {
    const r1 = Math.max(-3, -q - 3);
    const r2 = Math.min(3, -q + 3);
    for (let r = r1; r <= r2; r++) {
      board.set(hexToString({ q, r }), { q, r });
    }
  }

  // Set up initial pieces in positions where they can capture each other
  const player1Positions: [HexCoord, Player][] = [
    [{ q: -2, r: 0 }, 1],
    [{ q: -2, r: 2 }, 1],
    [{ q: 0, r: -2 }, 1]
  ];

  const player2Positions: [HexCoord, Player][] = [
    [{ q: 2, r: -2 }, 2],
    [{ q: 2, r: 0 }, 2],
    [{ q: 0, r: 2 }, 2]
  ];

  [...player1Positions, ...player2Positions].forEach(([pos, player]) => {
    const key = hexToString(pos);
    board.set(key, { ...pos, player });
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
    level: {
      name: "AI Battle",
      slug: "ai-battle",
      description: "AI vs AI battle simulation",
      gridSize: 3,
      maxJumpDistance: 2,
      startingPositions: {
        player1: player1Positions,
        player2: player2Positions
      }
    },
    levelIndex: 0,
    moveCount: 0
  };
}

function playGame(mediumAI: MediumAIStrategy, hardAI: HardAIStrategy): GameState {
  let state = createInitialGameState();
  let moveCount = 0;
  const maxMoves = 200;

  while (moveCount < maxMoves) {
    const currentAI = state.currentPlayer === 1 ? mediumAI : hardAI;
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
  console.log(`Starting ${numGames} games between Medium AI and Hard AI...\n`);
  
  const mediumAI = new MediumAIStrategy();
  const hardAI = new HardAIStrategy();
  
  let mediumWins = 0;
  let hardWins = 0;
  let draws = 0;
  let totalMediumScore = 0;
  let totalHardScore = 0;

  for (let i = 1; i <= numGames; i++) {
    console.log(`Game ${i}:`);
    const finalState = playGame(mediumAI, hardAI);
    
    totalMediumScore += finalState.scores.player1;
    totalHardScore += finalState.scores.player2;

    if (finalState.scores.player1 > finalState.scores.player2) {
      mediumWins++;
      console.log(`Game ${i} finished: Medium ${finalState.scores.player1} - ${finalState.scores.player2} Hard (Winner: Medium)\n`);
    } else if (finalState.scores.player2 > finalState.scores.player1) {
      hardWins++;
      console.log(`Game ${i} finished: Medium ${finalState.scores.player1} - ${finalState.scores.player2} Hard (Winner: Hard)\n`);
    } else {
      draws++;
      console.log(`Game ${i} finished: Medium ${finalState.scores.player1} - ${finalState.scores.player2} Hard (Draw)\n`);
    }
  }

  console.log('Final Results:');
  console.log(`Medium AI wins: ${mediumWins}`);
  console.log(`Hard AI wins: ${hardWins}`);
  console.log(`Draws: ${draws}`);
  console.log(`Average score - Medium: ${(totalMediumScore / numGames).toFixed(1)}, Hard: ${(totalHardScore / numGames).toFixed(1)}\n`);
}

runAIBattle(3);