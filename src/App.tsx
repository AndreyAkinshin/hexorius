import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';
import GameBoard from './components/GameBoard';
import { Difficulty } from './game/progress';

function App() {
  const [currentLevel, setCurrentLevel] = useState<string>('first-steps');
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartGame = (levelSlug: string, difficulty: Difficulty) => {
    setCurrentLevel(levelSlug);
    setCurrentDifficulty(difficulty);
    setIsPlaying(true);
  };

  const handleBackToHome = () => {
    setIsPlaying(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="*" element={
          isPlaying ? (
            <GameBoard 
              levelSlug={currentLevel}
              difficulty={currentDifficulty}
              onBackToHome={handleBackToHome}
            />
          ) : (
            <HomeScreen onStartGame={handleStartGame} />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
