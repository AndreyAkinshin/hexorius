import { HexCoord, Player } from './types';

export interface LevelConfig {
  name: string;
  slug: string;  // URL-friendly name
  description: string;
  gridSize: number;  // Number of cells from center to edge (radius)
  maxJumpDistance: number;
  startingPositions: {
    player1: [HexCoord, Player][];
    player2: [HexCoord, Player][];
  };
}

export const LEVELS: LevelConfig[] = [
  // Small Grid Levels (3-cell radius) - Beginner Friendly
  {
    name: "First Steps",
    slug: "first-steps",
    description: "A compact introduction to Hexorius basics",
    gridSize: 3,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -2, r: 1 }, 1],
        [{ q: 1, r: -2 }, 1]
      ],
      player2: [
        [{ q: 2, r: -1 }, 2],
        [{ q: -1, r: 2 }, 2]
      ]
    }
  },
  {
    name: "Triangle Formation",
    slug: "triangle-formation",
    description: "Three-piece setup in a tight space",
    gridSize: 3,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -2, r: 1 }, 1],
        [{ q: -1, r: -1 }, 1],
        [{ q: 1, r: -2 }, 1]
      ],
      player2: [
        [{ q: 2, r: -1 }, 2],
        [{ q: 1, r: 1 }, 2],
        [{ q: -1, r: 2 }, 2]
      ]
    }
  },

  // Medium Grid Levels (4-cell radius) - Intermediate
  {
    name: "Classic Square",
    slug: "classic-square",
    description: "Traditional 4-cell layout with balanced positions",
    gridSize: 4,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -3, r: 0 }, 1],
        [{ q: 0, r: -3 }, 1]
      ],
      player2: [
        [{ q: 3, r: 0 }, 2],
        [{ q: 0, r: 3 }, 2]
      ]
    }
  },
  {
    name: "Triple Threat",
    slug: "triple-threat",
    description: "Three pieces in triangular formation",
    gridSize: 4,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -3, r: 0 }, 1],
        [{ q: -1, r: -2 }, 1],
        [{ q: 2, r: -3 }, 1]
      ],
      player2: [
        [{ q: 3, r: 0 }, 2],
        [{ q: 1, r: 2 }, 2],
        [{ q: -2, r: 3 }, 2]
      ]
    }
  },
  {
    name: "Extended Range",
    slug: "extended-range",
    description: "Standard grid with longer jump distance",
    gridSize: 4,
    maxJumpDistance: 3,
    startingPositions: {
      player1: [
        [{ q: -3, r: 0 }, 1],
        [{ q: 0, r: -3 }, 1],
        [{ q: -2, r: -1 }, 1]
      ],
      player2: [
        [{ q: 3, r: 0 }, 2],
        [{ q: 0, r: 3 }, 2],
        [{ q: 2, r: 1 }, 2]
      ]
    }
  },

  // Large Grid Levels (5-cell radius) - Advanced
  {
    name: "Star Points",
    slug: "star-points",
    description: "Five-cell grid with strategic corner positions",
    gridSize: 5,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -4, r: 0 }, 1],
        [{ q: 0, r: -4 }, 1]
      ],
      player2: [
        [{ q: 4, r: 0 }, 2],
        [{ q: 0, r: 4 }, 2]
      ]
    }
  },
  {
    name: "Triple Star",
    slug: "triple-star",
    description: "Three-piece setup in a larger arena",
    gridSize: 5,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -4, r: 0 }, 1],
        [{ q: -2, r: -2 }, 1],
        [{ q: 1, r: -4 }, 1]
      ],
      player2: [
        [{ q: 4, r: 0 }, 2],
        [{ q: 2, r: 2 }, 2],
        [{ q: -1, r: 4 }, 2]
      ]
    }
  },
  {
    name: "Long Range",
    slug: "long-range",
    description: "Extended jump distance in a large space",
    gridSize: 5,
    maxJumpDistance: 3,
    startingPositions: {
      player1: [
        [{ q: -4, r: 0 }, 1],
        [{ q: -2, r: -2 }, 1],
        [{ q: 1, r: -4 }, 1]
      ],
      player2: [
        [{ q: 4, r: 0 }, 2],
        [{ q: 2, r: 2 }, 2],
        [{ q: -1, r: 4 }, 2]
      ]
    }
  },

  // Extra Large Grid Levels (6-cell radius) - Expert
  {
    name: "Grand Arena",
    slug: "grand-arena",
    description: "Spacious battlefield with multiple pieces",
    gridSize: 6,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -5, r: 0 }, 1],
        [{ q: -3, r: -2 }, 1],
        [{ q: 0, r: -5 }, 1]
      ],
      player2: [
        [{ q: 5, r: 0 }, 2],
        [{ q: 3, r: 2 }, 2],
        [{ q: 0, r: 5 }, 2]
      ]
    }
  },
  {
    name: "Four Corners",
    slug: "four-corners",
    description: "Four pieces spread across the board",
    gridSize: 6,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -5, r: 0 }, 1],
        [{ q: -3, r: -2 }, 1],
        [{ q: 0, r: -5 }, 1],
        [{ q: 2, r: -3 }, 1]
      ],
      player2: [
        [{ q: 5, r: 0 }, 2],
        [{ q: 3, r: 2 }, 2],
        [{ q: 0, r: 5 }, 2],
        [{ q: -2, r: 3 }, 2]
      ]
    }
  },
  {
    name: "Strategic Jump",
    slug: "strategic-jump",
    description: "Extended range with multiple pieces",
    gridSize: 6,
    maxJumpDistance: 3,
    startingPositions: {
      player1: [
        [{ q: -5, r: 0 }, 1],
        [{ q: -2, r: -3 }, 1],
        [{ q: 1, r: -5 }, 1]
      ],
      player2: [
        [{ q: 5, r: 0 }, 2],
        [{ q: 2, r: 3 }, 2],
        [{ q: -1, r: 5 }, 2]
      ]
    }
  },

  // Maximum Grid Levels (7-cell radius) - Master
  {
    name: "Master Arena",
    slug: "master-arena",
    description: "Massive board with strategic positioning",
    gridSize: 7,
    maxJumpDistance: 2,
    startingPositions: {
      player1: [
        [{ q: -6, r: 0 }, 1],
        [{ q: -3, r: -3 }, 1],
        [{ q: 0, r: -6 }, 1]
      ],
      player2: [
        [{ q: 6, r: 0 }, 2],
        [{ q: 3, r: 3 }, 2],
        [{ q: 0, r: 6 }, 2]
      ]
    }
  },
  {
    name: "Grand Master",
    slug: "grand-master",
    description: "Complex setup with extended jump range",
    gridSize: 7,
    maxJumpDistance: 3,
    startingPositions: {
      player1: [
        [{ q: -6, r: 0 }, 1],
        [{ q: -4, r: -2 }, 1],
        [{ q: -2, r: -4 }, 1],
        [{ q: 0, r: -6 }, 1]
      ],
      player2: [
        [{ q: 6, r: 0 }, 2],
        [{ q: 4, r: 2 }, 2],
        [{ q: 2, r: 4 }, 2],
        [{ q: 0, r: 6 }, 2]
      ]
    }
  },
  {
    name: "Ultimate Challenge",
    slug: "ultimate-challenge",
    description: "Maximum complexity with long-range jumps",
    gridSize: 7,
    maxJumpDistance: 4,
    startingPositions: {
      player1: [
        [{ q: -6, r: 0 }, 1],
        [{ q: -3, r: -3 }, 1],
        [{ q: 0, r: -6 }, 1],
        [{ q: 3, r: -6 }, 1]
      ],
      player2: [
        [{ q: 6, r: 0 }, 2],
        [{ q: 3, r: 3 }, 2],
        [{ q: 0, r: 6 }, 2],
        [{ q: -3, r: 6 }, 2]
      ]
    }
  },
  {
    name: "Legend",
    slug: "legend",
    description: "The ultimate test of skill and strategy",
    gridSize: 7,
    maxJumpDistance: 4,
    startingPositions: {
      player1: [
        [{ q: -6, r: 0 }, 1],
        [{ q: -4, r: -2 }, 1],
        [{ q: -2, r: -4 }, 1],
        [{ q: 0, r: -6 }, 1],
        [{ q: 2, r: -6 }, 1]
      ],
      player2: [
        [{ q: 6, r: 0 }, 2],
        [{ q: 4, r: 2 }, 2],
        [{ q: 2, r: 4 }, 2],
        [{ q: 0, r: 6 }, 2],
        [{ q: -2, r: 6 }, 2]
      ]
    }
  }
]; 