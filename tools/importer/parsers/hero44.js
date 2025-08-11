/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely query a selector, fallback null
  function sel(parent, selector) {
    return parent ? parent.querySelector(selector) : null;
  }

  // Header row (exact block name)
  const headerRow = ['Hero (hero44)'];

  // 2nd row: image (background)
  const img = sel(element, '.ceo-image');
  // OK if img is null: block supports optional background image
  const imageRow = [img || ''];

  // 3rd row: headline + subhead + CTA (all in one cell, preserve hierarchy)
  const ceoInner = sel(element, '.ceo-inner');
  let contentCell = [];
  if (ceoInner) {
    const heading = sel(ceoInner, '.section-title');
    if (heading) contentCell.push(heading);
    const ceoText = sel(ceoInner, '.ceo-text');
    if (ceoText) {
      const blockquote = sel(ceoText, 'blockquote');
      if (blockquote) contentCell.push(blockquote);
      // CTA link: only include if it has non-empty text
      const cta = ceoText.querySelector('a.welcome-read-more');
      if (cta && cta.textContent.trim()) {
        contentCell.push(cta);
      }
    }
  }
  // Fallback if nothing found (shouldn't happen with provided HTML)
  if (contentCell.length === 0) contentCell = [''];
  const contentRow = [contentCell];

  // Compose table per spec
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
