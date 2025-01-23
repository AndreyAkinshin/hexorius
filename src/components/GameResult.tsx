import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Difficulty } from '../game/progress';
import { markLevelComplete } from '../game/progress';

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

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 60%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 15, 26, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ResultCard = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid #ff00ff;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  animation: ${neonPulse} 2s infinite;
  font-family: 'Press Start 2P', cursive;
`;

const Status = styled.h1<{ isVictory: boolean }>`
  font-size: 3rem;
  color: ${props => props.isVictory ? '#ff00ff' : '#4444ff'};
  margin-bottom: 2rem;
  text-transform: uppercase;
  animation: ${textNeonPulse} 2s infinite;
  letter-spacing: 4px;
`;

const Statistics = styled.div`
  margin: 2rem 0;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 0, 255, 0.3);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  font-size: 1rem;

  span:first-child {
    color: #ff80ff;
  }
`;

const VictoryStar = styled.div`
  font-size: 5rem;
  margin: 2rem 0;
  animation: bounce 1s infinite;
  filter: drop-shadow(0 0 10px #ff00ff) drop-shadow(0 0 20px #ff00ff);

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2.5rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: 2px solid #ff00ff;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Press Start 2P', cursive;
  text-transform: uppercase;
  background: rgba(26, 26, 26, 0.8);
  color: #fff;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 0, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
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
`;

const RematchButton = styled(Button)`
  &:hover {
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
  }
`;

const HomeButton = styled(Button)`
  &:hover {
    box-shadow: 0 0 20px rgba(68, 68, 255, 0.6);
  }
`;

interface GameResultProps {
  userScore: number;
  computerScore: number;
  moves: number;
  levelId: number;
  difficulty: Difficulty;
  onRematch: () => void;
  onBackToHome: () => void;
}

export function GameResult({ 
  userScore, 
  computerScore, 
  moves, 
  levelId, 
  difficulty, 
  onRematch,
  onBackToHome 
}: GameResultProps) {
  const isVictory = userScore > computerScore;

  React.useEffect(() => {
    if (isVictory) {
      markLevelComplete(levelId, difficulty);
    }
  }, [isVictory, levelId, difficulty]);

  return (
    <Container>
      <ResultCard>
        <Status isVictory={isVictory}>
          {isVictory ? 'Victory!' : 'Defeat'}
        </Status>
        
        <Statistics>
          <StatRow>
            <span>Your Score</span>
            <span>{userScore}</span>
          </StatRow>
          <StatRow>
            <span>Computer</span>
            <span>{computerScore}</span>
          </StatRow>
          <StatRow>
            <span>Moves</span>
            <span>{moves}</span>
          </StatRow>
        </Statistics>

        {isVictory && (
          <VictoryStar>
            ⭐
          </VictoryStar>
        )}

        <ButtonContainer>
          {!isVictory && (
            <RematchButton onClick={onRematch}>
              Rematch
            </RematchButton>
          )}
          <HomeButton onClick={onBackToHome}>
            Home
          </HomeButton>
        </ButtonContainer>
      </ResultCard>
    </Container>
  );
} 