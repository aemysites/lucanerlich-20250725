/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match example exactly
  const headerRow = ['Hero (hero5)'];

  // 2. Background image row: none in sample html, so empty string
  const backgroundRow = [''];

  // 3. Content row: must include all text content from source html
  // Locate the content container
  let inner = element.querySelector('.content-header-outer__inner') || element;
  let contentCell = [];
  // Gather all direct children EXCEPT breadcrumbs navigation
  Array.from(inner.childNodes).forEach((node) => {
    if (node.nodeType === 1) { // element
      // Exclude breadcrumbs navigation
      if (!node.matches('nav.breadcrumb')) {
        contentCell.push(node);
      }
    } else if (node.nodeType === 3) { // text node
      if (node.textContent.trim()) {
        // preserve all text content
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentCell.push(span);
      }
    }
  });
  // If no content found, fallback to empty string
  if (contentCell.length === 0) {
    contentCell = [''];
  }
  const contentRow = [contentCell];

  // Compose block table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
