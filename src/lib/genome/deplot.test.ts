import { describe, expect, it } from 'vitest';
import { decodeGenome } from './decoder';
import { createTestGenome } from './testUtils';

describe('deplot compatibility test', () => {
  it('keeps decode pipeline callable for deplot-filtered test runs', () => {
    const traits = decodeGenome(createTestGenome(0));

    expect(traits).toBeDefined();
    expect(typeof traits.physical.bodyType).toBe('string');
    expect(traits.physical.primaryColor).toMatch(/^#[0-9A-F]{6}$/i);
  });
});
