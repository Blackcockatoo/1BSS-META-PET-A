# Crystalline Network (MOSS60)

## Where it lives

- Core implementation: `src/components/CrystallineNetwork.tsx`
- Mounted in the MOSS60 hub under the **Network** tab: `src/components/Moss60Hub.tsx`

## How it is implemented (architecture)

### 1) Build a 60-node small-world graph

`buildNetwork(dna?)` constructs the graph in layers:

- **Base ring-lattice**: each node connects to ±1, ±2, ±3 neighbors.
- **Watts–Strogatz rewiring** (`beta`), optionally DNA-modulated per node.
- **Prime-distance shortcut bridges** (`7, 11, 13, 17, 19, 23`), also DNA-modulated when present.

### 2) Precompute graph intelligence

Still inside `buildNetwork`:

- **Floyd–Warshall** all-pairs shortest paths (`dist`).
- **Betweenness centrality** normalization for node sizing/glow.
- **Clustering coefficient** + summary metrics (average path, diameter, edge count).

### 3) Add DNA determinism

When `dna` is passed, the component hashes DNA into a seed and uses deterministic RNG:

- Seeded RNG + DNA hash helper functions.
- `buildNetwork(dna)` uses seeded RNG instead of `Math.random` to produce repeatable topology per genome.
- Initial node placement is also seeded by DNA (repeatable visual layout).

### 4) Simulate crystallization (annealing)

The RAF loop runs physics + annealing:

- Force-directed physics step (repulsion, springs, gravity, damping).
- Temperature decays exponentially; below threshold the network flips to crystallized state and flashes.
- Particle flow animates over shortest paths; path tracing can be explored in the interactive path mode.

### 5) Render modes + controls

UI provides three modes (`flow`, `4d`, `paths`), crystallize/scatter controls, and live stats pills.

- Mode toggles, controls, and stats are implemented in `CrystallineNetwork` component state and JSX.

## Reuse in another screen

If you want this elsewhere in the app:

```tsx
import { CrystallineNetwork } from './CrystallineNetwork';

<CrystallineNetwork dna={some60DigitString} />
```

This is how `Moss60Hub` wires it with `DNA_R.join('')`.

If you do not have DNA yet:

```tsx
<CrystallineNetwork />
```

Without `dna`, it falls back to non-deterministic random topology.
