import { Scene } from 'phaser';
import { GameState, HexCoord, HexMetrics, Player } from '../types';
import { hexToPixel, getHexCorners, hexToString, hexDistance } from '../hexUtils';
import { createInitialState, getValidMoves, makeMove, hasValidMoves } from '../gameState';
import { AIStrategyFactory, Difficulty } from '../ai/AIStrategyFactory';

const BASE_HEX_SIZE = 32;

const COLORS = {
  board: {
    empty: {
      fill: 0x2a1f2a,    // Slightly lighter dark purple background for better contrast
      stroke: 0x330033   // Darker purple outline
    }
  },
  player1: {
    fill: 0xff0066,      // Neon pink
    stroke: 0xff1a75,    // Lighter neon pink
    glow: 0xff80b3      // Soft pink glow
  },
  player2: {
    fill: 0x00ffff,      // Neon cyan
    stroke: 0x33ffff,    // Lighter cyan
    glow: 0x80ffff      // Soft cyan glow
  },
  validMove: {
    adjacent: {
      fill: 0x00ff66,    // Neon green
      stroke: 0x33ff99   // Lighter neon green
    },
    jump: {
      fill: 0xff00ff,    // Neon magenta
      stroke: 0xff33ff   // Lighter neon magenta
    }
  },
  selected: {
    stroke: 0xffff00,    // Neon yellow
    glow: 0xffff66      // Bright yellow glow
  }
};

const ANIMATION_DURATION = 200;  // Faster animations
const HOVER_SCALE = 1.1;        // More noticeable hover
const GLOW_INTENSITY = 0.5;     // Stronger glow

export class GameScene extends Scene {
  private gameState!: GameState;
  private hexGraphics!: Phaser.GameObjects.Graphics;
  private glowGraphics!: Phaser.GameObjects.Graphics;
  private pawnsContainer!: Phaser.GameObjects.Container;
  private onStateChange?: (state: GameState) => void;
  private isComputerThinking: boolean = false;
  private isAnimating: boolean = false;
  private aiDifficulty: Difficulty = 'medium';
  private aiStrategy = AIStrategyFactory.getInstance().getStrategy('medium');
  private currentLevel: number = 0;
  private metrics!: HexMetrics;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data?: { gameState?: GameState; level?: number }) {
    this.currentLevel = data?.level ?? 0;
    this.gameState = data?.gameState || createInitialState(this.currentLevel);
    this.updateMetrics();
  }

  private updateMetrics() {
    const gridSize = this.gameState.level.gridSize;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Calculate the maximum number of hexes in both dimensions
    const hexesHorizontal = gridSize * 2 + 1;  // Maximum hexes in a row
    const hexesVertical = gridSize * 2 + 1;    // Maximum hexes in a column
    
    // Calculate the maximum possible hex size that would fit in both dimensions
    // For width: Need to account for the 3/2 overlap of hexes horizontally
    const maxSizeByWidth = width / (hexesHorizontal * 1.5);
    // For height: Need to account for the vertical spacing between rows
    const maxSizeByHeight = height / (hexesVertical * Math.sqrt(3));
    
    // Take the smaller of the two constraints and add a small margin
    const size = Math.min(maxSizeByWidth, maxSizeByHeight) * 0.85;
    
    this.metrics = {
      size,
      width: size * 2,
      height: Math.sqrt(3) * size,
      vertDist: Math.sqrt(3) * size,
      horizDist: size * 3/2
    };
  }

  create() {
    // Create layers for different visual elements
    this.glowGraphics = this.add.graphics();
    this.hexGraphics = this.add.graphics();
    this.pawnsContainer = this.add.container(0, 0);

    // Position everything in the center
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    // Create a container for the entire game board
    const boardContainer = this.add.container(centerX, centerY);
    boardContainer.add(this.glowGraphics);
    boardContainer.add(this.hexGraphics);
    boardContainer.add(this.pawnsContainer);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const localPoint = boardContainer.getLocalPoint(pointer.x, pointer.y);
        this.handleClick(localPoint.x, localPoint.y);
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        const localPoint = boardContainer.getLocalPoint(pointer.x, pointer.y);
        this.handleHover(localPoint.x, localPoint.y);
    });

    this.drawBoard();
    this.createPawns();

    // Add subtle floating animation
    this.tweens.add({
        targets: boardContainer,
        y: centerY + 2,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
  }

  private createPawns() {
    // Clear existing pawns
    this.pawnsContainer.removeAll(true);

    // Create pawns for each occupied hex
    this.gameState.board.forEach((hex, key) => {
      if (hex.player) {
        const pixelPos = hexToPixel(hex, this.metrics);
        const pawn = this.createPawn(hex.player, pixelPos.x, pixelPos.y);
        pawn.setData('hexKey', key);
        this.pawnsContainer.add(pawn);
      }
    });
  }

  private createPawn(player: number, x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const colors = player === 1 ? COLORS.player1 : COLORS.player2;
    
    const graphics = this.add.graphics();
    const size = this.metrics.size * 0.6;
    
    graphics.fillStyle(colors.fill);
    graphics.fillCircle(0, 0, size);
    
    graphics.lineStyle(2.5, colors.stroke);
    graphics.strokeCircle(0, 0, size);
    
    const eyeSize = size * 0.20;
    const eyeOffset = size * 0.25;
    graphics.fillStyle(0x000000);
    graphics.fillCircle(-eyeOffset, -eyeOffset * 0.5, eyeSize);
    graphics.fillCircle(eyeOffset, -eyeOffset * 0.5, eyeSize);
    
    const mouthSize = size * 0.5;
    const mouthOffset = size * 0.2;
    graphics.lineStyle(2, 0x000000);
    
    if (player === 1) {
      graphics.beginPath();
      graphics.arc(0, mouthOffset, mouthSize * 0.6, 0, Math.PI, false);
      graphics.strokePath();
    } else {
      graphics.beginPath();
      graphics.arc(0, mouthOffset * 2, mouthSize * 0.6, Math.PI, Math.PI * 2, false);
      graphics.strokePath();
    }

    container.add(graphics);
    container.setInteractive(new Phaser.Geom.Circle(0, 0, size), Phaser.Geom.Circle.Contains);
    
    // Add snappy hover effect
    container.on('pointerover', () => {
        this.tweens.add({
            targets: container,
            scaleX: HOVER_SCALE,
            scaleY: HOVER_SCALE,
            duration: ANIMATION_DURATION / 2,
            ease: 'Back.Out'
        });
    });
    
    container.on('pointerout', () => {
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: ANIMATION_DURATION / 2,
            ease: 'Back.Out'
        });
    });

    return container;
  }

  private animateMove(fromHex: HexCoord, toHex: HexCoord, isDuplicate: boolean = false, player: Player): Promise<void> {
    return new Promise((resolve) => {
      const fromPos = hexToPixel(fromHex, this.metrics);
      const toPos = hexToPixel(toHex, this.metrics);
      
      if (isDuplicate) {
        // Create a new pawn at the source position
        const sourcePawn = this.createPawn(player, fromPos.x, fromPos.y);
        this.pawnsContainer.add(sourcePawn);
        
        // Create and animate the duplicated pawn
        const newPawn = this.createPawn(player, fromPos.x, fromPos.y);
        this.pawnsContainer.add(newPawn);
        
        // Scale up animation for the new pawn
        newPawn.setScale(0);
        this.tweens.add({
          targets: newPawn,
          scale: 1,
          duration: ANIMATION_DURATION / 2,
          ease: 'Back.out'
        });
        
        // Move animation for the duplicated pawn
        this.tweens.add({
          targets: newPawn,
          x: toPos.x,
          y: toPos.y,
          duration: ANIMATION_DURATION,
          ease: 'Cubic.out',
          onComplete: () => resolve()
        });
      } else {
        // Find the pawn at the source position
        const pawn = this.findPawnAtHex(fromHex);
        if (pawn) {
          // Move animation
          this.tweens.add({
            targets: pawn,
            x: toPos.x,
            y: toPos.y,
            duration: ANIMATION_DURATION,
            ease: 'Cubic.out',
            onComplete: () => resolve()
          });
        } else {
          resolve();
        }
      }
    });
  }

  private findPawnAtHex(hex: HexCoord): Phaser.GameObjects.Container | undefined {
    const hexKey = hexToString(hex);
    return this.pawnsContainer.list.find(
      (pawn) => pawn.getData('hexKey') === hexKey
    ) as Phaser.GameObjects.Container;
  }

  private async handleMove(fromHex: HexCoord, toHex: HexCoord) {
    if (this.isComputerThinking || this.isAnimating) return;
    this.isAnimating = true;

    try {
      // Calculate if this is a duplicate move based on hex distance
      const isDuplicate = hexDistance(fromHex, toHex) === 1;
      const currentPlayer = this.gameState.currentPlayer;
      console.log("distance", hexDistance(fromHex, toHex));

      // First update the game state
      const newState = makeMove(this.gameState, fromHex, toHex);
      this.gameState = newState;
      this.notifyStateChange();

      // Then animate the move
      await this.animateMove(fromHex, toHex, isDuplicate, currentPlayer);
      
      // Update the visual state after animation
      this.drawBoard();
      this.createPawns();

      // Check if the game is over
      if (!hasValidMoves(this.gameState)) {
        this.notifyStateChange();
        return;
      }

      // Handle computer's turn
      if (this.gameState.currentPlayer === 2) {
        await this.makeComputerMove();
      }
    } finally {
      this.isAnimating = false;
    }
  }

  private async makeComputerMove() {
    if (this.isComputerThinking) return;
    
    try {
      this.isComputerThinking = true;
      const computerMove = this.aiStrategy.findBestMove(this.gameState);
      
      if (computerMove) {
        const isDuplicate = hexDistance(computerMove.from, computerMove.to) === 1;
        const currentPlayer = this.gameState.currentPlayer;
        const newState = makeMove(this.gameState, computerMove.from, computerMove.to);
        this.gameState = newState;
        this.notifyStateChange();

        await this.animateMove(computerMove.from, computerMove.to, isDuplicate, currentPlayer);
        this.drawBoard();
        this.createPawns();
        this.notifyStateChange();
      }
    } finally {
      this.isComputerThinking = false;
    }
  }

  private async handleClick(x: number, y: number) {
    if (this.isComputerThinking || this.isAnimating || this.gameState.currentPlayer === 2) {
      return;
    }

    // Find clicked hex
    const clickedHex = this.pixelToHex(x, y);
    if (!clickedHex) return;

    const hexKey = hexToString(clickedHex);
    const hex = this.gameState.board.get(hexKey);
    if (!hex) return;

    if (hex.player === this.gameState.currentPlayer) {
      // Select the hex and show valid moves
      this.gameState = {
        ...this.gameState,
        selectedHex: clickedHex,
        validMoves: getValidMoves(this.gameState, clickedHex)
      };
      this.drawBoard();
      this.notifyStateChange();
    } else if (
      this.gameState.selectedHex && 
      this.gameState.validMoves.some(move => move.q === clickedHex.q && move.r === clickedHex.r)
    ) {
      // Make the move
      await this.handleMove(this.gameState.selectedHex, clickedHex);
    }
  }

  private handleHover(x: number, y: number) {
    const hoveredHex = this.pixelToHex(x, y);
    if (!hoveredHex) return;

    const hexKey = hexToString(hoveredHex);
    const hex = this.gameState.board.get(hexKey);

    if (!hex) return;

    // Update glow effects based on hover state
    this.drawBoard(hoveredHex);
  }

  setStateChangeHandler(handler: (state: GameState) => void) {
    this.onStateChange = handler;
  }

  private updateGameState(newState: GameState) {
    this.gameState = newState;
    this.drawBoard();
    this.createPawns();
    this.notifyStateChange();
  }

  private pixelToHex(x: number, y: number): HexCoord | null {
    // Simple distance-based hex detection
    let closestHex: HexCoord | null = null;
    let closestDist = Number.MAX_VALUE;

    this.gameState.board.forEach((hex) => {
      const pixelPos = hexToPixel(hex, this.metrics);
      const dist = Math.sqrt(Math.pow(x - pixelPos.x, 2) + Math.pow(y - pixelPos.y, 2));
      if (dist < closestDist && dist < this.metrics.size) {
        closestDist = dist;
        closestHex = hex;
      }
    });

    return closestHex;
  }

  private drawBoard(highlightHex?: HexCoord) {
    this.glowGraphics.clear();
    this.hexGraphics.clear();

    // First draw all hex cells
    this.gameState.board.forEach((hex) => {
        const pixelPos = hexToPixel(hex, this.metrics);
        const corners = getHexCorners(pixelPos, this.metrics.size);
        
        // Draw hex base with fill color
        let fillColor = COLORS.board.empty.fill;
        if (hex.player === 1) {
            fillColor = COLORS.player1.fill;
        } else if (hex.player === 2) {
            fillColor = COLORS.player2.fill;
        }

        // Lighten the fill color if this is the selected hex
        if (this.gameState.selectedHex &&
            this.gameState.selectedHex.q === hex.q &&
            this.gameState.selectedHex.r === hex.r) {
            // Convert hex color to RGB components
            const r = (fillColor >> 16) & 0xFF;
            const g = (fillColor >> 8) & 0xFF;
            const b = fillColor & 0xFF;
            // Lighten each component by 20%
            const lightenedColor = (
                (Math.min(r + 51, 255) << 16) |
                (Math.min(g + 51, 255) << 8) |
                Math.min(b + 51, 255)
            );
            fillColor = lightenedColor;
        }

        // Draw hex with fill
        this.hexGraphics.lineStyle(1, COLORS.board.empty.stroke, 0.3);
        this.hexGraphics.fillStyle(fillColor, 0.3);  // Reduced opacity for the fill
        this.hexGraphics.beginPath();
        this.hexGraphics.moveTo(corners[0].x, corners[0].y);
        corners.slice(1).forEach(corner => {
            this.hexGraphics.lineTo(corner.x, corner.y);
        });
        this.hexGraphics.closePath();
        this.hexGraphics.fillPath();
        this.hexGraphics.strokePath();

        // Draw circle for occupied cells
        if (hex.player) {
            const colors = hex.player === 1 ? COLORS.player1 : COLORS.player2;
            const circleSize = this.metrics.size * 0.6;

            // Draw glow effect
            this.glowGraphics.lineStyle(4, colors.glow, 0.4);
            this.glowGraphics.beginPath();
            this.glowGraphics.arc(pixelPos.x, pixelPos.y, circleSize + 4, 0, Math.PI * 2);
            this.glowGraphics.strokePath();

            // Draw base circle
            this.hexGraphics.lineStyle(0, 0x000000, 1);
            this.hexGraphics.fillStyle(colors.fill);
            this.hexGraphics.beginPath();
            this.hexGraphics.arc(pixelPos.x, pixelPos.y, circleSize, 0, Math.PI * 2);
            this.hexGraphics.closePath();
            this.hexGraphics.fillPath();

            // Draw circle outline
            this.hexGraphics.lineStyle(2, colors.stroke);
            this.hexGraphics.beginPath();
            this.hexGraphics.arc(pixelPos.x, pixelPos.y, circleSize, 0, Math.PI * 2);
            this.hexGraphics.closePath();
            this.hexGraphics.strokePath();
        }

        // Draw highlight for hovered hex
        if (highlightHex && 
            highlightHex.q === hex.q && 
            highlightHex.r === hex.r) {
            const highlightColor = hex.player ? 
                (hex.player === 1 ? COLORS.player1.stroke : COLORS.player2.stroke) : 
                COLORS.selected.stroke;
            
            this.hexGraphics.lineStyle(2, highlightColor);
            this.hexGraphics.beginPath();
            this.hexGraphics.moveTo(corners[0].x, corners[0].y);
            corners.forEach(corner => {
                this.hexGraphics.lineTo(corner.x, corner.y);
            });
            this.hexGraphics.closePath();
            this.hexGraphics.strokePath();
        }
    });

    // Then draw valid move indicators
    if (this.gameState.selectedHex) {
        this.gameState.validMoves.forEach(move => {
            const pixelPos = hexToPixel(move, this.metrics);
            const fromPos = hexToPixel(this.gameState.selectedHex!, this.metrics);
            
            // Calculate distance to determine if it's an adjacent move or jump
            const distance = Math.sqrt(
                Math.pow(pixelPos.x - fromPos.x, 2) + 
                Math.pow(pixelPos.y - fromPos.y, 2)
            );
            const isAdjacent = distance <= this.metrics.width * 1.1;
            
            const colors = isAdjacent ? COLORS.validMove.adjacent : COLORS.validMove.jump;
            const circleSize = this.metrics.size * 0.3;  // Size of the indicator circle
            
            // Draw glow effect for valid moves
            this.glowGraphics.lineStyle(4, colors.stroke, 0.3);
            this.glowGraphics.beginPath();
            this.glowGraphics.arc(pixelPos.x, pixelPos.y, circleSize + 4, 0, Math.PI * 2);
            this.glowGraphics.strokePath();
            
            // Draw indicator circle
            this.hexGraphics.lineStyle(2, colors.stroke);
            this.hexGraphics.fillStyle(colors.fill);
            this.hexGraphics.beginPath();
            this.hexGraphics.arc(pixelPos.x, pixelPos.y, circleSize, 0, Math.PI * 2);
            this.hexGraphics.closePath();
            this.hexGraphics.fillPath();
            this.hexGraphics.strokePath();
        });
    }
  }

  setLevel(levelIndex: number) {
    this.currentLevel = levelIndex;
    this.gameState = createInitialState(levelIndex);
    this.updateMetrics();
    this.drawBoard();
    this.createPawns();
    this.notifyStateChange();
  }

  setDifficulty(difficulty: Difficulty) {
    this.aiDifficulty = difficulty;
    this.aiStrategy = AIStrategyFactory.getInstance().getStrategy(difficulty);
  }

  restartGame() {
    this.gameState = createInitialState(this.currentLevel);
    this.drawBoard();
    this.createPawns();
    this.notifyStateChange();
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.gameState);
    }
  }
} 