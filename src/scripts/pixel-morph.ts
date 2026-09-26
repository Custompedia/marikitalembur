// Pixel morph behind the mascot: loose purple pixels that fly together into a mosaic of each path's illustration.
// Pixels assemble from the mosaic's centre outwards, flash as they land, and shy away from the pointer.

type Point = { x: number; y: number };
interface Target { x: number; y: number; color: string; alpha: number; order: number }

const CELL = 8; // CSS px per mosaic cell
const DUST = 260; // pixels that stay loose around the stage
const DUST_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9'];
const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (u: number): number => 1 - Math.pow(1 - u, 3);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`pixel-morph: cannot load ${src}`));
    img.src = src;
  });
}

// Samples an image into one cell per CELL px. Near-black backdrop cells are dropped; dark scenery stays, dimmed by its brightness.
function sample(img: HTMLImageElement, size: number, origin: Point): Target[] {
  const n = Math.max(8, Math.floor(size / CELL));
  const off = document.createElement('canvas');
  off.width = n;
  off.height = n;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, n, n);
  const data = ctx.getImageData(0, 0, n, n).data;
  const out: Target[] = [];
  const c = (n - 1) / 2;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = (j * n + i) * 4;
      const r = data[k], g = data[k + 1], b = data[k + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (luma < 16 && b - g < 30) continue;
      // Quantised colours keep the set of fill styles small.
      const q = (v: number): number => Math.min(255, Math.round(v / 12) * 12);
      out.push({ x: origin.x + i * CELL, y: origin.y + j * CELL, color: `rgb(${q(r)},${q(g)},${q(b)})`, alpha: Math.min(1, 0.3 + luma / 110 + Math.max(0, b - g) / 160), order: Math.hypot(i - c, j - c) / c });
    }
  }
  return out;
}

export interface PixelMorph {
  /** -1 shows loose pixels only; 0..n-1 assembles that source image. */
  show(index: number): void;
}

export function mountPixelMorph(canvas: HTMLCanvasElement, sources: string[]): PixelMorph | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const reduced = reducedMotion();
  let images: HTMLImageElement[] = [];
  let w = 0, h = 0, dpr = 1, raf = 0, visible = false, t = 0, last = 0;
  let current = -1;
  let targets: Target[][] = [];
  let scatter: Point[] = [];

  // Particle state in flat arrays: from/to position, alpha and size, flight start and length, colour, landing time.
  let N = 0;
  let fx = new Float32Array(0), fy = new Float32Array(0), tx = new Float32Array(0), ty = new Float32Array(0);
  let fa = new Float32Array(0), ta = new Float32Array(0), fs = new Float32Array(0), ts = new Float32Array(0);
  let start = new Float32Array(0), dur = new Float32Array(0), landed = new Float32Array(0);
  let loose = new Uint8Array(0);
  let color: string[] = [];
  const pointer = { x: -9999, y: -9999, on: false };

  const alloc = (n: number): void => {
    N = n;
    fx = new Float32Array(n); fy = new Float32Array(n); tx = new Float32Array(n); ty = new Float32Array(n);
    fa = new Float32Array(n); ta = new Float32Array(n); fs = new Float32Array(n); ts = new Float32Array(n);
    start = new Float32Array(n); dur = new Float32Array(n); landed = new Float32Array(n).fill(-10);
    loose = new Uint8Array(n);
    color = new Array<string>(n).fill(DUST_COLORS[0]);
  };

  // Where the mosaic sits: to the right of the mascot on wide stages, above it on narrow ones.
  const layout = (): { size: number; origin: Point } => {
    const wide = w > 760;
    const size = wide ? Math.min(h * 0.96, w * 0.44) : Math.min(w * 0.88, h * 0.62);
    const cx = wide ? w * 0.62 : w / 2;
    const cy = wide ? h / 2 : h * 0.4;
    return { size, origin: { x: Math.round(cx - size / 2), y: Math.round(cy - size / 2) } };
  };

  const buildScatter = (): void => {
    scatter = [];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.55 + Math.random() * 0.45;
      scatter.push({ x: w / 2 + Math.cos(a) * r * w * 0.48, y: h * 0.55 + Math.sin(a) * r * h * 0.46 });
    }
  };

  const evalAt = (i: number, now: number): { x: number; y: number; a: number; s: number } => {
    const u = dur[i] > 0 ? Math.min(1, Math.max(0, (now - start[i]) / dur[i])) : 1;
    const e = easeOut(u);
    return { x: fx[i] + (tx[i] - fx[i]) * e, y: fy[i] + (ty[i] - fy[i]) * e, a: fa[i] + (ta[i] - fa[i]) * e, s: fs[i] + (ts[i] - fs[i]) * e };
  };

  // Sends every particle to its place for `index`, starting from wherever it is now.
  const retarget = (index: number, instant: boolean): void => {
    const set = index >= 0 ? targets[index] ?? [] : [];
    // Shuffle which particle takes which cell so pixels cross the stage instead of sliding in rows.
    const order = set.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (let i = 0; i < N; i++) {
      const cur = evalAt(i, t);
      fx[i] = cur.x; fy[i] = cur.y; fa[i] = cur.a; fs[i] = cur.s;
      if (i < set.length) {
        const g = set[order[i]];
        tx[i] = g.x; ty[i] = g.y; ta[i] = g.alpha; ts[i] = CELL - 2;
        color[i] = g.color;
        loose[i] = 0;
        start[i] = t + g.order * 0.55 + Math.random() * 0.12;
        dur[i] = 0.85 + Math.random() * 0.35;
        landed[i] = start[i] + dur[i];
      } else {
        const p = scatter[i % scatter.length];
        tx[i] = p.x; ty[i] = p.y; ta[i] = i < N - DUST ? 0 : 0.5; ts[i] = 4;
        if (i >= N - DUST) color[i] = DUST_COLORS[i % DUST_COLORS.length];
        loose[i] = 1;
        start[i] = t + Math.random() * 0.2;
        dur[i] = 0.7 + Math.random() * 0.5;
        landed[i] = -10;
      }
      if (instant) {
        fx[i] = tx[i]; fy[i] = ty[i]; fa[i] = ta[i]; fs[i] = ts[i];
        dur[i] = 0;
        landed[i] = -10;
      }
    }
  };

  const draw = (): void => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const R = 90;
    for (let i = 0; i < N; i++) {
      const p = evalAt(i, t);
      let a = p.a;
      if (a < 0.01) continue;
      let x = p.x, y = p.y;
      if (loose[i]) {
        a *= 0.55 + 0.45 * Math.sin(t * 2.2 + i * 1.7);
      } else if (!reduced) {
        y += Math.sin(t * 1.4 + x * 0.018) * 1.2; // the settled mosaic breathes
      }
      if (pointer.on && !reduced) {
        const dx = x - pointer.x, dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) {
          const push = (1 - d / R) ** 2 * 26;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
      }
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = color[i];
      ctx.fillRect(x, y, p.s, p.s);
      // A short flash when a pixel lands.
      const since = t - landed[i];
      if (since >= 0 && since < 0.45) {
        ctx.globalAlpha = (1 - since / 0.45) * 0.7;
        ctx.fillStyle = '#ede4ff';
        ctx.fillRect(x, y, p.s, p.s);
      }
    }
    ctx.globalAlpha = 1;
  };

  const frame = (now: number): void => {
    raf = 0;
    if (!visible) return;
    t += last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  };
  const run = (): void => {
    if (reduced) {
      draw();
      return;
    }
    if (!raf && visible) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const resize = (): void => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    w = r.width;
    h = r.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    if (!images.length) return;
    const { size, origin } = layout();
    targets = images.map((img) => sample(img, size, origin));
    const need = Math.max(...targets.map((s) => s.length)) + DUST;
    if (need !== N) alloc(need);
    buildScatter();
    retarget(current, true);
    draw();
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    run();
  }).observe(canvas);
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.on = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
  }, { passive: true });

  Promise.all(sources.map(loadImage))
    .then((imgs) => {
      images = imgs;
      resize();
      run();
    })
    .catch((err: unknown) => console.error(err));

  return {
    show(index: number): void {
      if (index === current) return;
      current = index;
      if (!N) return;
      retarget(index, reduced);
      run();
    },
  };
}
