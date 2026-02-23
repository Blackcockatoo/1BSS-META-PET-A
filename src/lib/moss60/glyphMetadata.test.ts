import { describe, expect, it } from 'vitest';
import {
  computeGlyphDeterministicHash,
  createGlyphMetadata,
  parseGlyphMetadata,
  serializeGlyphMetadata,
} from './glyphMetadata';

describe('glyph metadata', () => {
  it('serializes and deserializes metadata payloads', () => {
    const metadata = createGlyphMetadata({
      seed: 'alpha-seed',
      scheme: 'Spectral',
      timestamp: '2026-01-01T00:00:00.000Z',
      lineage: [
        {
          fromSeedHash: '1111aaaa',
          toSeedHash: '2222bbbb',
          timestamp: '2026-01-01T00:00:00.000Z',
        },
      ],
    });

    const serialized = serializeGlyphMetadata(metadata);
    const parsed = parseGlyphMetadata(serialized);

    expect(parsed).toEqual(metadata);
    expect(parsed.seedHash.length).toBeGreaterThan(0);
  });

  it('keeps deterministic render hash stable across re-renders', () => {
    const metadata = createGlyphMetadata({
      seed: 'stable-seed',
      scheme: 'Golden',
      timestamp: '2026-01-01T00:00:00.000Z',
    });

    const hash1 = computeGlyphDeterministicHash(metadata);
    const parsed = parseGlyphMetadata(serializeGlyphMetadata(metadata));
    const hash2 = computeGlyphDeterministicHash(parsed);

    expect(hash1).toBe(hash2);
  });
});
