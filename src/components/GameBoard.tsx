import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { GameState } from '../game/types';
import { GameScene } from '../game/scenes/GameScene';
import { Difficulty } from '../game/progress';
import { GameResult } from './GameResult';
import { hasValidMoves } from '../game/gameState';
import { LEVELS } from '../game/levels';
import styled, { keyframes } from 'styled-components';

const neonPulse = keyframes`
  0% { box-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff, 0 0 82px #ff00ff; }
  50% { box-shadow: 0 0 5px #fff, 0 0 7px #fff, 0 0 15px #fff, 0 0 30px #ff00ff, 0 0 60px #ff00ff; }
  100% { box-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff, 0 0 82px #ff00ff; }
`;

const textNeonPulse = keyframes`
  0% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff; }
  50% { text-shadow: 0 0 5px #fff, 0 0 7px #fff, 0 0 15px #fff, 0 0 30px #ff00ff; }
  100% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff; }
`;

const GameContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 60%),
    linear-gradient(0deg, #000 0%, #1a0f1a 100%);
  padding: 0.25rem;

  @media (max-width: 600px) {
    padding: 0;
  }
`;

const StatusPanel = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(26, 26, 26, 0.9);
  border: 2px solid #ff00ff;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  animation: ${neonPulse} 2s infinite;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const LevelInfo = styled.div`
  text-align: center;
  color: white;
  font-family: 'Press Start 2P', cursive;
  
  h2 {
    margin: 0;
    font-size: clamp(0.8rem, 2.5vw, 1.1rem);
    font-weight: 500;
    color: #fff;
    animation: ${textNeonPulse} 2s infinite;
  }
  
  p {
    margin: 0.2rem 0 0;
    font-size: clamp(0.7rem, 2vw, 0.9rem);
    color: #ff80ff;
  }

  @media (max-width: 600px) {
    order: -1;
    width: 100%;
  }
`;

const ScoresSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
  }
`;

const ScoreBox = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.isActive ? 'rgba(255, 0, 255, 0.2)' : 'rgba(26, 26, 26, 0.8)'};
  border: 2px solid ${props => props.isActive ? '#ff00ff' : '#333'};
  border-radius: 8px;
  min-width: 70px;
  transition: all 0.3s ease;
  color: #fff;
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  box-shadow: ${props => props.isActive ? '0 0 15px rgba(255, 0, 255, 0.4)' : 'none'};
`;

const PlayerDot = styled.div<{ color: 'red' | 'blue' }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color === 'red' ? '#ff0066' : '#00ffff'};
  box-shadow: 0 0 10px ${props => props.color === 'red' ? 'rgba(255, 68, 68, 0.6)' : 'rgba(68, 68, 255, 0.6)'};
  animation: ${neonPulse} 2s infinite;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid #ff00ff;
  border-radius: 8px;
  background: rgba(26, 26, 26, 0.8);
  color: #fff;
  font-size: 0.9rem;
  font-family: 'Press Start 2P', cursive;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;

  &:hover {
    background: rgba(255, 0, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3L4 9V21H20V9L12 3Z" />
    <path d="M9 14H15V21H9V14Z" />
    <path d="M12 3L2 11H4L12 5L20 11H22L12 3Z" />
  </svg>
);

const RestartIcon = () => (
  <svg 
    viewBox="0 0 122.04 122.88" 
    fill="currentColor"
    width="24"
    height="24"
  >
    <path 
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.73,9.3v39.28h39.28l4.63,0l-3.27-3.28L33.91,33.85c0.76-0.73,1.54-1.44,2.36-2.11 c1.08-0.88,2.22-1.72,3.38-2.48l0,0c6.02-3.92,13.21-6.21,20.94-6.21l0.01,0v-0.01c10.59,0,20.18,4.3,27.12,11.24 c6.94,6.94,11.24,16.53,11.24,27.11h-0.01v0.05h0.01c0,10.59-4.3,20.19-11.24,27.12c-6.94,6.94-16.53,11.24-27.11,11.24v-0.01 l-0.08,0v0.01c-3.7,0-7.39-0.54-10.93-1.59v0c-1.95-0.58-3.87-1.33-5.71-2.22c-9.39-4.54-16.65-12.8-19.87-22.87l-0.43-1.33 L0,71.82l0.47,2.3l0.01,0.06v0.01c0.8,3.84,2,7.62,3.53,11.24v0.01c1.51,3.55,3.38,6.98,5.53,10.19 c11.03,16.43,29.78,27.25,51.05,27.25l0.01,0v-0.01c16.96,0,32.33-6.88,43.43-17.99v-0.01c11.1-11.11,17.98-26.45,17.98-43.4 l0.01,0v-0.05h-0.01c0-16.96-6.88-32.32-18-43.43l0,0C92.93,6.89,77.58,0.02,60.63,0.01V0l-0.06,0v0.01 c-8.71,0-17.01,1.82-24.51,5.1c-1.21,0.53-2.42,1.11-3.6,1.71c-5.48,2.83-10.47,6.46-14.83,10.74L8,7.95L4.73,4.67V9.3L4.73,9.3 L4.73,9.3z"
    />
  </svg>
);

const IconButton = styled(Button)`
  padding: 0.75rem;
  width: clamp(44px, 10vw, 52px);
  height: clamp(44px, 10vw, 52px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;

  svg {
    width: clamp(24px, 6vw, 28px);
    height: clamp(24px, 6vw, 28px);
    stroke: currentColor;
    stroke-linecap: square;
    stroke-linejoin: miter;
    z-index: 1;
    filter: drop-shadow(0 0 8px #ff00ff);
    transition: all 0.3s ease;
  }

  &:hover svg {
    filter: drop-shadow(0 0 12px #ff00ff) drop-shadow(0 0 20px #ff00ff);
    transform: scale(1.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 45%, rgba(255, 0, 255, 0.1) 50%, transparent 55%);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-200%) }
    50% { transform: translateX(200%) }
    100% { transform: translateX(200%) }
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    white-space: nowrap;
    color: #fff;
    text-shadow: 0 0 5px #ff00ff;
    animation: ${textNeonPulse} 2s infinite;
  }
`;

interface GameBoardProps {
  levelSlug: string;
  difficulty: Difficulty;
  onBackToHome: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ levelSlug, difficulty, onBackToHome }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [moves, setMoves] = useState(0);

  // Convert level slug to index
  const levelIndex = LEVELS.findIndex(level => level.slug === levelSlug);
  const level = LEVELS[levelIndex];

  useEffect(() => {
    if (!gameRef.current) return;

    // Validate level
    if (levelIndex === -1 || !level) {
      console.error(`Invalid level: ${levelSlug}`);
      onBackToHome();
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: Math.min(800, window.innerWidth),
      height: Math.min(600, window.innerWidth * 0.75),
      parent: gameRef.current,
      scene: GameScene,
      backgroundColor: '#1a0f1a',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
      }
    };

    // Add resize handler
    const handleResize = () => {
      if (game) {
        game.scale.resize(
          Math.min(800, window.innerWidth),
          Math.min(600, window.innerWidth * 0.75)
        );
      }
    };

    const game = new Phaser.Game(config);
    window.addEventListener('resize', handleResize);

    // Wait for the scene to be available
    game.events.once('ready', () => {
      const gameScene = game.scene.getScene('GameScene') as GameScene;
      sceneRef.current = gameScene;

      // Initialize game state with starting positions
      setGameState({
        board: new Map(),
        currentPlayer: 1,
        selectedHex: null,
        validMoves: [],
        scores: {
          player1: level.startingPositions.player1.length,
          player2: level.startingPositions.player2.length
        },
        level,
        levelIndex,
        moveCount: 0
      });

      gameScene.setStateChangeHandler((state: GameState) => {
        setGameState(state);
        setMoves(state.moveCount);
        
        if (!hasValidMoves(state)) {
          setIsGameFinished(true);
        }
      });

      gameScene.setLevel(levelIndex);
      gameScene.setDifficulty(difficulty);
    });

    return () => {
      game.destroy(true);
      sceneRef.current = null;
    };
  }, [levelSlug, difficulty, levelIndex, level, onBackToHome]);

  const handleRestart = () => {
    if (sceneRef.current) {
      setIsGameFinished(false);
      sceneRef.current.restartGame();
    }
  };

  if (!gameState) {
    return (
      <GameContainer>
        <StatusPanel>
          <div>Loading...</div>
        </StatusPanel>
        <div ref={gameRef} />
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <StatusPanel>
        <ControlsSection>
          <IconButton onClick={onBackToHome} data-tooltip="HOME">
            <HomeIcon />
          </IconButton>
          <IconButton onClick={handleRestart} data-tooltip="RESTART">
            <RestartIcon />
          </IconButton>
        </ControlsSection>
        <LevelInfo>
          {level.name} / {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </LevelInfo>
        <ScoresSection>
          <ScoreBox isActive={gameState.currentPlayer === 1}>
            <PlayerDot color="red" />
            <span>{gameState.scores.player1}</span>
          </ScoreBox>
          <ScoreBox isActive={gameState.currentPlayer === 2}>
            <PlayerDot color="blue" />
            <span>{gameState.scores.player2}</span>
          </ScoreBox>
        </ScoresSection>
      </StatusPanel>
      <div ref={gameRef} />
      {isGameFinished && gameState && (
        <GameResult
          userScore={gameState.scores.player1}
          computerScore={gameState.scores.player2}
          moves={moves}
          levelId={levelIndex}
          difficulty={difficulty}
          onRematch={handleRestart}
          onBackToHome={onBackToHome}
        />
      )}
    </GameContainer>
  );
}

export default GameBoard;
