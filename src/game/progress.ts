export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelProgress {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}

export interface GameProgress {
  levels: { [key: number]: LevelProgress };
}

const STORAGE_KEY = 'hexorius_progress';

export function getProgress(): GameProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { levels: {} };
  }
  return JSON.parse(stored);
}

export function markLevelComplete(levelId: number, difficulty: Difficulty) {
  const progress = getProgress();
  if (!progress.levels[levelId]) {
    progress.levels[levelId] = { easy: false, medium: false, hard: false };
  }
  progress.levels[levelId][difficulty] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function calculateTotalProgress(totalLevels: number): number {
  const progress = getProgress();
  let completedChallenges = 0;
  const totalChallenges = totalLevels * 3; // 3 difficulties per level

  Object.values(progress.levels).forEach((level) => {
    if (level.easy) completedChallenges++;
    if (level.medium) completedChallenges++;
    if (level.hard) completedChallenges++;
  });

  return (completedChallenges / totalChallenges) * 100;
} 