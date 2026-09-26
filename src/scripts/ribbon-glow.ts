// Ribbon glow: a full-bleed WebGL2 field of stacked, folded light ribbons that twist around the pointer.

export interface RibbonOptions {
  background: string;
  color1: string;
  color2: string;
  speed: number; // 0 freezes the field
  size: number; // percent zoom of the field
  angle: number; // degrees
  hover: number; // percent strength of the pointer twist
  reach: number; // CSS px radius of the twist
  layers: number; // glow layers per pixel (max 84)
}

const DEFAULTS: RibbonOptions = { background: '#010101', color1: '#8B5CF6', color2: '#D8B4FE', speed: 50, size: 100, angle: -24, hover: 100, reach: 260, layers: 84 };
const MAX_LAYERS = 84;

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uVel;
uniform float uPresence;
uniform float uSize;
uniform float uAngle;
uniform float uHover;
uniform float uReach;
uniform int uLayers;
uniform float uLift;
uniform vec3 uBg;
uniform vec3 uC1;
uniform vec3 uC2;
out vec4 outColor;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  float unit = min(uRes.x, uRes.y);
  vec2 uv0 = (gl_FragCoord.xy - 0.5 * uRes) / unit;
  vec2 uv = uv0;

  // Twist and drag the plane around the pointer, fading with distance and presence.
  vec2 pp = (uPointer - 0.5 * uRes) / unit;
  vec2 d = uv - pp;
  float r = uReach / unit;
  float fall = exp(-dot(d, d) / (r * r)) * uPresence * uHover;
  uv = pp + rot(fall * 1.35) * d - uVel * fall * 0.35;

  // On tall screens the field is lifted so the ribbons sit between the nav and the wordmark.
  uv.y -= uLift;
  uv = rot(uAngle) * uv / uSize;

  vec3 acc = vec3(0.0);
  float t = uTime;
  for (int i = 0; i < ${MAX_LAYERS}; i++) {
    if (i >= uLayers) break;
    float f = float(i) / float(${MAX_LAYERS});
    vec2 p = uv;
    // Two sine warps bend each layer into a slow ribbon.
    p.y += 0.22 * sin(p.x * 1.45 + t * 0.55 + f * 2.4);
    p.x += 0.16 * sin(p.y * 1.9 - t * 0.42 + f * 3.3);
    // A sheared rotation, then a fold, turns the stack into arcs that cross and separate.
    p = rot(0.55 * f + 0.12 * sin(t * 0.21)) * p;
    p.x += 0.35 * p.y * f;
    p.y = abs(p.y + 0.18) - 0.28 * f - 0.05;
    float dist = p.y + 0.07 * sin(p.x * 2.6 + t * 0.8 + f * 5.0);
    float glow = 1.0 / (1.0 + dist * dist * (5200.0 + 9000.0 * f));
    vec3 tint = mix(uC1, uC2, 0.5 + 0.5 * sin(f * 5.2 + p.x * 1.4 + t * 0.2));
    acc += tint * glow * (0.012 + 0.05 * f * f);
  }

  vec3 light = aces(acc * 1.6);
  // Dark grounds screen the ribbons in as light.
  vec3 col = 1.0 - (1.0 - uBg) * (1.0 - light);
  col = pow(col, vec3(0.95, 0.92, 1.0));
  float vig = smoothstep(1.35, 0.25, length(uv0 * vec2(0.85, 1.0)));
  col = mix(uBg, col, 0.35 + 0.65 * vig);
  // Interleaved-gradient dither at 1/255 hides banding in the dark falloff.
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  col += (n - 0.5) / 255.0;
  outColor = vec4(col, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const h = m ? m[1] : '010101';
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('ribbon-glow: cannot create shader');
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(`ribbon-glow: ${gl.getShaderInfoLog(sh) ?? 'compile failed'}`);
  return sh;
}

export interface RibbonGlow { destroy(): void }

/** Starts the ribbon field on a canvas; returns null when WebGL2 is unavailable so the caller's CSS fallback shows. */
export function mountRibbonGlow(canvas: HTMLCanvasElement, options: Partial<RibbonOptions> = {}): RibbonGlow | null {
  const o = { ...DEFAULTS, ...options };
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(`ribbon-glow: ${gl.getProgramInfoLog(prog) ?? 'link failed'}`);
  gl.useProgram(prog);
  gl.bindVertexArray(gl.createVertexArray());
  const u = (name: string): WebGLUniformLocation | null => gl.getUniformLocation(prog, name);
  const loc = {
    res: u('uRes'), time: u('uTime'), pointer: u('uPointer'), vel: u('uVel'), presence: u('uPresence'), size: u('uSize'), angle: u('uAngle'),
    hover: u('uHover'), reach: u('uReach'), layers: u('uLayers'), lift: u('uLift'), bg: u('uBg'), c1: u('uC1'), c2: u('uC2'),
  };
  gl.uniform3fv(loc.bg, hexToRgb(o.background));
  gl.uniform3fv(loc.c1, hexToRgb(o.color1));
  gl.uniform3fv(loc.c2, hexToRgb(o.color2));
  gl.uniform1f(loc.size, o.size / 100);
  gl.uniform1f(loc.angle, (o.angle * Math.PI) / 180);
  gl.uniform1f(loc.hover, o.hover / 100);
  gl.uniform1i(loc.layers, Math.min(MAX_LAYERS, Math.max(1, Math.round(o.layers))));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scale = 0.5; // the field renders at half resolution and the browser upsamples it
  let quality = 1; // drops on slow devices; multiplies the render scale
  let slowTime = 0;
  let raf = 0, last = 0, time = 7.3, visible = true;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, presence: 0, inside: false };

  const resize = (): void => {
    const r = canvas.getBoundingClientRect();
    scale = 0.5 * Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    canvas.width = Math.max(1, Math.round(r.width * scale));
    canvas.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform1f(loc.reach, o.reach * scale);
    gl.uniform1f(loc.lift, Math.min(0.45, Math.max(0, (canvas.height / canvas.width - 1) * 0.4)));
    if (!raf) draw();
  };

  const draw = (): void => {
    gl.uniform1f(loc.time, time);
    gl.uniform2f(loc.pointer, pointer.x * scale, canvas.height - pointer.y * scale);
    gl.uniform2f(loc.vel, pointer.vx, -pointer.vy);
    gl.uniform1f(loc.presence, pointer.presence);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number): void => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt * (o.speed / 50) * 0.6;
    // Smooth the pointer, its velocity, and its presence so the twist eases in and out.
    const k = 1 - Math.exp(-dt * 8);
    const px = pointer.x, py = pointer.y;
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    const unit = Math.min(canvas.width, canvas.height) / scale || 1;
    pointer.vx += (((pointer.x - px) / unit) / Math.max(dt, 1e-3) * 0.05 - pointer.vx) * k;
    pointer.vy += (((pointer.y - py) / unit) / Math.max(dt, 1e-3) * 0.05 - pointer.vy) * k;
    pointer.presence += ((pointer.inside ? 1 : 0) - pointer.presence) * (1 - Math.exp(-dt * 3));
    // Below roughly 45 fps for a second, render the field at a lower resolution (down to 60%).
    slowTime = dt > 0.022 ? slowTime + dt : Math.max(0, slowTime - dt);
    if (slowTime > 1 && quality > 0.6) {
      quality = Math.max(0.6, quality * 0.8);
      slowTime = 0;
      resize();
    }
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  };

  const start = (): void => {
    if (raf || reduced || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  // Listening on window keeps the twist working while page content is stacked above the canvas.
  const onMove = (e: PointerEvent): void => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = e.clientX - r.left;
    pointer.ty = e.clientY - r.top;
    pointer.inside = pointer.tx >= 0 && pointer.ty >= 0 && pointer.tx <= r.width && pointer.ty <= r.height;
    if (pointer.presence < 0.01) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
    }
  };
  const onLeave = (): void => { pointer.inside = false; };
  const onVisibility = (): void => { if (!document.hidden) start(); };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    start();
  });
  io.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  start();

  return {
    destroy(): void {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
