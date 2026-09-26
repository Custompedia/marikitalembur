// Page motion for the StackCraft-style layout: pinned hero, statement entrances, word reveals, the pinned paths, and the nav pill.
import { mountAll, getMascot, type MascotState } from './mkl-mascot';
import { initHero } from './hero-intro';
import { initTextLight } from './text-light';
import { initPixelDust } from './pixel-dust';

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Splits an element's text into word spans, keeping inline children such as <em> and <br>.
function splitWords(el: Element): void {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) frag.append(part);
        else {
          const span = document.createElement('span');
          span.className = 'rw';
          span.textContent = part;
          frag.append(span);
        }
      }
      node.replaceWith(frag);
    } else if (node instanceof Element && node.tagName !== 'BR') {
      splitWords(node);
    }
  }
}

// Words light up as they pass the upper part of the viewport, and dim again when scrolled back.
function initLighting(): void {
  document.querySelectorAll('[data-reveal]').forEach(splitWords);
  const words = Array.from(document.querySelectorAll<HTMLElement>('.rw, .w'));
  if (!words.length) return;
  let queued = false;
  const update = (): void => {
    queued = false;
    const line = window.innerHeight * 0.72;
    for (const w of words) w.classList.toggle('is-lit', w.getBoundingClientRect().top < line);
  };
  const queue = (): void => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
}

// Statement words slide in from the side named in data-from the first time they enter the viewport.
function initStatement(): void {
  const words = Array.from(document.querySelectorAll<HTMLElement>('[data-statement] .w'));
  if (!words.length) return;
  if (reducedMotion()) {
    words.forEach((w) => w.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  words.forEach((w) => io.observe(w));
}

const isState = (v: string | undefined): v is MascotState => v === 'default' || v === 'working' || v === 'sleeping';

// Scroll through a tall section while its content stays pinned; each quarter focuses one path and cues the mascot.
function initAbout(section: HTMLElement): void {
  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-about-item]'));
  const panes = Array.from(section.querySelectorAll<HTMLElement>('[data-about-pane]'));
  const paneBox = section.querySelector<HTMLElement>('.about-pin__panes');
  const indexList = section.querySelector<HTMLElement>('.about-pin__index');
  const canvas = section.querySelector<HTMLCanvasElement>('canvas[data-mkl-mascot]');
  const mascot = canvas ? getMascot(canvas) : undefined;
  let current = -1;
  let queued = false;

  // Beside the list, the description slides down to sit level with the focused item; stacked on mobile, it stays put.
  const alignPane = (): void => {
    if (!paneBox || !indexList) return;
    const item = current > 0 ? items[current - 1] : undefined;
    const sideBySide = paneBox.getBoundingClientRect().left >= indexList.getBoundingClientRect().right;
    const y = item && sideBySide ? item.offsetTop - indexList.offsetTop + (item.offsetHeight - 20) / 2 : 0;
    paneBox.style.setProperty('--pane-y', `${Math.max(0, y)}px`);
  };

  const update = (): void => {
    queued = false;
    const r = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const p = clamp(-r.top / travel, 0, 1);
    section.classList.toggle('is-in', r.top < window.innerHeight * 0.6);
    const idx = p < 0.1 ? 0 : Math.min(items.length, 1 + Math.floor(((p - 0.1) / 0.9) * items.length));
    section.dataset.nav = panes[idx]?.dataset.navKey ?? '';
    if (idx === current) return;
    const prev = current;
    current = idx;
    items.forEach((el, i) => el.classList.toggle('is-active', i + 1 === idx));
    panes.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    alignPane();
    const pose = panes[idx]?.dataset.pose;
    if (mascot && isState(pose)) {
      mascot.setOptions({ state: pose });
      if (prev !== -1 && idx > 0) mascot.poke(idx > prev ? 1 : -1);
    }
  };
  const queue = (): void => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', () => {
    alignPane();
    queue();
  });
  update();
}

// A soft pill slides to the nav item of the section in view; without tagged sections it marks the current page.
function initNavIndicator(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav-root]');
  const pill = nav?.querySelector<HTMLElement>('.nav-indicator');
  if (!nav || !pill) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[data-nav-key]'));
  const pageKey = links.find((a) => a.getAttribute('aria-current') === 'page')?.dataset.navKey ?? '';
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
  let current: string | null = null;
  let queued = false;

  const moveTo = (key: string, force = false): void => {
    if (key === current && !force) return;
    current = key;
    const link = links.find((a) => a.dataset.navKey === key);
    links.forEach((a) => a.classList.toggle('is-active', a === link));
    if (!link) {
      pill.classList.remove('is-on');
      return;
    }
    const place = (): void => {
      pill.style.setProperty('--x', `${link.offsetLeft}px`);
      pill.style.width = `${link.offsetWidth}px`;
    };
    if (!pill.classList.contains('is-on') || reducedMotion()) {
      // Appear in place rather than sliding in from the left edge.
      pill.style.transition = 'none';
      place();
      void pill.offsetWidth;
      pill.style.transition = '';
    } else {
      place();
    }
    pill.classList.add('is-on');
  };
  const compute = (force = false): void => {
    queued = false;
    let key = pageKey;
    if (sections.length) {
      key = '';
      const line = window.innerHeight * 0.45;
      // Later sections win, so the top card of a sticky stack counts.
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) key = s.dataset.nav ?? '';
      }
    }
    moveTo(key, force);
  };
  const queue = (): void => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => compute());
    }
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', () => compute(true));
  document.fonts.ready.then(() => compute(true));
  compute();
}

// The footer wordmark lights up in a soft circle that follows the pointer.
function initFooterGlow(mark: HTMLElement): void {
  const lit = mark.querySelector<SVGSVGElement>('.footer-mark__word--lit');
  if (!lit) return;
  let x = 0, y = 0, queued = false;
  const paint = (): void => {
    queued = false;
    const r = lit.getBoundingClientRect();
    lit.style.setProperty('--mx', `${(x - r.left).toFixed(1)}px`);
    lit.style.setProperty('--my', `${(y - r.top).toFixed(1)}px`);
  };
  mark.addEventListener('pointerenter', () => mark.classList.add('is-lit'));
  mark.addEventListener('pointerleave', () => mark.classList.remove('is-lit'));
  mark.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!queued) {
      queued = true;
      requestAnimationFrame(paint);
    }
  }, { passive: true });
}

export function initSite(): void {
  // Hidden-until-animated styles apply only once this script runs, so content stays visible if it fails to load.
  document.documentElement.classList.add('js');
  mountAll();
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) initHero(hero);
  initTextLight();
  initStatement();
  initLighting();
  const about = document.querySelector<HTMLElement>('[data-about]');
  if (about) initAbout(about);
  const dust = document.querySelector<HTMLCanvasElement>('canvas[data-pixel-dust]');
  if (dust) initPixelDust(dust);
  initNavIndicator();
  const footerMark = document.querySelector<HTMLElement>('[data-footer-mark]');
  if (footerMark) initFooterGlow(footerMark);
}
