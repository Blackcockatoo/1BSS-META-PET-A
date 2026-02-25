import type { Genome } from './types';

export const createTestGenome = (seed: number): Genome => ({
  red60: Array.from({ length: 60 }, (_, i) => (seed + i) % 7),
  blue60: Array.from({ length: 60 }, (_, i) => (seed + i + 1) % 7),
  black60: Array.from({ length: 60 }, (_, i) => (seed + i + 2) % 7),
});
