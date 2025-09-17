# PaperCSS – Mini Framework "Papierowy"

Lekki framework CSS stylizujący layout i komponenty tak, by przypominały warstwowane karty papieru. Zawiera:

- Reset + zmienne CSS
- Skalę typografii fluid
- System spacingu (klasy `m-*`, `p-*`)
- Grid + flex utilities
- Komponenty: navbar, hero, buttons, cards, panel, tabs, accordion, modal, tooltip, alerts, badge, breadcrumbs, pagination, table
- Formularze (+ fokus dostępnościowy)
- Tryb ciemny (`data-theme="dark"`)
- Warstwowe karty (`.layered`, `.paper-edge`)
- Tooltip dynamiczny (`data-tip="..."`)
- Animacje z poszanowaniem `prefers-reduced-motion`

## Szybki start

1. Skopiuj `paper.css` i `paper.js` do projektu.
2. Dodaj w `<head>`:

```html
<link rel="stylesheet" href="paper.css">
<script defer src="paper.js"></script>
```

3. Struktura kontenera:

```html
<div class="container">
  <h1>Tytuł</h1>
</div>
```

## Tryb ciemny

Przełącz:

```js
document.documentElement.setAttribute('data-theme','dark');
```

Przywrócenie:

```js
document.documentElement.setAttribute('data-theme','light');
```

## Nadpisywanie zmiennych

Wstaw przed importem:

```css
:root {
  --paper-accent: #346cab;
  --paper-accent-hover: #3e79bd;
}
```

## Komponent: Modal

HTML:

```html
<button data-open-modal="myModal">Otwórz</button>
<div id="myModal" class="modal-backdrop">
  <div class="modal">
    <button class="modal-close">×</button>
    <div class="modal-header"><h3>Tytuł</h3></div>
    <div class="modal-body">Treść...</div>
    <div class="modal-footer">
      <button class="btn-outline">Zamknij</button>
      <button class="btn">OK</button>
    </div>
  </div>
</div>
```

## Tabs

```html
<div class="tabs">
  <div class="tab-list">
    <button data-tab="p1" aria-selected="true">Pierwszy</button>
    <button data-tab="p2" aria-selected="false">Drugi</button>
  </div>
  <div id="p1" class="tab-panel active">Treść 1</div>
  <div id="p2" class="tab-panel">Treść 2</div>
</div>
```

## Accordion

```html
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-button" aria-expanded="true">Sekcja</button>
    <div class="accordion-content open">Treść...</div>
  </div>
</div>
```

## Tooltip

```html
<button data-tip="Zapisz zmiany" class="btn-info">Zapisz</button>
```

## Utilities

- Marginesy: `m-0 ... m-6`, `mt-*`, `mb-*`
- Paddingi: `p-0 ... p-6`
- Teksty: `text-center`, `text-right`, `text-muted`, `text-accent`
- Display: `d-none`, `d-block`, `d-inline`, `flex`, `flex-col`
- Cienie: `shadow`, `shadow-layer`
- Szerokości: `w-100`, `maxw-sm|md|lg`

## Rozszerzanie

Możesz dodać preprocesor (Sass) i zmapować generację spacingu zamiast statycznych klas. Layout gridowy można rozwijać:

```css
.grid.cols-auto-200 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

## Dostępność (A11y)

- Przejścia klawiaturą w tabach można rozbudować (obsługa strzałek)
- Dopisz `role`, `aria-*` gdzie potrzebujesz głębszych standardów (WAI-ARIA Authoring Practices)
- Kolory zapewniają przybliżony kontrast > 4.5 dla tekstu na tle (sprawdź po zmianach)

## Print

Wbudowany `@media print` ukrywa hero i navbar – dopasuj jeśli trzeba.

## Licencja

Możesz używać, modyfikować i forkować. Dodaj informację o autorze jeśli publikujesz.

Miłego tworzenia!