// Navbar dropdown: a top-level item opens its panel and the glass tab grows down to fit it.
// Opens on hover (after a short intent delay) or click; closes on leave, Escape, focus leaving, or a click on the backdrop.

export function initNavMenu(header: HTMLElement): void {
  const triggers = Array.from(header.querySelectorAll<HTMLButtonElement>('[data-nav-trigger]'));
  const box = header.querySelector<HTMLElement>('[data-nav-panels]');
  const panels = Array.from(header.querySelectorAll<HTMLElement>('[data-nav-panel]'));
  const backdrop = document.querySelector<HTMLElement>('[data-nav-backdrop]');
  if (!box || !triggers.length) return;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let open: string | null = null;
  let openedAt = 0;
  let openTimer = 0;
  let closeTimer = 0;

  const panelFor = (key: string): HTMLElement | undefined => panels.find((p) => p.dataset.navPanel === key);
  const fit = (): void => {
    const panel = open ? panelFor(open) : undefined;
    box.style.height = panel ? `${panel.scrollHeight}px` : '0px';
  };
  const set = (key: string | null): void => {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    if (key === open) return;
    open = key;
    openedAt = performance.now();
    for (const t of triggers) t.setAttribute('aria-expanded', String(t.dataset.navTrigger === key));
    // Hidden panels are inert, so Tab never lands on a link you cannot see.
    for (const p of panels) {
      const on = p.dataset.navPanel === key;
      p.classList.toggle('is-active', on);
      p.inert = !on;
    }
    header.classList.toggle('is-menu-open', key !== null);
    backdrop?.classList.toggle('is-on', key !== null);
    fit();
  };

  for (const t of triggers) {
    const key = t.dataset.navTrigger ?? '';
    t.addEventListener('click', () => {
      // A click right after hover opened this panel confirms it rather than closing it.
      if (open === key && performance.now() - openedAt > 400) set(null);
      else set(key);
    });
    if (canHover) {
      t.addEventListener('pointerenter', () => {
        window.clearTimeout(closeTimer);
        window.clearTimeout(openTimer);
        openTimer = window.setTimeout(() => set(key), open ? 0 : 90);
      });
    }
  }
  if (canHover) {
    header.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
    header.addEventListener('pointerleave', () => {
      window.clearTimeout(openTimer);
      closeTimer = window.setTimeout(() => set(null), 220);
    });
  }
  header.addEventListener('focusout', (e) => {
    if (!(e.relatedTarget instanceof Node) || !header.contains(e.relatedTarget)) set(null);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || open === null) return;
    const trigger = triggers.find((t) => t.dataset.navTrigger === open);
    set(null);
    trigger?.focus();
  });
  backdrop?.addEventListener('click', () => set(null));
  window.addEventListener('resize', fit);
}
