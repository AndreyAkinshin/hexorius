import { AIStrategy } from './AIStrategy';
import { EasyAIStrategy } from './EasyAIStrategy';
import { MediumAIStrategy } from './MediumAIStrategy';
import { HardAIStrategy } from './HardAIStrategy';

export type Difficulty = 'easy' | 'medium' | 'hard';

export class AIStrategyFactory {
  private static instance: AIStrategyFactory;
  private strategies: Map<Difficulty, AIStrategy>;

  private constructor() {
    this.strategies = new Map();
    this.strategies.set('easy', new EasyAIStrategy());
    this.strategies.set('medium', new MediumAIStrategy());
    this.strategies.set('hard', new HardAIStrategy());
  }

  public static getInstance(): AIStrategyFactory {
    if (!AIStrategyFactory.instance) {
      AIStrategyFactory.instance = new AIStrategyFactory();
    }
    return AIStrategyFactory.instance;
  }

  public getStrategy(difficulty: Difficulty): AIStrategy {
    const strategy = this.strategies.get(difficulty);
    if (!strategy) {
      throw new Error(`Strategy for difficulty ${difficulty} not found`);
    }
    return strategy;
  }
} 