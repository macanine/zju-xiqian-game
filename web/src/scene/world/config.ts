import { Vector3 } from "three";

export function terrainHeight(x: number, z: number): number {
  const broad = Math.sin(x * 0.105 + z * 0.035) * 0.55;
  const folds = Math.sin(x * 0.31 - z * 0.12) * 0.18;
  const valley = -Math.exp(-((x - 1) ** 2) / 92 - ((z + 12) ** 2) / 520) * 0.95;
  const southernRise = Math.max(0, (-z - 21) / 38) * 0.42;
  return -1.38 + broad + folds + valley + southernRise;
}

export const routePoints = [
  new Vector3(0, terrainHeight(0, 17) + 0.2, 17),
  new Vector3(0.8, terrainHeight(0.8, 9) + 0.22, 9),
  new Vector3(-2.6, terrainHeight(-2.6, 1) + 0.24, 1),
  new Vector3(-7.8, terrainHeight(-7.8, -7.5) + 0.22, -7.5),
  new Vector3(-4.2, terrainHeight(-4.2, -16) + 0.24, -16),
  new Vector3(3.8, terrainHeight(3.8, -25) + 0.25, -25),
  new Vector3(10, terrainHeight(10, -35) + 0.24, -35),
  new Vector3(3.5, terrainHeight(3.5, -45) + 0.26, -45),
];

// A visual river valley runs beside the route. It gives the journey a changing
// horizon and lets the terrain read as a landscape instead of one continuous
// trail surface.
export const riverPoints = [
  new Vector3(8.5, terrainHeight(8.5, 17) + 0.03, 17),
  new Vector3(8, terrainHeight(8, 10) + 0.03, 10),
  new Vector3(5, terrainHeight(5, 2) + 0.03, 2),
  new Vector3(0, terrainHeight(0, -7) + 0.03, -7),
  new Vector3(-1, terrainHeight(-1, -16) + 0.03, -16),
  new Vector3(5, terrainHeight(5, -25) + 0.03, -25),
  new Vector3(12, terrainHeight(12, -35) + 0.03, -35),
  new Vector3(8, terrainHeight(8, -45) + 0.03, -45),
];

export function seeded(index: number): number {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}
