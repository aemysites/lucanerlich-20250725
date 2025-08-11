/* global WebImporter */
export default function parse(element, { document }) {
  // Find the parent container for the content
  const container = element.querySelector('.container');
  let row = null;
  if (container) {
    row = container.querySelector('.row');
  }
  if (!row) {
    row = element.querySelector('.row');
  }

  // Default columns in case structure is not as expected
  let leftContent = null;
  let rightContent = null;

  if (row) {
    // Get first two direct children (columns)
    const cols = row.querySelectorAll(':scope > div');
    if (cols.length > 0) {
      // LEFT: heading column (title)
      // Find the first heading (h1/2/3) inside the first column, or use whole column
      const heading = cols[0].querySelector('h1, h2, h3, .text-block-title');
      leftContent = heading ? heading : cols[0];
    }
    if (cols.length > 1) {
      // RIGHT: paragraphs column (text)
      const rightBlock = cols[1].querySelector('.text-block-content');
      rightContent = rightBlock ? rightBlock : cols[1];
    }
  }

  // Fallback for empty columns
  if (!leftContent) leftContent = document.createTextNode('');
  if (!rightContent) rightContent = document.createTextNode('');

  // Compose cells for table
  const cells = [
    // Header row with single cell (will be set to colspan=2 after creation)
    ['Columns (columns3)'],
    [leftContent, rightContent],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Fix: set header cell to colspan=2 to span both columns
  const headerRow = block.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
