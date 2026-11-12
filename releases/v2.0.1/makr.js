/*! makr.css — optional helper JS (~1 KB). Only needed for .tabs and the
    old-style (non-<details>) .accordion markup. Load with:
    <script src="/js/makr.js" defer></script> Updated 11/12/2026 */
(() => {
  // Tabs: .tab-btn[data-tab="id"] toggles .tab-content#id
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn[data-tab]');
    if (btn) {
      const tabs = btn.closest('.tabs');
      tabs.querySelectorAll('.tab-btn').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
      });
      tabs.querySelectorAll('.tab-content').forEach((c) =>
        c.classList.toggle('active', c.id === btn.dataset.tab));
      return;
    }
    // Accordion (old markup): .accordion-item > .accordion-heading + .accordion-content
    const head = e.target.closest('.accordion-item:not(details) > .accordion-heading');
    if (head) {
      const item = head.parentElement;
      const open = !item.classList.contains('active');
      if (item.closest('.accordion')?.hasAttribute('data-single')) {
        item.parentElement.querySelectorAll(':scope > .accordion-item.active').forEach((i) => {
          i.classList.remove('active');
          i.querySelector('.accordion-content')?.classList.remove('is-open');
        });
      }
      item.classList.toggle('active', open);
      item.querySelector('.accordion-content')?.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', open);
    }
  });
})();
