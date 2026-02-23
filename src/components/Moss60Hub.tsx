'use client';

/**
 * Moss60Hub — MOSS60 Quantum-Resistant Cryptographic Platform
 * Tabs: Glyph | QR Cipher | Serpent Protocol | Reality
 *
 * Glyph canvas ported from moss60-ultimate.html
 * Crypto functions reuse src/lib/qr-messaging/crypto.ts
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { QRGenerator } from './QRMessaging/QRGenerator';
import {
  moss60Hash,
  generateKeyPair,
  computeSharedSecret,
  deriveKeys,
  encrypt,
  decrypt,
  PHI,
  PRIMES,
} from '@/lib/qr-messaging/crypto';
import {
  computeGlyphDeterministicHash,
  createGlyphMetadata,
  type GlyphLineageEntry,
  type GlyphMetadata,
  parseGlyphMetadata,
  serializeGlyphMetadata,
} from '@/lib/moss60/glyphMetadata';
import { Download, RefreshCw, Lock, Unlock, Key, Orbit, Layers } from 'lucide-react';
import { CrystallineNetwork } from './CrystallineNetwork';

// ─── Glyph Canvas ─────────────────────────────────────────────────────────────

const COLOR_SCHEMES: Record<string, [string, string][]> = {
  Spectral:      [['#ff6b6b','#48dbfb'], ['#ff9ff3','#00d2d3'], ['#54a0ff','#5f27cd']],
  Golden:        [['#ffd32a','#ff9f43'], ['#ffdd59','#ff6b6b'], ['#ffeaa7','#fdcb6e']],
  Cyberpunk:     [['#00f2fe','#ff00fc'], ['#0abde3','#ee5a24'], ['#00d2d3','#ff6b6b']],
  Consciousness: [['#a29bfe','#55efc4'], ['#fd79a8','#6c5ce7'], ['#00cec9','#a29bfe']],
  Fire:          [['#ff6b6b','#ffeaa7'], ['#ff7675','#fdcb6e'], ['#e17055','#fab1a0']],
  Ocean:         [['#0984e3','#00cec9'], ['#74b9ff','#0abde3'], ['#81ecec','#636e72']],
};

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

function downloadTextFile(filename: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function buildGlyphPoints(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const baseR = Math.min(width, height) * 0.38;

  return Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 2 * Math.PI * PHI;
    const wobble = 1 + 0.12 * Math.sin(i * PHI * 0.5);
    const r = baseR * wobble;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

function buildGlyphSVG(metadata: GlyphMetadata): string {
  const width = 320;
  const height = 320;
  const pairs = COLOR_SCHEMES[metadata.scheme] ?? COLOR_SCHEMES['Spectral'];
  const hashVal = parseInt(metadata.seedHash.slice(0, 4), 16) / 0xffff;
  const points = buildGlyphPoints(width, height);

  const lines = Array.from({ length: 60 }, (_, i) => {
    if (!PRIMES.has(i)) return '';

    return Array.from({ length: 3 }, (_, idx) => {
      const step = idx + 1;
      const j = (i + step * 7) % 60;
      const t = (i / 60 + hashVal) % 1;
      const pairIdx = Math.floor(t * pairs.length) % pairs.length;
      const [ca, cb] = pairs[pairIdx];
      const color = lerpColor(ca, cb, t);
      const alpha = 0.25 + 0.25 * step;
      const lineWidth = step === 1 ? 1.2 : 0.6;

      return `<line x1="${points[i].x.toFixed(3)}" y1="${points[i].y.toFixed(3)}" x2="${points[j].x.toFixed(3)}" y2="${points[j].y.toFixed(3)}" stroke="${color}" stroke-opacity="${alpha.toFixed(3)}" stroke-width="${lineWidth}" />`;
    }).join('');
  }).join('');

  const dots = points.map((point, i) => {
    const isPrime = PRIMES.has(i);
    const t = i / 60;
    const pairIdx = Math.floor(t * pairs.length) % pairs.length;
    const [ca, cb] = pairs[pairIdx];
    const color = lerpColor(ca, cb, t);
    return `<circle cx="${point.x.toFixed(3)}" cy="${point.y.toFixed(3)}" r="${isPrime ? 3 : 1.5}" fill="${color}" fill-opacity="${isPrime ? 0.9 : 0.4}" />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="MOSS60 glyph">
  <metadata>${serializeGlyphMetadata(metadata)}</metadata>
  <rect width="100%" height="100%" fill="#000" />
  <g>${lines}${dots}</g>
</svg>`;
}

function GlyphCanvas({
  seed,
  scheme,
  animating,
  lineage,
  seedHashOverride,
}: {
  seed: string;
  scheme: string;
  animating: boolean;
  lineage?: GlyphLineageEntry[];
  seedHashOverride?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const baseR = Math.min(W, H) * 0.38;

    // Trail effect
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    const pairs = COLOR_SCHEMES[scheme] ?? COLOR_SCHEMES['Spectral'];
    const hash = seedHashOverride ?? (seed ? moss60Hash(seed) : 'deadbeef');
    const hashVal = parseInt(hash.slice(0, 4), 16) / 0xffff;

    // Generate 60 points along a PHI spiral
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 2 * Math.PI * PHI + time * 0.0006;
      const wobble = 1 + 0.12 * Math.sin(i * PHI * 0.5 + time * 0.001);
      const r = baseR * wobble;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }

    // Draw connections between prime-indexed points
    for (let i = 0; i < 60; i++) {
      if (!PRIMES.has(i)) continue;
      for (let step = 1; step <= 3; step++) {
        const j = (i + step * 7) % 60;
        const t = (i / 60 + hashVal) % 1;
        const pairIdx = Math.floor(t * pairs.length) % pairs.length;
        const [ca, cb] = pairs[pairIdx];
        const alpha = 0.15 + 0.55 * Math.abs(Math.sin(time * 0.0008 + i * 0.3));
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = lerpColor(ca, cb, t) ;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = step === 1 ? 1.2 : 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Draw point dots
    for (let i = 0; i < 60; i++) {
      const isPrime = PRIMES.has(i);
      const t = i / 60;
      const pairIdx = Math.floor(t * pairs.length) % pairs.length;
      const [ca, cb] = pairs[pairIdx];
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, isPrime ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = lerpColor(ca, cb, t);
      ctx.globalAlpha = isPrime ? 0.9 : 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }, [seed, scheme, seedHashOverride]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (animating) {
      const loop = (t: number) => {
        timeRef.current = t;
        draw(t);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    } else {
      draw(timeRef.current);
    }
  }, [animating, draw]);

  function makeMetadata(): GlyphMetadata {
    return {
      ...createGlyphMetadata({ seed, scheme, lineage }),
      ...(seedHashOverride ? { seedHash: seedHashOverride } : {}),
    };
  }

  function downloadPNGWithMetadata() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const timestamp = Date.now();
    const baseName = `moss60-glyph-${timestamp}`;
    const a = document.createElement('a');
    a.download = `${baseName}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();

    const metadata = makeMetadata();
    downloadTextFile(`${baseName}.json`, serializeGlyphMetadata(metadata));
  }

  function downloadSVG() {
    const metadata = makeMetadata();
    const svg = buildGlyphSVG(metadata);
    downloadTextFile(`moss60-glyph-${Date.now()}.svg`, svg, 'image/svg+xml');
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="rounded-xl border border-slate-700 bg-black"
      />
      <button
        onClick={downloadPNGWithMetadata}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <Download className="w-3 h-3" /> Save PNG + JSON
      </button>
      <button
        onClick={downloadSVG}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <Download className="w-3 h-3" /> Save SVG
      </button>
    </div>
  );
}

// ─── Serpent Protocol Tab ─────────────────────────────────────────────────────

function SerpentTab() {
  const [seed, setSeed]             = useState('');
  const [myPub, setMyPub]           = useState('');
  const [myPriv, setMyPriv]         = useState<number[]>([]);
  const [partnerPub, setPartnerPub] = useState('');
  const [sharedReady, setSharedReady] = useState(false);
  const [encKey, setEncKey]         = useState<number[]>([]);
  const [decKey, setDecKey]         = useState<number[]>([]);
  const [msgCount, setMsgCount]     = useState(0);
  const [plaintext, setPlaintext]   = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decInput, setDecInput]     = useState('');
  const [decOutput, setDecOutput]   = useState('');

  function genKeys() {
    if (!seed.trim()) return;
    const kp = generateKeyPair(seed.trim());
    setMyPriv(kp.private);
    setMyPub(kp.public);
    setSharedReady(false);
  }

  function handshake() {
    if (!partnerPub.trim() || myPriv.length === 0) return;
    const shared = computeSharedSecret(myPriv, partnerPub.trim());
    const { encryptionKey, decryptionKey } = deriveKeys(shared);
    setEncKey(encryptionKey);
    setDecKey(decryptionKey);
    setSharedReady(true);
  }

  function encryptMsg() {
    if (!sharedReady || !plaintext.trim()) return;
    const ct = encrypt(plaintext, encKey, msgCount);
    setCiphertext(ct);
    setMsgCount(c => c + 1);
  }

  function decryptMsg() {
    if (!sharedReady || !decInput.trim()) return;
    try {
      const pt = decrypt(decInput.trim(), decKey, msgCount > 0 ? msgCount - 1 : 0);
      setDecOutput(pt);
    } catch {
      setDecOutput('⚠ Decryption failed — wrong key or corrupted data');
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">Alice–Bob key exchange. Generate your keypair, share your public key, enter your partner's public key, then encrypt/decrypt messages.</p>

      {/* Step 1 */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
        <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"><Key className="w-3 h-3" /> 1 — Generate Your Keypair</p>
        <div className="flex gap-2">
          <input
            value={seed}
            onChange={e => setSeed(e.target.value)}
            placeholder="Your secret seed phrase..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <Button size="sm" onClick={genKeys} disabled={!seed.trim()}>Generate</Button>
        </div>
        {myPub && (
          <div>
            <p className="text-[10px] text-zinc-500 mb-1">Your Public Key (share this):</p>
            <p className="font-mono text-[10px] text-cyan-300 break-all bg-slate-950/60 p-2 rounded-lg">{myPub.slice(0, 64)}…</p>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
        <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> 2 — Enter Partner's Public Key</p>
        <div className="flex gap-2">
          <input
            value={partnerPub}
            onChange={e => setPartnerPub(e.target.value)}
            placeholder="Paste partner public key..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <Button size="sm" onClick={handshake} disabled={!partnerPub.trim() || myPriv.length === 0}>Handshake</Button>
        </div>
        {sharedReady && <p className="text-xs text-emerald-400">✓ Shared secret established</p>}
      </div>

      {/* Encrypt */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
        <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"><Lock className="w-3 h-3" /> Encrypt</p>
        <textarea
          value={plaintext}
          onChange={e => setPlaintext(e.target.value)}
          placeholder="Message to encrypt..."
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
        <Button size="sm" onClick={encryptMsg} disabled={!sharedReady || !plaintext.trim()} className="w-full">Encrypt</Button>
        {ciphertext && (
          <p className="font-mono text-[10px] text-amber-300 break-all bg-slate-950/60 p-2 rounded-lg">{ciphertext}</p>
        )}
      </div>

      {/* Decrypt */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
        <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"><Unlock className="w-3 h-3" /> Decrypt</p>
        <textarea
          value={decInput}
          onChange={e => setDecInput(e.target.value)}
          placeholder="Paste ciphertext to decrypt..."
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
        <Button size="sm" onClick={decryptMsg} disabled={!sharedReady || !decInput.trim()} className="w-full">Decrypt</Button>
        {decOutput && (
          <p className="text-sm text-emerald-300 bg-slate-950/60 p-2 rounded-lg">{decOutput}</p>
        )}
      </div>
    </div>
  );
}

// ─── Reality Canvas (3D projections) ─────────────────────────────────────────

type Projection = 'flat' | 'sphere' | 'torus' | 'hyperbolic';

function RealityCanvas({ seed, projection }: { seed: string; projection: Projection }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    let rotX = 0;
    let rotY = 0;

    function project(x: number, y: number, z: number): { x: number; y: number; alpha: number } {
      // Apply rotation
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const fov = 400;
      const scale = fov / (fov + z2 + 200);
      return { x: cx + x2 * scale, y: cy + y1 * scale, alpha: 0.3 + 0.7 * scale };
    }

    function flatPoint(i: number, t: number) {
      const angle = (i / 60) * 2 * Math.PI * PHI + t * 0.0006;
      const r = 120 * (1 + 0.12 * Math.sin(i * 0.5));
      return { x: r * Math.cos(angle), y: r * Math.sin(angle), z: 0 };
    }

    function spherePoint(i: number, t: number) {
      const theta = (i / 60) * Math.PI;
      const phi   = (i / 60) * 2 * Math.PI * PHI + t * 0.0006;
      const R = 130;
      return { x: R * Math.sin(theta) * Math.cos(phi), y: R * Math.sin(theta) * Math.sin(phi), z: R * Math.cos(theta) };
    }

    function torusPoint(i: number, t: number) {
      const u = (i / 60) * 2 * Math.PI + t * 0.0006;
      const v = (i / 60) * 2 * Math.PI * 3;
      const R = 90, r = 40;
      return { x: (R + r * Math.cos(v)) * Math.cos(u), y: (R + r * Math.cos(v)) * Math.sin(u), z: r * Math.sin(v) };
    }

    function hyperbolicPoint(i: number, t: number) {
      const angle = (i / 60) * 2 * Math.PI * PHI + t * 0.0006;
      const rPoincare = 0.85 * (1 - 1 / (1 + i / 10));
      const x = rPoincare * Math.cos(angle);
      const y = rPoincare * Math.sin(angle);
      return { x: x * 140, y: y * 140, z: (i / 60 - 0.5) * 60 };
    }

    function getPoint(i: number, t: number) {
      switch (projection) {
        case 'sphere':     return spherePoint(i, t);
        case 'torus':      return torusPoint(i, t);
        case 'hyperbolic': return hyperbolicPoint(i, t);
        default:           return flatPoint(i, t);
      }
    }

    const loop = (time: number) => {
      rotX = time * 0.0003;
      rotY = time * 0.0005;

      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, W, H);

      const pts = Array.from({ length: 60 }, (_, i) => {
        const p3 = getPoint(i, time);
        const p2 = project(p3.x, p3.y, p3.z);
        return p2;
      });

      for (let i = 0; i < 60; i++) {
        if (!PRIMES.has(i)) continue;
        const j = (i + 7) % 60;
        const t = i / 60;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `hsl(${t * 360},70%,60%)`;
        ctx.globalAlpha = (pts[i].alpha + pts[j].alpha) * 0.3;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, PRIMES.has(i) ? 3 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(i / 60) * 360},70%,65%)`;
        ctx.globalAlpha = pts[i].alpha * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [projection, seed]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="rounded-xl border border-slate-700 bg-black mx-auto block"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Moss60Hub() {
  const [activeTab, setActiveTab]   = useState('glyph');
  const [glyphSeed, setGlyphSeed]   = useState('');
  const [scheme, setScheme]         = useState('Spectral');
  const [animating, setAnimating]   = useState(true);
  const [lineage, setLineage]       = useState<GlyphLineageEntry[]>([]);
  const [verifyJson, setVerifyJson] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string; hash?: string } | null>(null);
  const [verifiedMetadata, setVerifiedMetadata] = useState<GlyphMetadata | null>(null);
  const [projection, setProjection] = useState<Projection>('sphere');
  const [realitySeed, setRealitySeed] = useState('');

  useEffect(() => {
    const currentHash = moss60Hash(glyphSeed || '');
    setLineage(previous => {
      const latest = previous[previous.length - 1];
      if (latest?.toSeedHash === currentHash) return previous;

      const fromSeedHash = latest?.toSeedHash ?? currentHash;
      if (fromSeedHash === currentHash && previous.length > 0) return previous;

      const next = [...previous, {
        fromSeedHash,
        toSeedHash: currentHash,
        timestamp: new Date().toISOString(),
      }];

      return next.slice(-8);
    });
  }, [glyphSeed]);

  function verifyGlyphMetadata() {
    try {
      const parsed = parseGlyphMetadata(verifyJson);
      const canonical = serializeGlyphMetadata(parsed);
      const reparsed = parseGlyphMetadata(canonical);
      const hashA = computeGlyphDeterministicHash(parsed);
      const hashB = computeGlyphDeterministicHash(reparsed);

      if (hashA !== hashB) {
        setVerifyResult({ valid: false, message: 'Deterministic hash mismatch after re-serialization.' });
        setVerifiedMetadata(null);
        return;
      }

      setVerifiedMetadata(parsed);
      setVerifyResult({ valid: true, hash: hashA, message: 'Metadata valid. Deterministic render hash is stable.' });
    } catch (error) {
      setVerifiedMetadata(null);
      setVerifyResult({ valid: false, message: error instanceof Error ? error.message : 'Unable to parse metadata JSON.' });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-300" />
          MOSS60
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">Quantum-resistant cryptographic platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="glyph"   className="text-xs py-2">Glyph</TabsTrigger>
          <TabsTrigger value="qr"      className="text-xs py-2">QR</TabsTrigger>
          <TabsTrigger value="serpent" className="text-xs py-2">Serpent</TabsTrigger>
          <TabsTrigger value="reality" className="text-xs py-2">Reality</TabsTrigger>
          <TabsTrigger value="network" className="text-xs py-2">Network</TabsTrigger>
        </TabsList>

        {/* ── Glyph ── */}
        <TabsContent value="glyph" className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input
              value={glyphSeed}
              onChange={e => setGlyphSeed(e.target.value)}
              placeholder="Seed phrase / message..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={scheme}
              onChange={e => setScheme(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.keys(COLOR_SCHEMES).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setAnimating(a => !a)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${animating ? 'animate-spin' : ''}`} />
              {animating ? 'Pause' : 'Animate'}
            </button>
          </div>
          <GlyphCanvas seed={glyphSeed} scheme={scheme} animating={animating} lineage={lineage} />

          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
            <p className="text-xs font-semibold text-zinc-300">Lineage continuity</p>
            {lineage.length === 0 ? (
              <p className="text-xs text-zinc-500">No transitions recorded yet.</p>
            ) : (
              <ul className="space-y-1 text-[11px] text-zinc-400">
                {lineage.slice().reverse().map((entry, idx) => (
                  <li key={`${entry.timestamp}-${idx}`} className="font-mono">
                    {entry.fromSeedHash.slice(0, 8)} → {entry.toSeedHash.slice(0, 8)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 space-y-2">
            <p className="text-xs font-semibold text-zinc-300">Verify Glyph</p>
            <textarea
              value={verifyJson}
              onChange={e => setVerifyJson(e.target.value)}
              rows={6}
              placeholder="Paste exported glyph metadata JSON..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
            />
            <Button size="sm" onClick={verifyGlyphMetadata} disabled={!verifyJson.trim()}>Verify</Button>
            {verifyResult && (
              <p className={`text-xs ${verifyResult.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                {verifyResult.message}
                {verifyResult.hash ? ` (${verifyResult.hash.slice(0, 16)}…)` : ''}
              </p>
            )}
            {verifiedMetadata && (
              <GlyphCanvas
                seed=""
                seedHashOverride={verifiedMetadata.seedHash}
                scheme={verifiedMetadata.scheme}
                animating={false}
                lineage={verifiedMetadata.lineage}
              />
            )}
          </div>
        </TabsContent>

        {/* ── QR Cipher ── */}
        <TabsContent value="qr" className="mt-4">
          <QRGenerator />
        </TabsContent>

        {/* ── Serpent ── */}
        <TabsContent value="serpent" className="mt-4">
          <SerpentTab />
        </TabsContent>

        {/* ── Reality ── */}
        <TabsContent value="reality" className="mt-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={projection}
              onChange={e => setProjection(e.target.value as Projection)}
              className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="flat">Flat Spiral</option>
              <option value="sphere">Sphere</option>
              <option value="torus">Torus</option>
              <option value="hyperbolic">Hyperbolic</option>
            </select>
            <Orbit className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Auto-rotates</span>
          </div>
          <div className="flex gap-2">
            <input
              value={realitySeed}
              onChange={e => setRealitySeed(e.target.value)}
              placeholder="Optional seed..."
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <RealityCanvas seed={realitySeed} projection={projection} />
        </TabsContent>

        {/* ── Network ── */}
        <TabsContent value="network" className="mt-4">
          <CrystallineNetwork />
        </TabsContent>
      </Tabs>
    </div>
  );
}
