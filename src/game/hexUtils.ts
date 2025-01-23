import { HexCoord, HexMetrics } from './types';

// Convert axial coordinates to pixel coordinates
export function hexToPixel(hex: HexCoord, metrics: HexMetrics): { x: number; y: number } {
  // Flat-topped hexagon coordinate calculation
  const x = metrics.size * (3/2 * hex.q);
  // Adjust y-coordinate to center properly
  const y = metrics.size * (Math.sqrt(3) * (hex.r + hex.q/2));
  return { x, y };
}

// Get the coordinates of the six corners of a hexagon
export function getHexCorners(center: { x: number; y: number }, size: number): Array<{ x: number; y: number }> {
  const corners = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    corners.push({
      x: center.x + size * Math.cos(angle),
      y: center.y + size * Math.sin(angle)
    });
  }
  return corners;
}

// Get neighboring coordinates for a hex
export function getNeighbors(hex: HexCoord): HexCoord[] {
  const directions = [
    { q: 1, r: -1 }, { q: 1, r: 0 }, { q: 0, r: 1 },
    { q: -1, r: 1 }, { q: -1, r: 0 }, { q: 0, r: -1 }
  ];
  
  return directions.map(dir => ({
    q: hex.q + dir.q,
    r: hex.r + dir.r
  }));
}

// Get coordinates for jump moves (distance 2)
export function getJumpNeighbors(hex: HexCoord): HexCoord[] {
  const directions = [
    { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 },
    { q: 1, r: 1 }, { q: 0, r: 2 }, { q: -1, r: 2 },
    { q: -2, r: 2 }, { q: -2, r: 1 }, { q: -2, r: 0 },
    { q: -1, r: -1 }, { q: 0, r: -2 }, { q: 1, r: -2 }
  ];
  
  return directions.map(dir => ({
    q: hex.q + dir.q,
    r: hex.r + dir.r
  }));
}

// Convert hex coordinates to string key for Map storage
export function hexToString(hex: HexCoord): string {
  return `${hex.q},${hex.r}`;
}

// Convert string key back to hex coordinates
export function stringToHex(str: string): HexCoord {
  const [q, r] = str.split(',').map(Number);
  return { q, r };
}

// Check if two hex coordinates are equal
export function hexEquals(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

// Calculate the distance between two hexes
export function hexDistance(a: HexCoord, b: HexCoord): number {
  // In axial coordinates, s = -q-r
  // Distance is max absolute difference among all three coordinates
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs((-a.q - a.r) - (-b.q - b.r))
  );
}
