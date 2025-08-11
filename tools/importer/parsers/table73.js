/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .table-block element, or fallback to the element itself
  let blockRoot = element.querySelector('.table-block');
  if (!blockRoot) blockRoot = element;

  // Find the block title, if any
  const blockTitle = blockRoot.querySelector('.table-block-title');

  // Find the main table block wrapper (contains both the table(s) and other content)
  const tableWrapper = blockRoot.querySelector('.table-block-wrapper');

  // Prepare the content cell content: include blockTitle and all content from tableWrapper
  // (this ensures ALL contained text and tables are present)
  const cellContent = [];
  if (blockTitle) cellContent.push(blockTitle);
  if (tableWrapper) {
    // Include everything in the wrapper (this brings in all tables and any related text)
    Array.from(tableWrapper.childNodes).forEach((node) => {
      // Only add non-empty nodes
      if (
        (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('table'))) ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        cellContent.push(node);
      }
    });
  } else {
    // Fallback: include all children except blockTitle
    Array.from(blockRoot.childNodes).forEach((child) => {
      if (!blockTitle || child !== blockTitle) {
        if (
          (child.nodeType === 1 && (child.textContent.trim() || child.querySelector('table'))) ||
          (child.nodeType === 3 && child.textContent.trim())
        ) {
          cellContent.push(child);
        }
      }
    });
  }

  // Build the table block
  const headerRow = ['Table (table73)'];
  const cells = [
    headerRow,
    [cellContent],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
