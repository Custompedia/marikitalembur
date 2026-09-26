// Particle sphere behind the home hero: a slowly turning cloud of purple points on a 2D canvas.

type Rgb = [number, number, number];

// Purple family, weighted towards the brand accent.
const PALETTE: { rgb: Rgb; weight: number }[] = [
  { rgb: [139, 92, 246], weight: 0.35 },
  { rgb: [109, 40, 217], weight: 0.25 },
  { rgb: [196, 181, 253], weight: 0.2 },
  { rgb: [167, 139, 250], weight: 0.12 },
  { rgb: [233, 213, 255], weight: 0.08 },
];
const DEPTHS = [0.18, 0.34, 0.55, 0.85];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface HeroSphere {
  setActive(on: boolean): void;
  destroy(): void;
}

/** Draws the sphere on a canvas; `onAngles` receives its yaw and pitch in degrees a few times a second. */
export function mountHeroSphere(canvas: HTMLCanvasElement, onAngles?: (yaw: number, pitch: number) => void): HeroSphere | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = window.innerWidth <= 760 ? 1500 : 2800;
  const rand = mulberry32(20260926);

  // Unit-space points: a thick shell plus vertical streaks at the poles.
  const px = new Float32Array(count), py = new Float32Array(count), pz = new Float32Array(count);
  const tone = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    if (rand() < 0.18) {
      const side = rand() < 0.5 ? -1 : 1;
      const spread = 0.14 * (rand() - 0.5) * (1 + rand());
      px[i] = spread;
      pz[i] = 0.14 * (rand() - 0.5) * (1 + rand());
      py[i] = side * (0.82 + 0.4 * Math.pow(rand(), 1.6));
    } else {
      const y = 1 - (2 * (i + 0.5)) / count;
      const ring = Math.sqrt(1 - y * y);
      const th = i * 2.399963 + rand() * 0.4;
      const k = 0.7 + 0.34 * Math.pow(rand(), 0.6);
      px[i] = Math.cos(th) * ring * k;
      pz[i] = Math.sin(th) * ring * k;
      py[i] = y * k * 1.1;
    }
    let pick = rand(), c = 0;
    while (c < PALETTE.length - 1 && pick > PALETTE[c].weight) pick -= PALETTE[c++].weight;
    tone[i] = c;
  }
  const styles = PALETTE.map(({ rgb }) => DEPTHS.map((a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`));
  const sx = new Float32Array(count), sy = new Float32Array(count), ss = new Float32Array(count);
  const key = new Uint8Array(count);

  let w = 0, h = 0, dpr = 1, raf = 0, last = 0, t = 0, lastReport = 0;
  let visible = true, active = true;
  let yaw = 2.1, pitch = -0.2;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const resize = (): void => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = r.width;
    h = r.height;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    if (!raf) draw();
  };

  const draw = (): void => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * (w <= 760 ? 0.36 : 0.3);
    const cx = w / 2, cy = h / 2;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    for (let i = 0; i < count; i++) {
      const breathe = 1 + 0.025 * Math.sin(t * 0.8 + py[i] * 3);
      const x1 = (px[i] * cyw + pz[i] * syw) * breathe;
      const z1 = -px[i] * syw + pz[i] * cyw;
      const y2 = py[i] * cp - z1 * sp;
      const z2 = py[i] * sp + z1 * cp;
      const persp = 2.6 / (2.6 - z2);
      sx[i] = cx + x1 * R * persp;
      sy[i] = cy + y2 * R * breathe * persp;
      ss[i] = 0.7 + persp * 0.55;
      const depth = Math.min(DEPTHS.length - 1, Math.max(0, Math.floor(((z2 + 1.2) / 2.4) * DEPTHS.length)));
      key[i] = tone[i] * DEPTHS.length + depth;
    }
    // Additive blending lets dense regions glow; one fill style per colour and depth band keeps state changes few.
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < PALETTE.length * DEPTHS.length; k++) {
      ctx.fillStyle = styles[Math.floor(k / DEPTHS.length)][k % DEPTHS.length];
      for (let i = 0; i < count; i++) if (key[i] === k) ctx.fillRect(sx[i], sy[i], ss[i], ss[i]);
    }
  };

  const report = (now: number): void => {
    if (!onAngles || now - lastReport < 120) return;
    lastReport = now;
    const deg = (r: number): number => (r * 180) / Math.PI;
    onAngles(((deg(yaw) % 360) + 360) % 360, deg(pitch));
  };

  const frame = (now: number): void => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    const k = 1 - Math.exp(-dt * 3);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    yaw += dt * (0.12 + pointer.x * 0.18);
    pitch += (-0.2 + pointer.y * 0.3 - pitch) * k;
    draw();
    report(now);
    raf = visible && active && !document.hidden ? requestAnimationFrame(frame) : 0;
  };

  const start = (): void => {
    if (raf || reduced || !visible || !active || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent): void => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onVisibility = (): void => { if (!document.hidden) start(); };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    start();
  });
  io.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  report(performance.now());
  start();

  return {
    setActive(on: boolean): void {
      if (on === active) return;
      active = on;
      start();
    },
    destroy(): void {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
