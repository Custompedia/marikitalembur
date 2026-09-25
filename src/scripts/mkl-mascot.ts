// MKL mascot: a voxel cube character drawn on a plain 2D canvas (no WebGL, no dependencies).

export type MascotState = 'default' | 'working' | 'sleeping';

export interface MascotOptions {
  state: MascotState;
  size: number;
  color: string;
  ink: string;
  speed: number;
  turn: number;
  interactive: boolean;
  paused: boolean;
  seed: number;
  jumpEvery: number;
}

const DEFAULTS: MascotOptions = {
  state: 'default',
  size: 160,
  color: '#A3E635',
  ink: '#FFFFFF',
  speed: 1,
  turn: 1,
  interactive: true,
  paused: false,
  seed: 0,
  jumpEvery: 8,
};

const LABELS: Record<MascotState, string> = {
  default: 'Maskot MKL sedang santai',
  working: 'Maskot MKL sedang bekerja',
  sleeping: 'Maskot MKL sedang tidur',
};

type Vec3 = [number, number, number];
type Lin = [number, number, number, number, number, number, number, number, number];
// Row-major 3x3 linear part followed by translation.
type Affine = [number, number, number, number, number, number, number, number, number, number, number, number];
type Material = 'body' | 'arm' | 'leg' | 'ink';

// Linear shading overlay in model space: `color` at alpha a0 at `from`, fading to a1 at `to`.
interface Grad {
  from: Vec3;
  to: Vec3;
  a0: number;
  a1: number;
  color: 'black' | 'white';
}

interface Face {
  v: [Vec3, Vec3, Vec3, Vec3];
  n: Vec3;
  mat: Material;
  bias: number;
  alpha: number;
  tone: number;
  grads: Grad[];
  rim: number; // alpha of the white highlight on camera-facing top edges; 0 for none
}

interface ScreenGrad {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  a0: number;
  a1: number;
  rgb: string;
}

interface DrawItem {
  pts: number[];
  depth: number;
  fill: string;
  alpha: number;
  grads: ScreenGrad[];
  rimEdges: number[];
  rimAlpha: number;
}

type PartKey = 'body' | 'armR' | 'armL' | 'legR' | 'legL';

const UNITS = 26; // model units across the canvas width
const CAM_PITCH = 0.14;
const CAM_DIST = 80;
const CENTER: Vec3 = [0, 3.25, 0];
const GROUND_Y = -4.5;
const FRONT_Z = 4.53;
const SIDE_X = 6.03;

const IDENT: Affine = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

function mul(a: Affine, b: Affine): Affine {
  return [
    a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    a[0] * b[9] + a[1] * b[10] + a[2] * b[11] + a[9],
    a[3] * b[9] + a[4] * b[10] + a[5] * b[11] + a[10],
    a[6] * b[9] + a[7] * b[10] + a[8] * b[11] + a[11],
  ];
}

function chain(...ms: Affine[]): Affine {
  return ms.reduce((acc, m) => mul(acc, m), IDENT);
}

function about(l: Lin, p: Vec3): Affine {
  return [
    ...l,
    p[0] - (l[0] * p[0] + l[1] * p[1] + l[2] * p[2]),
    p[1] - (l[3] * p[0] + l[4] * p[1] + l[5] * p[2]),
    p[2] - (l[6] * p[0] + l[7] * p[1] + l[8] * p[2]),
  ];
}

const rotX = (a: number, p: Vec3): Affine => { const c = Math.cos(a), s = Math.sin(a); return about([1, 0, 0, 0, c, -s, 0, s, c], p); };
const rotY = (a: number, p: Vec3): Affine => { const c = Math.cos(a), s = Math.sin(a); return about([c, 0, s, 0, 1, 0, -s, 0, c], p); };
const rotZ = (a: number, p: Vec3): Affine => { const c = Math.cos(a), s = Math.sin(a); return about([c, -s, 0, s, c, 0, 0, 0, 1], p); };
const scale = (x: number, y: number, z: number, p: Vec3): Affine => about([x, 0, 0, 0, y, 0, 0, 0, z], p);
const translate = (x: number, y: number, z: number): Affine => [1, 0, 0, 0, 1, 0, 0, 0, 1, x, y, z];

function apply(m: Affine, p: Vec3): Vec3 {
  return [
    m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[9],
    m[3] * p[0] + m[4] * p[1] + m[5] * p[2] + m[10],
    m[6] * p[0] + m[7] * p[1] + m[8] * p[2] + m[11],
  ];
}

function applyLinear(m: Affine, p: Vec3): Vec3 {
  return [m[0] * p[0] + m[1] * p[1] + m[2] * p[2], m[3] * p[0] + m[4] * p[1] + m[5] * p[2], m[6] * p[0] + m[7] * p[1] + m[8] * p[2]];
}

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const easeInOutCubic = (u: number): number => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeOutQuad = (u: number): number => 1 - (1 - u) * (1 - u);

function parseHex(hex: string): Vec3 {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [163, 230, 53];
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function mulberry32(seed: number): () => number {
  let a = Math.floor(seed * 0xffffffff) >>> 0 || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Model ----------
// Voxels live on a half-unit grid (hv); faces are emitted in model units.

const HV = 0.5;
const key = (x: number, y: number, z: number): string => `${x},${y},${z}`;

function boxVoxels(set: Set<string>, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): void {
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) set.add(key(x, y, z));
}

function mirrorX(set: Set<string>): Set<string> {
  const out = new Set<string>();
  for (const k of set) {
    const [x, y, z] = k.split(',').map(Number);
    out.add(key(-1 - x, y, z));
  }
  return out;
}

// Body 12 x 11 x 8.5 units with a flat top and clean edges.
function buildBody(): Set<string> {
  const s = new Set<string>();
  boxVoxels(s, -12, 11, 0, 21, -8, 8);
  return s;
}

// Stair-stepped wedge hugging the body side, widening down to the hand.
function buildArmR(): Set<string> {
  const s = new Set<string>();
  const rows: [number, number][] = [[9, 1], [8, 2], [7, 2], [6, 3], [5, 3], [4, 4], [3, 4], [2, 5], [1, 5], [0, 5]];
  for (const [y, w] of rows) {
    const [z0, z1] = y >= 5 ? [0, 2] : [-1, 3];
    boxVoxels(s, 12, 11 + w, y, y, z0, z1);
  }
  boxVoxels(s, 13, 16, -1, -1, -1, 3);
  return s;
}

function buildLegR(): Set<string> {
  const s = new Set<string>();
  boxVoxels(s, 4, 7, -6, -1, 0, 2);
  boxVoxels(s, 3, 8, -9, -7, -2, 4);
  return s;
}

// Greedy-merged exposed faces, so each flat side is one or a few quads rather than hundreds.
function voxelFaces(vox: Set<string>, occluders: Set<string>[], mat: Material): Face[] {
  const faces: Face[] = [];
  const filled = (x: number, y: number, z: number): boolean => {
    const k = key(x, y, z);
    return vox.has(k) || occluders.some((o) => o.has(k));
  };
  const min: Vec3 = [Infinity, Infinity, Infinity], max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const k of vox) {
    const p = k.split(',').map(Number);
    for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], p[i]); max[i] = Math.max(max[i], p[i]); }
  }
  for (let axis = 0; axis < 3; axis++) {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    const nu = max[u] - min[u] + 1, nw = max[w] - min[w] + 1;
    for (const sign of [-1, 1]) {
      for (let sl = min[axis]; sl <= max[axis]; sl++) {
        const mask: boolean[] = new Array(nu * nw).fill(false);
        for (let i = 0; i < nu; i++) for (let j = 0; j < nw; j++) {
          const p: Vec3 = [0, 0, 0];
          p[axis] = sl; p[u] = min[u] + i; p[w] = min[w] + j;
          if (!vox.has(key(p[0], p[1], p[2]))) continue;
          p[axis] += sign;
          mask[i * nw + j] = !filled(p[0], p[1], p[2]);
        }
        for (let i = 0; i < nu; i++) for (let j = 0; j < nw; j++) {
          if (!mask[i * nw + j]) continue;
          let wj = 1;
          while (j + wj < nw && mask[i * nw + j + wj]) wj++;
          let hi = 1;
          grow: while (i + hi < nu) {
            for (let k = 0; k < wj; k++) if (!mask[(i + hi) * nw + j + k]) break grow;
            hi++;
          }
          for (let a = 0; a < hi; a++) for (let b = 0; b < wj; b++) mask[(i + a) * nw + j + b] = false;
          const plane = (sign > 0 ? sl + 1 : sl) * HV;
          const corner = (du: number, dw: number): Vec3 => {
            const p: Vec3 = [0, 0, 0];
            p[axis] = plane; p[u] = (min[u] + i + du) * HV; p[w] = (min[w] + j + dw) * HV;
            return p;
          };
          const n: Vec3 = [0, 0, 0];
          n[axis] = sign;
          faces.push({ v: [corner(0, 0), corner(hi, 0), corner(hi, wj), corner(0, wj)], n, mat, bias: 0, alpha: 1, tone: 1, grads: [], rim: 0 });
        }
      }
    }
  }
  return faces;
}

interface Model {
  parts: Record<PartKey, Face[]>;
}

let cachedModel: Model | null = null;

const faceBounds = (f: Face, axis: number): [number, number] => {
  const vals = f.v.map((p) => p[axis]);
  return [Math.min(...vals), Math.max(...vals)];
};
const centroid = (f: Face): Vec3 => [(f.v[0][0] + f.v[2][0]) / 2, (f.v[0][1] + f.v[2][1]) / 2, (f.v[0][2] + f.v[2][2]) / 2];
const vgrad = (f: Face, yFrom: number, yTo: number, a0: number, a1: number, color: Grad['color']): Grad => {
  const c = centroid(f);
  return { from: [c[0], yFrom, c[2]], to: [c[0], yTo, c[2]], a0, a1, color };
};

// Ambient occlusion and soft light baked per face, tuned to the turnaround's pixel values.
function decorateBody(faces: Face[]): Face[] {
  for (const f of faces) {
    if (f.n[1] === 1) f.rim = 0.3;
    else if (f.n[1] === 0) f.grads.push(vgrad(f, 11, 6, 0.07, 0, 'white'), vgrad(f, 0, 2.5, 0.08, 0, 'black'));
  }
  return faces;
}

function decorateArm(faces: Face[]): Face[] {
  for (const f of faces) {
    f.tone = 0.98;
    if (f.n[1] === 1) f.rim = 0.55; // bright step edges of the staircase arm
    else if (f.n[1] === 0 && faceBounds(f, 1)[0] < 1.2) f.grads.push(vgrad(f, -0.5, 1.2, 0.2, 0, 'black'));
  }
  return faces;
}

// Leg column sits in the body's shadow: darker overall and much darker just under the body; the foot is lit.
function decorateLeg(faces: Face[]): Face[] {
  for (const f of faces) {
    const [yMin, yMax] = faceBounds(f, 1);
    if (yMin > -3.01) f.tone = 0.93;
    if (f.n[1] === 0 && yMax > -0.01) f.grads.push(vgrad(f, 0, -1.8, 0.5, 0, 'black'));
    else if (f.n[1] === 1) {
      const c = centroid(f);
      f.grads.push({ from: [c[0], c[1], -1], to: [c[0], c[1], 2.5], a0: 0.3, a1: 0.06, color: 'black' });
    }
  }
  return faces;
}

function getModel(): Model {
  if (cachedModel) return cachedModel;
  const body = buildBody();
  const armR = buildArmR();
  const armL = mirrorX(armR);
  const legR = buildLegR();
  const legL = mirrorX(legR);
  cachedModel = {
    parts: {
      body: decorateBody(voxelFaces(body, [armR, armL, legR, legL], 'body')),
      armR: decorateArm(voxelFaces(armR, [body], 'arm')),
      armL: decorateArm(voxelFaces(armL, [body], 'arm')),
      legR: decorateLeg(voxelFaces(legR, [body], 'leg')),
      legL: decorateLeg(voxelFaces(legL, [body], 'leg')),
    },
  };
  return cachedModel;
}

interface Rect { x0: number; y0: number; x1: number; y1: number }

interface FacePose {
  open: number;
  lookX: number;
  lookY: number;
  happy: number;
  sleep: number;
}

const EYE_X = 2.85;
const EYE_Y = 6.4;

function faceRects(fp: FacePose): Rect[] {
  const rects: Rect[] = [];
  const add = (x0: number, y0: number, x1: number, y1: number): void => { rects.push({ x0, y0, x1, y1 }); };
  const ox = clamp(fp.lookX, -1, 1) * 0.8;
  const oy = clamp(fp.lookY, -1, 1) * 0.6;
  const mx = ox * 0.6, my = oy * 0.6;
  if (fp.sleep > 0.5) {
    for (const cx of [-EYE_X, EYE_X]) add(cx - 0.7 + ox, 5.8 + oy, cx + 0.7 + ox, 6.2 + oy);
    add(-0.75 + mx, 3.3 + my, 0.75 + mx, 3.8 + my);
    return rects;
  }
  if (fp.happy > 0.5) {
    for (const cx of [-EYE_X, EYE_X]) {
      const x = cx + ox, y = EYE_Y - 0.4 + oy;
      add(x - 0.75, y, x - 0.25, y + 0.5);
      add(x - 0.25, y + 0.5, x + 0.25, y + 1);
      add(x + 0.25, y, x + 0.75, y + 0.5);
    }
    add(-1.55 + mx, 2.55 + my, 1.55 + mx, 3.9 + my);
    add(-2.35 + mx, 3.9 + my, -1.55 + mx, 4.7 + my);
    add(1.55 + mx, 3.9 + my, 2.35 + mx, 4.7 + my);
    return rects;
  }
  const h = Math.max(0.1, 0.75 * fp.open);
  for (const cx of [-EYE_X, EYE_X]) add(cx - 0.65 + ox, EYE_Y - h + oy, cx + 0.65 + ox, EYE_Y + h + oy);
  add(-1.55 + mx, 3.15 + my, 1.55 + mx, 3.9 + my);
  add(-2.35 + mx, 3.9 + my, -1.55 + mx, 4.7 + my);
  add(1.55 + mx, 3.9 + my, 2.35 + mx, 4.7 + my);
  return rects;
}

function frontOverlay(r: Rect): Face {
  return {
    v: [[r.x0, r.y0, FRONT_Z], [r.x1, r.y0, FRONT_Z], [r.x1, r.y1, FRONT_Z], [r.x0, r.y1, FRONT_Z]],
    n: [0, 0, 1],
    mat: 'ink',
    bias: 0,
    alpha: 1,
    tone: 1,
    grads: [],
    rim: 0,
  };
}

function sideIndicator(row: number, alpha: number): Face {
  const y0 = 8.45 - row * 1.53, y1 = y0 + 0.9;
  const z0 = -2.75, z1 = -1.85;
  return {
    v: [[SIDE_X, y0, z0], [SIDE_X, y1, z0], [SIDE_X, y1, z1], [SIDE_X, y0, z1]],
    n: [1, 0, 0],
    mat: 'ink',
    bias: 0,
    alpha,
    tone: 1,
    grads: [],
    rim: 0,
  };
}

// ---------- Animation ----------

interface Smoothed {
  yaw: number;
  pitch: number;
  lookX: number;
  lookY: number;
  open: number;
  sleep: number;
  work: number;
  arms: number;
}

interface Jump {
  start: number;
  height: number;
  spin: number;
  dir: number;
  happy: boolean;
}

interface Pose {
  world: Affine;
  shadowWorld: Affine;
  arms: [number, number];
  legs: [number, number];
  face: FacePose;
  indicators: [number, number, number];
  hop: number;
}

interface Zee { born: number; drift: number }

const JUMP_CROUCH = 0.14;
const JUMP_AIR = 0.62;
const JUMP_LAND = 0.42;

export class MklMascot {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private opts: MascotOptions;
  private rand: () => number;
  private raf = 0;
  private last = 0;
  private t = 0;
  private onScreen = true;
  private readonly reducedQuery: MediaQueryList;
  private readonly io: IntersectionObserver;
  private cur: Smoothed = { yaw: 0, pitch: 0, lookX: 0, lookY: 0, open: 1, sleep: 0, work: 0, arms: 0 };
  private tgt: Smoothed = { yaw: 0, pitch: 0, lookX: 0, lookY: 0, open: 1, sleep: 0, work: 0, arms: 0 };
  private jump: Jump | null = null;
  private nextLook = 0;
  private nextBlink = 0;
  private blinkAt = -10;
  private nextJump = 0;
  private wakeUntil = -10;
  private zees: Zee[] = [];
  private nextZee = 0;
  private pointer: { x: number; y: number; active: boolean } = { x: 0, y: 0, active: false };
  private body: Vec3 = [0, 0, 0];
  private ink: Vec3 = [255, 255, 255];

  constructor(canvas: HTMLCanvasElement, options: Partial<MascotOptions> = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('MklMascot: 2D canvas context is unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    this.opts = { ...DEFAULTS, ...options };
    this.rand = mulberry32(this.opts.seed + 0.1234);
    this.reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.io = new IntersectionObserver((entries) => {
      this.onScreen = entries.some((e) => e.isIntersecting);
      this.sync();
    });
    this.io.observe(canvas);
    canvas.setAttribute('role', 'img');
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('keydown', this.onKey);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', this.onLeave);
    document.addEventListener('visibilitychange', this.sync);
    this.reducedQuery.addEventListener('change', this.sync);
    this.applyOptions(true);
  }

  get options(): Readonly<MascotOptions> {
    return this.opts;
  }

  setOptions(next: Partial<MascotOptions>): void {
    const prevState = this.opts.state;
    this.opts = { ...this.opts, ...next };
    if (next.seed !== undefined) this.rand = mulberry32(this.opts.seed + 0.1234);
    this.applyOptions(prevState !== this.opts.state);
  }

  /** Hop with a full turn, as a click does. */
  poke(dir = 1): void {
    if (this.opts.state === 'sleeping') this.wakeUntil = this.t + 1.8;
    this.startJump(this.opts.state === 'sleeping' ? 3 : 6, this.opts.state === 'sleeping' ? 0 : 1, dir, true);
    if (!this.animating()) this.draw(this.pose());
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.io.disconnect();
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('keydown', this.onKey);
    window.removeEventListener('pointermove', this.onPointer);
    document.documentElement.removeEventListener('pointerleave', this.onLeave);
    document.removeEventListener('visibilitychange', this.sync);
    this.reducedQuery.removeEventListener('change', this.sync);
  }

  private applyOptions(stateChanged: boolean): void {
    const o = this.opts;
    o.size = clamp(o.size, 32, 1024);
    o.speed = clamp(o.speed, 0, 4);
    o.turn = clamp(o.turn, 0, 2);
    this.body = parseHex(o.color);
    this.ink = parseHex(o.ink);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const px = Math.round(o.size * dpr);
    if (this.canvas.width !== px) {
      this.canvas.width = px;
      this.canvas.height = px;
    }
    this.canvas.style.width = `${o.size}px`;
    this.canvas.style.height = `${o.size}px`;
    this.canvas.style.cursor = o.interactive ? 'pointer' : '';
    this.canvas.tabIndex = o.interactive ? 0 : -1;
    this.canvas.setAttribute('aria-label', LABELS[o.state]);
    if (stateChanged) {
      this.nextJump = this.t + (o.state === 'working' ? 3 + this.rand() * 3 : o.jumpEvery * (0.6 + this.rand() * 0.6));
      this.nextZee = this.t + 0.4;
      this.wakeUntil = -10;
    }
    this.sync();
    if (!this.animating()) this.draw(this.stillPose());
  }

  private animating(): boolean {
    return !this.opts.paused && this.onScreen && !document.hidden && !this.reducedQuery.matches && this.opts.speed > 0;
  }

  private sync = (): void => {
    if (this.animating()) {
      if (!this.raf) {
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      }
    } else if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  };

  private frame = (now: number): void => {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt * this.opts.speed, dt);
    this.draw(this.pose());
    this.raf = requestAnimationFrame(this.frame);
  };

  private onPointer = (e: PointerEvent): void => {
    const r = this.canvas.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.5;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    this.pointer = { x: dx / r.width, y: dy / r.height, active: Math.hypot(dx, dy) < r.width * 2.2 };
  };

  private onLeave = (): void => {
    this.pointer.active = false;
  };

  private onClick = (): void => {
    if (!this.opts.interactive) return;
    this.poke(this.pointer.x >= 0 ? 1 : -1);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (!this.opts.interactive || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    this.poke(1);
  };

  private startJump(height: number, spin: number, dir: number, happy: boolean): void {
    if (this.jump) return;
    this.jump = { start: this.t, height, spin, dir, happy };
  }

  private effectiveState(): MascotState {
    return this.opts.state === 'sleeping' && this.t < this.wakeUntil ? 'default' : this.opts.state;
  }

  private update(dt: number, realDt: number): void {
    this.t += dt;
    const t = this.t;
    const o = this.opts;
    const state = this.effectiveState();
    const tg = this.tgt;
    tg.sleep = state === 'sleeping' ? 1 : 0;
    tg.work = state === 'working' ? 1 : 0;

    if (state === 'sleeping') {
      tg.yaw = 0;
      tg.pitch = 0.2;
      tg.lookX = 0;
      tg.lookY = -0.4;
      tg.arms = -0.12;
      if (t > this.nextZee) {
        this.zees.push({ born: t, drift: this.rand() });
        this.nextZee = t + 1.3;
      }
    } else if (o.interactive && this.pointer.active) {
      const nx = clamp(this.pointer.x * 1.4, -1, 1), ny = clamp(this.pointer.y * 1.4, -1, 1);
      tg.yaw = nx * 0.5 * o.turn;
      tg.pitch = ny * 0.14;
      tg.lookX = nx;
      tg.lookY = -ny;
      tg.arms = state === 'working' ? 0 : 0.05;
    } else {
      if (t > this.nextLook) {
        const choices = [-1, -0.55, 0, 0, 0.55, 1];
        const pick = choices[Math.floor(this.rand() * choices.length)];
        tg.yaw = pick * 0.45 * o.turn;
        tg.lookX = pick;
        tg.lookY = (this.rand() - 0.5) * 0.8;
        tg.pitch = -tg.lookY * 0.08;
        this.nextLook = t + (state === 'working' ? 1.2 : 1.8) + this.rand() * 2;
      }
      tg.arms = 0;
    }

    if (state !== 'sleeping' && t > this.nextBlink) {
      this.blinkAt = t;
      this.nextBlink = t + 2 + this.rand() * 3.5 + (this.rand() < 0.2 ? -1.7 : 0);
    }

    if (!this.jump && t > this.nextJump) {
      if (state === 'working') {
        this.startJump(5, 1, this.rand() < 0.5 ? -1 : 1, true);
        this.nextJump = t + 4.5 + this.rand() * 3;
      } else if (state === 'default' && o.jumpEvery > 0) {
        this.startJump(5, 1, this.rand() < 0.5 ? -1 : 1, false);
        this.nextJump = t + o.jumpEvery * (0.75 + this.rand() * 0.5);
      } else {
        this.nextJump = t + 1;
      }
    }
    if (this.jump && t - this.jump.start > JUMP_CROUCH + JUMP_AIR + JUMP_LAND) this.jump = null;

    this.zees = this.zees.filter((z) => t - z.born < 2.8);

    const ease = (rate: number): number => 1 - Math.exp(-realDt * rate * Math.max(0.35, o.speed));
    const c = this.cur;
    c.yaw += (tg.yaw - c.yaw) * ease(5);
    c.pitch += (tg.pitch - c.pitch) * ease(4);
    c.lookX += (tg.lookX - c.lookX) * ease(9);
    c.lookY += (tg.lookY - c.lookY) * ease(9);
    c.sleep += (tg.sleep - c.sleep) * ease(4);
    c.work += (tg.work - c.work) * ease(4);
    c.arms += (tg.arms - c.arms) * ease(5);
  }

  private stillPose(): Pose {
    const s = this.opts.state;
    this.cur = { yaw: s === 'sleeping' ? 0 : 0.3 * this.opts.turn, pitch: s === 'sleeping' ? 0.2 : 0, lookX: s === 'sleeping' ? 0 : 0.4, lookY: 0, open: 1, sleep: s === 'sleeping' ? 1 : 0, work: 0, arms: 0 };
    this.jump = null;
    this.zees = s === 'sleeping' ? [{ born: this.t - 1, drift: 0.5 }] : [];
    return this.pose();
  }

  private pose(): Pose {
    const t = this.t;
    const c = this.cur;
    const state = this.effectiveState();
    let hop = 0, sx = 1, sy = 1, spin = 0, lean = 0, armUp = 0, tuck = 0, happy = 0;

    const breathSleep = Math.sin((t * Math.PI * 2) / 3.6) * 0.035;
    const breathIdle = Math.sin((t * Math.PI * 2) / 1.9) * 0.012;
    const breath = breathSleep * c.sleep + breathIdle * (1 - c.sleep);
    sy += breath;
    sx -= breath * 0.5;

    const p = (t / 0.46) % 1;
    const cycleHop = 4 * p * (1 - p) * 1.8 * c.work;
    const q = Math.pow(Math.max(0, 1 - Math.min(p, 1 - p) / 0.16), 2) * c.work;
    const armWave = Math.sin(p * Math.PI * 2) * 0.35 * c.work;

    if (this.jump) {
      const j = this.jump;
      const e = t - j.start;
      if (e < JUMP_CROUCH) {
        const k = easeOutQuad(e / JUMP_CROUCH);
        sy *= 1 - 0.17 * k;
        sx *= 1 + 0.1 * k;
        armUp = -0.15 * k;
      } else if (e < JUMP_CROUCH + JUMP_AIR) {
        const u = (e - JUMP_CROUCH) / JUMP_AIR;
        hop = j.height * 4 * u * (1 - u);
        const st = 0.11 * Math.abs(1 - 2 * u);
        sy *= 1 + st;
        sx *= 1 - st * 0.5;
        spin = j.spin * Math.PI * 2 * easeInOutCubic(u) * j.dir;
        lean = j.dir * -0.12 * Math.sin(Math.PI * u);
        armUp = 0.55 * Math.sin(Math.PI * u);
        tuck = Math.sin(Math.PI * u);
      } else {
        const v = (e - JUMP_CROUCH - JUMP_AIR) / JUMP_LAND;
        const sq = Math.exp(-6 * v) * Math.cos(7 * v);
        sy *= 1 - 0.18 * sq;
        sx *= 1 + 0.1 * sq;
        armUp = -0.1 * sq;
      }
      if (j.happy && e < JUMP_CROUCH + JUMP_AIR + JUMP_LAND * 0.8) happy = 1;
    } else {
      hop = cycleHop;
      sy *= 1 - 0.12 * q;
      sx *= 1 + 0.07 * q;
    }

    const ground: Vec3 = [0, GROUND_Y, 0];
    const bodyMid: Vec3 = [0, 5.5, 0];
    const camera = rotX(CAM_PITCH, CENTER);
    const base = chain(
      camera,
      translate(0, hop, 0),
      rotY(c.yaw + spin, ground),
      rotX(c.pitch, ground),
      rotZ(lean, bodyMid),
      scale(sx, sy, sx, ground),
    );
    const shadowWorld = chain(camera, rotY(c.yaw + spin, ground));

    const idleSway = Math.sin(t * 1.6) * 0.05 * (1 - c.work) * (1 - c.sleep);
    const armR = c.arms + armUp + armWave + idleSway;
    const armL = c.arms + armUp - armWave + idleSway;
    const legSwing = Math.sin(p * Math.PI * 2) * 0.18 * c.work;

    let open = 1;
    const sinceBlink = t - this.blinkAt;
    if (sinceBlink >= 0 && sinceBlink < 0.16) open = 1 - Math.sin((Math.PI * sinceBlink) / 0.16);

    let indicators: [number, number, number];
    if (state === 'working') {
      const step = Math.floor(t / 0.22) % 4;
      indicators = [0, 1, 2].map((i) => (i < step ? 1 : 0.25)) as [number, number, number];
    } else if (state === 'sleeping') {
      const pulse = 0.25 + 0.2 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 3.6));
      indicators = [pulse, pulse, pulse];
    } else {
      indicators = [1, 1, 1];
    }

    return {
      world: base,
      shadowWorld,
      arms: [armR, armL],
      legs: [legSwing - tuck * 0.25, -legSwing - tuck * 0.25],
      face: { open, lookX: c.lookX, lookY: c.lookY, happy, sleep: c.sleep },
      indicators,
      hop,
    };
  }

  // Camera-relative lighting sampled from the turnaround: front ~0.93, top lifted toward white, a side turned 20° ~0.7 of front.
  private shade(mat: Material, n: Vec3, tone: number): string {
    const nz = Math.max(0, n[2]), ny = Math.max(0, n[1]);
    const src = mat === 'ink' ? this.ink : this.body;
    let k: number, white: number;
    if (mat === 'ink') {
      k = 0.9 + 0.1 * nz;
      white = 0;
    } else {
      k = Math.min(1, 0.54 + 0.4 * nz + 0.6 * ny) * tone;
      white = (mat === 'arm' ? 0.4 : mat === 'leg' ? 0.08 : 0.2) * Math.min(1, ny * 2.5);
    }
    const ch = (v: number): number => Math.round(clamp(v * k + (255 - v * k) * white, 0, 255));
    return `rgb(${ch(src[0])},${ch(src[1])},${ch(src[2])})`;
  }

  private draw(pose: Pose): void {
    const { ctx, canvas } = this;
    const size = this.opts.size;
    const dpr = canvas.width / size;
    const s = size / UNITS;
    const cx = size / 2, cy = size * 0.58;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const project = (p: Vec3): [number, number] => {
      const k = CAM_DIST / (CAM_DIST - (p[2] - CENTER[2]));
      return [cx + (p[0] - CENTER[0]) * s * k, cy - (p[1] - CENTER[1]) * s * k];
    };
    const facing = (m: Affine, n: Vec3, at: Vec3): boolean => {
      const nn = applyLinear(m, n), p = apply(m, at);
      return nn[0] * (CENTER[0] - p[0]) + nn[1] * (CENTER[1] - p[1]) + nn[2] * (CAM_DIST + CENTER[2] - p[2]) > 0;
    };

    // Soft ground shadow plus tighter contact shadows under the feet; both shrink and fade while airborne.
    const blob = (x: number, y: number, r: number, a: number): void => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.3);
      const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      rg.addColorStop(0, `rgba(0,0,0,${a.toFixed(3)})`);
      rg.addColorStop(0.55, `rgba(0,0,0,${(a * 0.55).toFixed(3)})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const g = project(apply(pose.shadowWorld, [0, GROUND_Y, 0.75]));
    const lift = clamp(pose.hop / 8, 0, 1);
    blob(g[0], g[1], 9.5 * s * (1 - lift * 0.35), 0.34 * (1 - lift * 0.6));
    const contact = 0.32 * clamp(1 - pose.hop / 1.5, 0, 1);
    if (contact > 0.01) {
      for (const fx of [-3, 3]) {
        const f = project(apply(pose.shadowWorld, [fx, GROUND_Y, 0.75]));
        blob(f[0], f[1], 2.6 * s, contact);
      }
    }

    const model = getModel();
    const partMats: Record<PartKey, Affine> = {
      body: pose.world,
      armR: mul(pose.world, rotZ(pose.arms[0], [6, 4.75, 0.75])),
      armL: mul(pose.world, rotZ(-pose.arms[1], [-6, 4.75, 0.75])),
      legR: mul(pose.world, rotX(pose.legs[0], [3, 0, 0.75])),
      legL: mul(pose.world, rotX(pose.legs[1], [-3, 0, 0.75])),
    };

    // Parts are drawn back to front as whole pieces (far arms, legs, body, near arms); faces sort only within a part.
    const nearR = facing(pose.world, [1, 0, 0], [6, 5, 0]);
    const nearL = facing(pose.world, [-1, 0, 0], [-6, 5, 0]);
    const legDepth = (m: Affine, x: number): number => apply(m, [x, -2, 0.75])[2];
    const legs: PartKey[] = legDepth(partMats.legR, 3) < legDepth(partMats.legL, -3) ? ['legR', 'legL'] : ['legL', 'legR'];
    const order: PartKey[] = [];
    if (!nearR) order.push('armR');
    if (!nearL) order.push('armL');
    order.push(...legs, 'body');
    if (nearR) order.push('armR');
    if (nearL) order.push('armL');

    const collect = (faces: Face[], m: Affine): DrawItem[] => {
      const items: DrawItem[] = [];
      for (const face of faces) {
        const n = normalize(applyLinear(m, face.n));
        const w = face.v.map((v) => apply(m, v));
        const mx = (w[0][0] + w[2][0]) / 2, my = (w[0][1] + w[2][1]) / 2, mz = (w[0][2] + w[2][2]) / 2;
        const view: Vec3 = [CENTER[0] - mx, CENTER[1] - my, CAM_DIST + CENTER[2] - mz];
        if (n[0] * view[0] + n[1] * view[1] + n[2] * view[2] <= 0) continue;
        const pts: number[] = [];
        const scr = w.map(project);
        for (const p of scr) pts.push(p[0], p[1]);
        const grads: ScreenGrad[] = [];
        for (const gr of face.grads) {
          const a = project(apply(m, gr.from)), b = project(apply(m, gr.to));
          if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.5) continue; // gradient axis seen end-on
          grads.push({ x0: a[0], y0: a[1], x1: b[0], y1: b[1], a0: gr.a0, a1: gr.a1, rgb: gr.color === 'white' ? '255,255,255' : '0,0,0' });
        }
        // Highlight only the top edges whose neighbouring side faces the camera, as on the turnaround.
        const rimEdges: number[] = [];
        if (face.rim) {
          const c = centroid(face);
          for (let i = 0; i < 4; i++) {
            const a = face.v[i], b = face.v[(i + 1) % 4];
            const mid: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
            if (facing(m, normalize([mid[0] - c[0], 0, mid[2] - c[2]]), mid)) rimEdges.push(...scr[i], ...scr[(i + 1) % 4]);
          }
        }
        items.push({ pts, depth: mz + face.bias, fill: this.shade(face.mat, n, face.tone), alpha: face.alpha, grads, rimEdges, rimAlpha: face.rim });
      }
      return items.sort((a, b) => a.depth - b.depth);
    };

    const rimWidth = Math.max(0.6, s * 0.1);
    const paint = (items: DrawItem[], seams: boolean): void => {
      for (const it of items) {
        const p = it.pts;
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(p[2], p[3]);
        ctx.lineTo(p[4], p[5]);
        ctx.lineTo(p[6], p[7]);
        ctx.closePath();
        ctx.globalAlpha = it.alpha;
        ctx.fillStyle = it.fill;
        ctx.fill();
        if (seams) {
          ctx.strokeStyle = it.fill;
          ctx.stroke(); // closes anti-aliasing hairlines between adjoining faces
        }
        ctx.globalAlpha = 1;
        for (const g of it.grads) {
          const lg = ctx.createLinearGradient(g.x0, g.y0, g.x1, g.y1);
          lg.addColorStop(0, `rgba(${g.rgb},${(g.a0 * it.alpha).toFixed(3)})`);
          lg.addColorStop(1, `rgba(${g.rgb},${(g.a1 * it.alpha).toFixed(3)})`);
          ctx.fillStyle = lg;
          ctx.fill();
        }
        if (it.rimEdges.length) {
          const r = it.rimEdges;
          ctx.beginPath();
          for (let i = 0; i < r.length; i += 4) {
            ctx.moveTo(r[i], r[i + 1]);
            ctx.lineTo(r[i + 2], r[i + 3]);
          }
          ctx.strokeStyle = `rgba(255,255,255,${it.rimAlpha})`;
          ctx.lineWidth = rimWidth;
          ctx.stroke();
          ctx.lineWidth = 0.5;
        }
      }
    };

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.5;
    for (const k of order) {
      paint(collect(model.parts[k], partMats[k]), true);
      if (k === 'body') {
        const decals = faceRects(pose.face).map(frontOverlay);
        pose.indicators.forEach((a, i) => decals.push(sideIndicator(i, a)));
        paint(collect(decals, pose.world), false);
      }
    }

    this.drawZees(project(apply(pose.world, [4, 11.5, 0])), s);
  }

  private drawZees(origin: [number, number], s: number): void {
    const ctx = this.ctx;
    const glyph = ['11111', '00010', '00100', '01000', '11111'];
    const [r, gr, b] = this.ink;
    for (const z of this.zees) {
      const age = (this.t - z.born) / 2.8;
      if (age < 0 || age > 1) continue;
      const px = s * (0.28 + age * 0.3);
      const x = origin[0] + s * (1.5 + age * 5 + Math.sin(age * 6 + z.drift * 6) * 0.8);
      const y = origin[1] - s * (age * 8);
      const alpha = Math.sin(Math.PI * Math.min(1, age * 1.15)) * 0.9;
      ctx.fillStyle = `rgba(${r},${gr},${b},${alpha.toFixed(3)})`;
      glyph.forEach((row, gy) => {
        for (let gx = 0; gx < 5; gx++) if (row[gx] === '1') ctx.fillRect(x + gx * px, y + gy * px, px + 0.3, px + 0.3);
      });
    }
  }
}

const instances = new WeakMap<HTMLCanvasElement, MklMascot>();

function readOptions(el: HTMLCanvasElement): Partial<MascotOptions> {
  const d = el.dataset;
  const out: Partial<MascotOptions> = {};
  if (d.state === 'default' || d.state === 'working' || d.state === 'sleeping') out.state = d.state;
  if (d.size) out.size = Number(d.size);
  if (d.color) out.color = d.color;
  if (d.ink) out.ink = d.ink;
  if (d.speed) out.speed = Number(d.speed);
  if (d.turn) out.turn = Number(d.turn);
  if (d.seed) out.seed = Number(d.seed);
  if (d.jumpEvery) out.jumpEvery = Number(d.jumpEvery);
  if (d.interactive) out.interactive = d.interactive !== 'false';
  return out;
}

/** Mounts every `canvas[data-mkl-mascot]` not yet mounted; safe to call repeatedly. */
export function mountAll(root: ParentNode = document): MklMascot[] {
  const els = Array.from(root.querySelectorAll<HTMLCanvasElement>('canvas[data-mkl-mascot]'));
  return els.map((el) => {
    const existing = instances.get(el);
    if (existing) return existing;
    const m = new MklMascot(el, readOptions(el));
    instances.set(el, m);
    return m;
  });
}

export function getMascot(el: HTMLCanvasElement): MklMascot | undefined {
  return instances.get(el);
}
