import { describe, expect, it } from 'vitest';
import { decodeGenome } from './decoder';
import type { Genome } from './types';

const createTestGenome = (seed: number): Genome => ({
  red60: Array(60)
    .fill(0)
    .map((_, i) => (seed + i) % 7),
  blue60: Array(60)
    .fill(0)
    .map((_, i) => (seed + i + 1) % 7),
  black60: Array(60)
    .fill(0)
    .map((_, i) => (seed + i + 2) % 7),
});

describe('deplot compatibility test', () => {
  it('keeps decode pipeline callable for deplot-filtered test runs', () => {
    const traits = decodeGenome(createTestGenome(0));

    expect(traits).toBeDefined();
    expect(typeof traits.physical.bodyType).toBe('string');
    expect(traits.physical.primaryColor).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
