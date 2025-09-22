<div align="center">
  <h1>e-inkCSS</h1>
  <p><em>Lightweight “layered paper” mini CSS framework.</em></p>
  <p>
    Utilities • Components • Dark Mode • Accessible • Zero build step
  </p>
  <sub>Licensed under GPL-3.0 – see <a href="./LICENSE">LICENSE</a></sub>
</div>

## Features

Core building blocks for quickly prototyping or shipping small sites / internal tools:

- Modern CSS reset + custom properties (design tokens)
- Fluid responsive typography scale
- Spacing utility system (`m-*`, `p-*`, directional variants)
- Layout helpers: flex & lightweight grid utilities
- Components: navbar, hero, buttons, cards, panel, tabs, accordion, modal, tooltip, alerts, badge, breadcrumbs, pagination, table
- Form styles with accessible focus states
- Dark theme toggle via `data-theme="dark"`
- Layered paper look (`.layered`, `.paper-edge` shadows & offsets)
- Attribute–based tooltips: `data-tip="..."`
- Motion respects `prefers-reduced-motion`

## Quick Start

Copy `paper.css` and (optionally) `paper.js` (for interactive components) into your project, then include:

```html
<link rel="stylesheet" href="paper.css">
<script defer src="paper.js"></script>
```

Basic container:

```html
<div class="container">
  <h1>Heading</h1>
  <p>Hello PaperCSS.</p>
</div>
```

## Dark Mode

Enable:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

Disable / back to light:

```js
document.documentElement.setAttribute('data-theme', 'light');
```

You can persist the user preference (pseudo‑code):

```js
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
document.querySelector('#themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

## Customizing Tokens

Override before importing `paper.css` (or below it with higher specificity):

```css
:root {
  --paper-accent: #346cab;
  --paper-accent-hover: #3e79bd;
  --paper-radius: 8px;
  --paper-shadow: 0 4px 14px -2px rgba(0,0,0,.15);
}
```

## Modal Example

```html
<button data-open-modal="myModal">Open</button>
<div id="myModal" class="modal-backdrop" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">
    <button class="modal-close" aria-label="Close">×</button>
    <div class="modal-header"><h3 id="mTitle">Title</h3></div>
    <div class="modal-body">Content...</div>
    <div class="modal-footer">
      <button class="btn-outline" data-close>Close</button>
      <button class="btn">OK</button>
    </div>
  </div>
 </div>
```

## Tabs

```html
<div class="tabs">
  <div class="tab-list" role="tablist">
    <button data-tab="p1" role="tab" aria-selected="true" aria-controls="p1">First</button>
    <button data-tab="p2" role="tab" aria-selected="false" aria-controls="p2">Second</button>
  </div>
  <div id="p1" class="tab-panel active" role="tabpanel">Panel 1</div>
  <div id="p2" class="tab-panel" role="tabpanel" hidden>Panel 2</div>
 </div>
```

## Accordion

```html
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-button" aria-expanded="true">Section</button>
    <div class="accordion-content open">Content...</div>
  </div>
</div>
```

## Tooltip

```html
<button data-tip="Save changes" class="btn-info">Save</button>
```

## Utility Classes (Snapshot)

- Spacing: `m-0..m-6`, `mt-*`, `mb-*`, `p-0..p-6`
- Text: `text-center`, `text-right`, `text-muted`, `text-accent`
- Display: `d-none`, `d-block`, `d-inline`, `flex`, `flex-col`
- Shadows: `shadow`, `shadow-layer`
- Widths: `w-100`, `maxw-sm|md|lg`

## Extending

Consider generating spacing / color maps with a preprocessor (Sass, PostCSS) if you scale the design system.

Example extra grid helper:

```css
.grid.cols-auto-200 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
```

## Accessibility (A11y)

- Maintain keyboard navigation (enhance tabs with arrow-key roving if needed)
- Add `role` / `aria-*` following WAI-ARIA Authoring Practices for complex widgets
- Color contrast aims ≥ 4.5:1 (re‑verify after overriding tokens)
- Motion trimmed when `prefers-reduced-motion: reduce` is active

## Print

Included `@media print` hides large decorative sections (hero, navbar). Adjust to your brand needs.

## Roadmap / Ideas

- Form validation states
- Toast / inline notification system
- Progressive enhancement for keyboard shortcuts

## Contributing

Issues & pull requests welcome. Keep footprint small & no build dependency creep.

## License

GPL-3.0 – see `LICENSE`. You must preserve copyright & license headers. Distribute source or offer equivalent access per the GPL when conveying binaries / minified bundles.

---

Happy building!