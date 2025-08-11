/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, exactly as the example
  const headerRow = ['Columns (columns36)'];

  // Get all quicklink elements (each will be a column in the next row)
  const quicklinks = Array.from(element.querySelectorAll(':scope > div.quicklink'));

  // Defensive: If no quicklinks, do nothing
  if (!quicklinks.length) return;

  // Each quicklink: add full anchor content (icon + title) as a cell
  const columnsRow = quicklinks.map((quicklink) => {
    const link = quicklink.querySelector('a.quicklink__link');
    return link || document.createElement('div'); // fallback
  });

  // Table structure: header row (one cell), data row (one cell per column)
  const cells = [
    headerRow,         // first row: single header cell
    columnsRow         // second row: N cells, one for each quicklink
  ];

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
