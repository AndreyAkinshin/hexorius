# Hexorius Game

A modern web-based variation of the classic Hexxagon game, built with React, TypeScript, and Phaser. This project features a hexagonal grid game board, AI opponent, and beautiful animations.

**Generated using Cursor and claude-3.5-sonnet with minimal human intervention.**

## 🎮 Game Overview

Hexorius is a strategic board game played on a hexagonal grid. Players take turns moving and duplicating their pieces while trying to capture opponent pieces. The game combines elements of territory control and strategic movement.

### Game Rules
- Two players (human vs computer)
- Players start with 2-5 pieces each (depending on the level)
- On your turn, you can:
  - **Duplicate**: Move to an adjacent hex (creates a copy of your piece)
  - **Jump**: Move to a hex within the level's jump distance (piece moves to new location)
- Moving next to opponent pieces converts them to your color
- Game ends when no valid moves are available
- Player with the most pieces wins

## 🚀 Features

- 🎨 Beautiful, responsive UI with neon-themed visuals and smooth animations
- 🤖 Three AI difficulty levels with distinct strategies:
  - Easy: Focuses on basic captures and random moves
  - Medium: Considers territory control and piece mobility
  - Hard: Uses minimax algorithm with alpha-beta pruning
- 💾 Progress tracking for each difficulty level
- 🎯 15 levels across 5 grid sizes (3x3 to 7x7):
- 📱 Mobile-friendly design with responsive layout
- ⚡ Fast, client-side only implementation
- 🔄 AI battle simulation mode for testing strategies

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Game Engine**: Phaser 3
- **Styling**: Styled Components
- **Build Tool**: Vite
- **State Management**: Custom game state with React hooks
- **Testing**: Vitest

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── GameBoard.tsx  # Main game board component
│   ├── GameResult.tsx # Game over screen
│   ├── HomeScreen.tsx # Level selection screen
│   └── GameStatus.tsx # Game status panel
├── game/              # Game logic and state management
│   ├── ai/            # AI strategies (Easy, Medium, Hard)
│   ├── scenes/        # Phaser game scenes
│   ├── gameState.ts   # Core game state management
│   ├── hexUtils.ts    # Hexagonal grid utilities
│   ├── levels.ts      # Level configurations
│   ├── progress.ts    # Game progress tracking
│   └── types.ts       # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AndreyAkinshin/hexorius.git
cd hexorius
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run ai-battle` - Run AI vs AI simulation

## 🎮 Game Controls

- Click on your piece to select it
- Valid moves will be highlighted:
  - Green circles: Duplicate moves (adjacent hexes)
  - Magenta circles: Jump moves (within jump distance)
- Click on a highlighted hex to make your move
- Use the top panel buttons to:
  - Change AI difficulty
  - Restart the current level
  - Return to level selection

## 🏗️ Architecture

### Game State Management
- Core game logic is handled by `gameState.ts`
- State updates flow through the Phaser scene to React components
- Progress is persisted in localStorage with separate tracking for each difficulty level

### AI Implementation
- Three difficulty levels with distinct strategies:
  - Easy: Basic evaluation focusing on immediate captures
  - Medium: Intermediate strategy considering territory control and mobility
  - Hard: Advanced minimax algorithm with alpha-beta pruning and deep evaluation
- AI decisions are based on:
  - Piece count and captures
  - Board position and territory control
  - Available moves and mobility
  - Piece clustering and formation

### Rendering
- Phaser handles the game board rendering with:
  - Smooth animations for moves and captures
  - Neon glow effects and visual feedback
  - Responsive hex grid scaling
- React manages the UI components and game flow
- Styled Components provide consistent neon-themed styling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original Hexxagon game concept
- Phaser game framework
- React and TypeScript communities
