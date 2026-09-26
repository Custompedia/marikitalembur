// Text entrances after hazel.ai: headings open from the centre outwards in purple light that settles to their colour; cards rise in.

// Wraps every non-space character in a span, keeping inline children such as <em> in place.
function splitChars(node: Node, out: HTMLElement[]): void {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of child.textContent ?? '') {
        if (/\s/.test(ch)) {
          frag.append(ch);
          continue;
        }
        const span = document.createElement('span');
        span.className = 'ch';
        span.textContent = ch;
        out.push(span);
        frag.append(span);
      }
      child.replaceWith(frag);
    } else if (child instanceof HTMLElement) {
      splitChars(child, out);
    }
  }
}

/** Splits a heading into letters delayed by their distance from its centre; adding `is-in` plays the reveal. */
function prepareLight(heading: HTMLElement): void {
  // Screen readers get the heading once from a hidden copy; the split letters are presentation only.
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = heading.textContent ?? '';
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(...Array.from(heading.childNodes));
  heading.append(label, visual);
  const chars: HTMLElement[] = [];
  splitChars(visual, chars);
  // Hide the letters before measuring: measuring resolves styles, and letters first styled as visible would only fade out, never in.
  heading.classList.add('light-text', 'is-split');
  const box = heading.getBoundingClientRect();
  const mid = box.left + box.width / 2;
  const dist = chars.map((c) => {
    const r = c.getBoundingClientRect();
    return Math.abs(r.left + r.width / 2 - mid);
  });
  const far = Math.max(1, ...dist);
  chars.forEach((c, i) => c.style.setProperty('--d', `${(0.1 + (dist[i] / far) * 0.5).toFixed(3)}s`));
}

// Two frames so the hidden start state is painted before the transition runs.
const play = (...els: HTMLElement[]): void => {
  requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => el.classList.add('is-in'))));
};

function onceVisible(els: HTMLElement[], rootMargin: string): void {
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin });
  els.forEach((el) => io.observe(el));
}

export function initTextLight(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector<HTMLElement>('.page-hero');
  const heroTitle = hero?.querySelector<HTMLElement>('h1');
  if (hero && heroTitle) {
    hero.classList.add('is-split');
    prepareLight(heroTitle);
    play(hero, heroTitle);
  }
  // Sections outside the inner-page layout opt in with data-light-group: the [data-light] heading opens up,
  // then each [data-rise] element rises in after the delay (seconds) it names.
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-light-group]'));
  for (const group of groups) {
    const heading = group.querySelector<HTMLElement>('[data-light]');
    if (heading) prepareLight(heading);
    group.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
      el.style.setProperty('--rise', `${Number(el.dataset.rise) || 0}s`);
      el.classList.add('rise-text');
    });
  }
  if (groups.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.querySelectorAll('[data-light], [data-rise]').forEach((el) => el.classList.add('is-in'));
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -20% 0px' });
    groups.forEach((g) => io.observe(g));
  }
  const headings = Array.from(document.querySelectorAll<HTMLElement>('main .section h2:not(.fcard__title)'));
  headings.forEach(prepareLight);
  onceVisible(headings, '0px 0px -18% 0px');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.card-grid > *, .service-list > *'));
  // Cards side by side in a grid stagger; stacked service rows already arrive one at a time.
  for (const card of cards) {
    const parent = card.parentElement;
    if (parent?.classList.contains('card-grid')) card.style.setProperty('--i', String(Array.prototype.indexOf.call(parent.children, card)));
    card.classList.add('rise');
  }
  onceVisible(cards, '0px 0px -8% 0px');
}
