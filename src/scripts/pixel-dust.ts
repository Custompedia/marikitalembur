// Twinkling purple pixels on a grid behind the mascot.

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hash(x: number, y: number, s: number): number {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 982451653)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Purple pixels twinkling on a grid around a centre, behind the mascot. */
export function initPixelDust(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const CELL = 14;
  let w = 0, h = 0, dpr = 1, raf = 0, visible = false, last = 0, t = 0;
  const resize = (): void => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    draw();
  };
  const draw = (): void => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
    const cx = w / 2, cy = h * 0.55, rx = w * 0.46, ry = h * 0.46;
    const step = Math.floor(t * 6);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * CELL + CELL / 2, y = j * CELL + CELL / 2;
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        if (d > 1 || d < 0.28) continue;
        const life = hash(i, j, 91);
        const phase = (step + Math.floor(life * 97)) % 40;
        if (phase > 3 || hash(i, j, 17) > 0.34) continue;
        ctx.fillStyle = `rgba(167, 139, 250, ${((1 - d) * 0.9 * (phase === 1 || phase === 2 ? 1 : 0.45)).toFixed(3)})`;
        ctx.fillRect(i * CELL + 3, j * CELL + 3, CELL - 6, CELL - 6);
      }
    }
  };
  const frame = (now: number): void => {
    raf = 0;
    if (!visible) return;
    if (now - last > 1000 / 12) {
      t += last ? (now - last) / 1000 : 0;
      last = now;
      draw();
    }
    raf = requestAnimationFrame(frame);
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !raf && !reducedMotion()) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }).observe(canvas);
  resize();
}
