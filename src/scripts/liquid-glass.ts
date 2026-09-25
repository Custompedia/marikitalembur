// Liquid glass: refracts the backdrop through a rounded-rect lens via an SVG displacement filter (Chromium only; others keep the CSS blur).

interface GlassOptions {
  bezel: number; // px width of the curved rim
  refraction: number; // max displacement as a fraction of the bezel
  blur: number; // stdDeviation of the frost inside the lens
  saturation: number;
  specular: number; // rim highlight opacity, 0–1
  cssVar?: string; // set this custom property instead of the element's own backdrop-filter (for a glass ::before layer)
}

const DEFAULTS: GlassOptions = { bezel: 16, refraction: 0.75, blur: 2.5, saturation: 1.5, specular: 0.55 };
const SVG_NS = 'http://www.w3.org/2000/svg';
const LIGHT = { x: Math.cos((-120 * Math.PI) / 180), y: Math.sin((-120 * Math.PI) / 180) }; // from the upper left

// navigator.userAgentData exists only in Chromium, the one engine that runs SVG filters in backdrop-filter.
function supportsSvgBackdrop(): boolean {
  return typeof (navigator as Navigator & { userAgentData?: object }).userAgentData === 'object';
}

// Signed distance to a rounded rectangle centred at the origin: negative inside.
function roundedRectSdf(px: number, py: number, hw: number, hh: number, r: number): number {
  const dx = Math.abs(px) - (hw - r);
  const dy = Math.abs(py) - (hh - r);
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - r;
}

// Convex squircle rim profile f(t) = (1 - (1 - t)^4)^(1/4); returns its slope.
function squircleSlope(t: number): number {
  const u = 1 - t;
  const inner = Math.max(1e-4, 1 - u ** 4);
  return (u ** 3) / inner ** 0.75;
}

function buildMaps(w: number, h: number, radius: number, o: GlassOptions): { disp: string; spec: string; scale: number } {
  const disp = document.createElement('canvas');
  const spec = document.createElement('canvas');
  disp.width = spec.width = w;
  disp.height = spec.height = h;
  const dctx = disp.getContext('2d');
  const sctx = spec.getContext('2d');
  if (!dctx || !sctx) throw new Error('liquid-glass: 2D canvas unavailable');
  const dImg = dctx.createImageData(w, h);
  const sImg = sctx.createImageData(w, h);
  const hw = w / 2, hh = h / 2;
  const r = Math.min(radius, hw, hh);
  const bezel = Math.max(1, Math.min(o.bezel, hh, hw));
  const N = 1.5; // index of refraction of glass

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      const sd = roundedRectSdf(px, py, hw, hh, r);
      dImg.data[i] = 128;
      dImg.data[i + 1] = 128;
      dImg.data[i + 2] = 128;
      dImg.data[i + 3] = 255;
      if (sd >= 0) continue;
      const depth = -sd;
      if (depth >= bezel) continue;
      // Outward normal from the SDF gradient.
      const e = 0.5;
      let nx = roundedRectSdf(px + e, py, hw, hh, r) - roundedRectSdf(px - e, py, hw, hh, r);
      let ny = roundedRectSdf(px, py + e, hw, hh, r) - roundedRectSdf(px, py - e, hw, hh, r);
      const nl = Math.hypot(nx, ny) || 1;
      nx /= nl;
      ny /= nl;
      const t = depth / bezel;
      // Snell's law on the rim slope gives how far the ray is bent inward.
      const theta1 = Math.atan(squircleSlope(t));
      const theta2 = Math.asin(Math.sin(theta1) / N);
      const bend = Math.min(1, Math.sin(theta1 - theta2) / Math.sin(Math.PI / 2 - Math.asin(1 / N)));
      dImg.data[i] = Math.round(128 - nx * bend * 127);
      dImg.data[i + 1] = Math.round(128 - ny * bend * 127);
      // Rim highlight strongest where the edge faces the light, with a faint counter-rim opposite.
      const facing = nx * LIGHT.x + ny * LIGHT.y;
      const rim = (1 - t) ** 2.2;
      const s = (Math.max(0, facing) ** 1.5 + Math.max(0, -facing) ** 3 * 0.35) * rim;
      sImg.data[i] = sImg.data[i + 1] = sImg.data[i + 2] = 255;
      sImg.data[i + 3] = Math.round(Math.min(1, s) * o.specular * 255);
    }
  }
  dctx.putImageData(dImg, 0, 0);
  sctx.putImageData(sImg, 0, 0);
  return { disp: disp.toDataURL(), spec: spec.toDataURL(), scale: bezel * o.refraction * 2 };
}

const channel = (keep: 0 | 1 | 2): string => {
  const rows = [0, 1, 2].map((c) => (c === keep ? [0, 0, 0, 0, 0].map((_, k) => (k === c ? 1 : 0)) : [0, 0, 0, 0, 0]));
  return [...rows.flat(), 0, 0, 0, 1, 0].join(' ');
};

let svgRoot: SVGSVGElement | null = null;
let counter = 0;

function filterFor(id: string, w: number, h: number, maps: { disp: string; spec: string; scale: number }, o: GlassOptions): SVGFilterElement {
  const f = document.createElementNS(SVG_NS, 'filter');
  const attrs: Record<string, string> = { id, x: '0', y: '0', width: String(w), height: String(h), filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' };
  for (const [k, v] of Object.entries(attrs)) f.setAttribute(k, v);
  const box = `x="0" y="0" width="${w}" height="${h}"`;
  // Three displacement taps at slightly different strengths give a thin chromatic fringe at the rim.
  f.innerHTML = `
    <feGaussianBlur in="SourceGraphic" stdDeviation="${o.blur}" result="frost"/>
    <feImage href="${maps.disp}" ${box} preserveAspectRatio="none" result="map"/>
    <feDisplacementMap in="frost" in2="map" scale="${maps.scale}" xChannelSelector="R" yChannelSelector="G" result="dR"/>
    <feDisplacementMap in="frost" in2="map" scale="${maps.scale * 0.93}" xChannelSelector="R" yChannelSelector="G" result="dG"/>
    <feDisplacementMap in="frost" in2="map" scale="${maps.scale * 0.86}" xChannelSelector="R" yChannelSelector="G" result="dB"/>
    <feColorMatrix in="dR" type="matrix" values="${channel(0)}" result="r"/>
    <feColorMatrix in="dG" type="matrix" values="${channel(1)}" result="g"/>
    <feColorMatrix in="dB" type="matrix" values="${channel(2)}" result="b"/>
    <feBlend in="r" in2="g" mode="screen" result="rg"/>
    <feBlend in="rg" in2="b" mode="screen" result="rgb"/>
    <feColorMatrix in="rgb" type="saturate" values="${o.saturation}" result="lens"/>
    <feImage href="${maps.spec}" ${box} preserveAspectRatio="none" result="spec"/>
    <feComposite in="spec" in2="lens" operator="over"/>`;
  return f;
}

function ensureRoot(): SVGSVGElement {
  if (!svgRoot) {
    svgRoot = document.createElementNS(SVG_NS, 'svg');
    svgRoot.setAttribute('aria-hidden', 'true');
    svgRoot.setAttribute('width', '0');
    svgRoot.setAttribute('height', '0');
    svgRoot.style.position = 'absolute';
    svgRoot.style.pointerEvents = 'none';
    document.body.append(svgRoot);
  }
  return svgRoot;
}

export interface LiquidGlass {
  /** Rebuilds the lens for the element's current size; cheap when the size has not changed. */
  refresh(): void;
}

/** Makes one element refracting glass, or returns null where only the CSS blur fallback is available. */
export function createLiquidGlass(el: HTMLElement, options: Partial<GlassOptions> = {}): LiquidGlass | null {
  if (!supportsSvgBackdrop() || window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return null;
  const o = { ...DEFAULTS, ...options };
  const root = ensureRoot();
  const id = `liquid-glass-${++counter}`;
  let size = '';
  const refresh = (): void => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (w < 8 || h < 8 || `${w}x${h}` === size) return;
    size = `${w}x${h}`;
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    const filter = filterFor(id, w, h, buildMaps(w, h, radius, o), o);
    root.querySelector(`#${id}`)?.remove();
    root.append(filter);
    // A fresh url() forces Chromium to drop its cached output for the old size.
    const set = (v: string): void => (o.cssVar ? el.style.setProperty(o.cssVar, v) : el.style.setProperty('backdrop-filter', v));
    set('none');
    void el.offsetWidth;
    set(`url(#${id})`);
    el.classList.add('is-liquid');
  };
  return { refresh };
}

/** Turns each matching element into refracting glass that follows its own size; the CSS blur remains the fallback outside Chromium. */
export function applyLiquidGlass(selector: string, options: Partial<GlassOptions> = {}): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const glass = createLiquidGlass(el, options);
    if (!glass) return;
    let queued = false;
    new ResizeObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        glass.refresh();
      });
    }).observe(el);
  });
}
