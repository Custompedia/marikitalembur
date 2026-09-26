// Home hero after psychoactive.co.nz: pinned while the reel card opens, with scrambled labels, a rotating word, and the particle sphere.
import { mountRibbonGlow } from './ribbon-glow';
import { mountHeroSphere } from './hero-sphere';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/=+';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const running = new WeakMap<HTMLElement, number>();

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const easeInOutCubic = (u: number): number => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

/** Resolves `text` into an element left to right out of random glyphs. */
function scramble(el: HTMLElement, text: string, ms = 700, glyphs = UPPER): void {
  cancelAnimationFrame(running.get(el) ?? 0);
  const start = performance.now();
  const step = (now: number): void => {
    const u = Math.min(1, (now - start) / ms);
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      out += ch === ' ' || u >= 0.25 + 0.75 * (i / text.length) ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    el.textContent = out;
    if (u < 1) running.set(el, requestAnimationFrame(step));
    else running.delete(el);
  };
  running.set(el, requestAnimationFrame(step));
}

export function initHero(hero: HTMLElement): void {
  const reel = hero.querySelector<HTMLElement>('[data-hero-reel]');
  if (!reel) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const corners = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-corner]'));
  const labelL = hero.querySelector<HTMLElement>('[data-hero-label="l"]');
  const labelR = hero.querySelector<HTMLElement>('[data-hero-label="r"]');
  const texts = Array.from(hero.querySelectorAll<HTMLElement>('[data-scramble]')).map((el) => ({ el, text: el.textContent ?? '' }));
  const labelTexts = texts.filter(({ el }) => el.closest('[data-hero-label]'));
  const word = hero.querySelector<HTMLElement>('[data-hero-word]');
  const words = (word?.dataset.words ?? '').split(',').filter(Boolean);
  const pitchOut = hero.querySelector<HTMLElement>('[data-hero-readout="pitch"]');
  const yawOut = hero.querySelector<HTMLElement>('[data-hero-readout="yaw"]');

  const ribbon = reel.querySelector<HTMLCanvasElement>('canvas[data-ribbon]');
  if (ribbon) {
    try {
      mountRibbonGlow(ribbon);
    } catch (err) {
      // The CSS gradient on the card stays in place; report why the shader did not start.
      console.error(err);
    }
  }
  const sphereCanvas = hero.querySelector<HTMLCanvasElement>('canvas[data-hero-sphere]');
  const sphere = sphereCanvas
    ? mountHeroSphere(sphereCanvas, (yaw, pitch) => {
        if (yawOut) yawOut.textContent = `${yaw.toFixed(4)}°`;
        if (pitchOut) pitchOut.textContent = `${pitch.toFixed(4)}°`;
      })
    : null;

  const scrambleAll = (list = texts): void => {
    if (reduced) return;
    list.forEach(({ el, text }, i) => window.setTimeout(() => scramble(el, text), i * 90));
  };

  let W = 0, H = 0, w0 = 0, h0 = 0, away = false, queued = false;
  const measure = (): void => {
    W = reel.offsetWidth;
    H = reel.offsetHeight;
    const narrow = window.innerWidth <= 760;
    w0 = clamp(W * (narrow ? 0.62 : 0.36), Math.min(W, 200), 520);
    h0 = Math.min(H, w0 * (narrow ? 0.46 : 0.27));
  };

  // Scroll progress through the pin opens the card; it is fully open a little before the pin releases.
  const update = (): void => {
    queued = false;
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const p = reduced ? 0 : clamp(-hero.getBoundingClientRect().top / travel, 0, 1);
    const e = easeInOutCubic(clamp(p / 0.85, 0, 1));
    hero.style.setProperty('--e', e.toFixed(4));
    const w = lerp(w0, W, e), h = lerp(h0, H, e);
    reel.style.clipPath = `inset(${((H - h) / 2).toFixed(1)}px ${((W - w) / 2).toFixed(1)}px round 14px)`;
    const off = lerp(12, 44, e);
    for (const c of corners) {
      const k = c.dataset.heroCorner ?? '';
      c.style.transform = `translate(${k.includes('l') ? -(w / 2 + off) : w / 2 + off}px, ${k.includes('t') ? -(h / 2 + off) : h / 2 + off}px)`;
    }
    const gap = lerp(w0 / 2 + 18, 82, e), ly = lerp(10, -6, e);
    if (labelL) labelL.style.transform = `translate(${-gap}px, ${ly}px)`;
    if (labelR) labelR.style.transform = `translate(${gap}px, ${ly}px)`;
    sphere?.setActive(e < 0.7);
    const nowAway = p > 0.03;
    if (nowAway !== away) {
      away = nowAway;
      hero.classList.toggle('is-away', away);
      scrambleAll(away ? labelTexts : texts);
    }
  };
  const queue = (): void => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };

  if (word && words.length > 1 && !reduced) {
    let index = Math.max(0, words.indexOf(word.textContent?.trim() ?? ''));
    window.setInterval(() => {
      if (away || document.hidden) return;
      index = (index + 1) % words.length;
      scramble(word, words[index], 650, LOWER);
    }, 2800);
  }

  new ResizeObserver(() => {
    measure();
    queue();
  }).observe(reel);
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  measure();
  update();
  hero.classList.add('is-ready');
  scrambleAll();
}
