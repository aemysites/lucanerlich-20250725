/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that holds all columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find all immediate children that are textblock columns
  const columns = Array.from(grid.children)
    .filter((child) => child.classList.contains('textblock'));

  // For each column, gather the content (title + content block)
  const columnContents = columns.map((col) => {
    const titleEl = col.querySelector('.text-block-title');
    const contentEl = col.querySelector('.text-block-content');
    const cellParts = [];
    if (titleEl) cellParts.push(titleEl);
    if (contentEl) cellParts.push(contentEl);
    return cellParts;
  });

  // Header row: exactly one cell with block name
  const headerRow = ['Columns (columns59)'];
  // Content row: as many columns as needed
  const rows = [headerRow, columnContents];

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
