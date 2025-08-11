/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row: one cell only, per example
  const headerRow = ['Columns (columns32)'];
  // Gather all direct child column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, collect its child nodes as a fragment
  const contentRow = columns.map((col) => {
    const fragment = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((child) => {
      // Only skip pure-whitespace text nodes
      if (child.nodeType === 3 && !child.textContent.trim()) return;
      fragment.appendChild(child);
    });
    return fragment;
  });
  // Create the table: header row (1 cell), then one row with as many columns as needed
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
