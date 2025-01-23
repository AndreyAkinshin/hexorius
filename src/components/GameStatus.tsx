import React from 'react';
import { GameState } from '../game/types';
import { Difficulty } from '../game/ai/AIStrategyFactory';
import { LEVELS } from '../game/levels';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onLevelChange: (level: number) => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  gameState, 
  onRestart, 
  difficulty, 
  onDifficultyChange,
  onLevelChange
}) => {
  const player1Count = Array.from(gameState.board.values()).filter(hex => hex.player === 1).length;
  const player2Count = Array.from(gameState.board.values()).filter(hex => hex.player === 2).length;

  return (
    <div className="game-status">
      <div className="status-container">
        <div className="scores-section">
          <div className={`score-box ${gameState.currentPlayer === 1 ? 'active' : ''}`}>
            <div className="player-dot red"></div>
            <span>{player1Count}</span>
          </div>
          <div className="score-separator">vs</div>
          <div className={`score-box ${gameState.currentPlayer === 2 ? 'active' : ''}`}>
            <div className="player-dot blue"></div>
            <span>{player2Count}</span>
          </div>
        </div>

        <div className="controls-section">
          <select 
            value={gameState.levelIndex} 
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="control-select"
          >
            {LEVELS.map((level, index) => (
              <option key={index} value={index}>
                {level.name}
              </option>
            ))}
          </select>

          <select 
            value={difficulty} 
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            className="control-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button onClick={onRestart} className="control-button">
            ↺
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;

