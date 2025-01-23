import React from 'react';
import { LEVELS } from '../game/levels';
import { calculateTotalProgress, getProgress, LevelProgress, Difficulty } from '../game/progress';
import styled, { keyframes } from 'styled-components';

const neonPulse = keyframes`
  0% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff, 0 0 82px #ff00ff, 0 0 92px #ff00ff; }
  50% { text-shadow: 0 0 5px #fff, 0 0 7px #fff, 0 0 15px #fff, 0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 70px #ff00ff; }
  100% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff00ff, 0 0 82px #ff00ff, 0 0 92px #ff00ff; }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 60%),
    linear-gradient(0deg, #000 0%, #1a0f1a 100%);
  overflow-y: auto;
  height: 100%;
  color: #fff;
`;

const Header = styled.div`
  padding: clamp(1rem, 4vw, 2rem);
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid #ff00ff;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: clamp(1rem, 4vw, 2rem);
  flex: 1;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: bold;
  font-family: 'Press Start 2P', cursive;
  text-transform: uppercase;
  animation: ${neonPulse} 2s infinite;
  margin-bottom: 1rem;
  letter-spacing: clamp(2px, 1vw, 4px);
  text-align: center;
`;

const ProgressBar = styled.div`
  font-size: clamp(1.2rem, 4vw, 2.5rem);
  font-weight: bold;
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  text-transform: uppercase;
  animation: ${neonPulse} 2s infinite;
  letter-spacing: clamp(1px, 0.5vw, 2px);
`;

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  width: 100%;
  padding: clamp(0.5rem, 2vw, 1rem);
`;

const LevelCard = styled.div`
  background: rgba(42, 42, 42, 0.8);
  border: 2px solid #ff00ff;
  border-radius: 12px;
  padding: clamp(1rem, 3vw, 1.5rem);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
    border-color: #ff80ff;
  }

  @media (hover: none) {
    &:active {
      transform: translateY(-5px);
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
      border-color: #ff80ff;
    }
  }
`;

const LevelHeader = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`;

const LevelTitle = styled.h2`
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px #ff00ff;
  font-family: 'Press Start 2P', cursive;
`;

const LevelDescription = styled.p`
  color: #aaa;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin-bottom: 1rem;
`;

const LevelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 1rem;
`;

const LevelPreview = styled.div`
  background: rgba(26, 26, 26, 0.9);
  border: 2px solid #ff00ff;
  border-radius: 8px;
  aspect-ratio: 16/9;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ff80ff;
  text-shadow: 0 0 5px #ff00ff;
  font-family: 'Press Start 2P', cursive;
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: clamp(0.5rem, 2vw, 1rem);
`;

interface StarProps {
  completed: boolean;
}

const Star = styled.button.attrs<StarProps>(props => ({
  style: {
    '--star-color': props.completed ? '#ff00ff' : '#333'
  } as React.CSSProperties
}))`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  color: var(--star-color);
  transition: all 0.3s ease;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  text-shadow: ${props => props.completed ? '0 0 10px #ff00ff' : 'none'};

  &:hover {
    transform: scale(1.2) rotate(5deg);
    color: #ff80ff;
    text-shadow: 0 0 10px #ff00ff;
  }

  @media (hover: none) {
    &:active {
      transform: scale(1.2) rotate(5deg);
      color: #ff80ff;
      text-shadow: 0 0 10px #ff00ff;
    }
  }
`;

interface HomeScreenProps {
  onStartGame: (levelSlug: string, difficulty: Difficulty) => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  const progress = getProgress();
  const totalProgress = calculateTotalProgress(LEVELS.length);

  const handleLevelClick = (levelSlug: string, difficulty: Difficulty) => {
    onStartGame(levelSlug, difficulty);
  };

  return (
    <Container>
      <Header>
        <Title>Hexorius</Title>
        <ProgressBar>
          Progress: {totalProgress.toFixed(2)}%
        </ProgressBar>
      </Header>
      <Content>
        <LevelsGrid>
          {LEVELS.map((level, index) => {
            const levelProgress = progress.levels[index] || { easy: false, medium: false, hard: false };
            return (
              <LevelCard 
                key={index} 
                onClick={() => {
                  const firstUnfinished = !levelProgress.easy ? 'easy' 
                    : !levelProgress.medium ? 'medium'
                    : !levelProgress.hard ? 'hard'
                    : 'easy'; // Default to easy if all are finished
                  handleLevelClick(level.slug, firstUnfinished);
                }}>
                <LevelHeader>
                  <LevelTitle>{level.name}</LevelTitle>
                </LevelHeader>
                <StarsContainer>
                  <Star 
                    completed={levelProgress.easy}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(level.slug, 'easy');
                    }}
                    title="Easy">
                    ★
                  </Star>
                  <Star 
                    completed={levelProgress.medium}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(level.slug, 'medium');
                    }}
                    title="Medium">
                    ★
                  </Star>
                  <Star 
                    completed={levelProgress.hard}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(level.slug, 'hard');
                    }}
                    title="Hard">
                    ★
                  </Star>
                </StarsContainer>
              </LevelCard>
            );
          })}
        </LevelsGrid>
      </Content>
    </Container>
  );
} 