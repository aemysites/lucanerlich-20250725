/* global WebImporter */
export default function parse(element, { document }) {
  // Build the block header row
  const headerRow = ['Table (no header, tableNoHeader8)'];
  const cells = [headerRow];

  // Reference the main container if present
  let mainContainer = element;
  const article = element.querySelector('article.table-block-container');
  if (article) mainContainer = article;

  // Gather elements for the content cell
  const contentEls = [];

  // Add the block title (if present)
  const titleEl = mainContainer.querySelector('.table-block-title, h2, h3');
  if (titleEl) contentEls.push(titleEl);

  // Find the desktop table (prefer for full content)
  let tableDiv = mainContainer.querySelector('.original-table');
  if (!tableDiv) tableDiv = mainContainer.querySelector('.custom-table');
  if (tableDiv) {
    const table = tableDiv.querySelector('table');
    if (table) contentEls.push(table);
  }

  // Fallback: If no table found, include all children of mainContainer
  if (contentEls.length === 0) {
    Array.from(mainContainer.children).forEach(child => {
      if (child !== titleEl) contentEls.push(child);
    });
  }

  // Only add a content row if we have at least one element (to avoid empty rows)
  if (contentEls.length) {
    cells.push([contentEls]);
  }

  // Create and replace with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
