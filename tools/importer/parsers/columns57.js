/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row (must be exactly one cell)
  const headerRow = ['Columns (columns57)'];

  // Find the .row container holding the columns (if present)
  const row = element.querySelector('.row');
  if (!row) return;

  // Each immediate child of .row is a column
  const columnDivs = Array.from(row.children);

  // For each column, collect all its content (preserves semantic structure)
  const columnsContent = columnDivs.map(col => {
    // If column is empty, use empty string
    if (!col || !col.children || col.children.length === 0) return '';
    // Prefer all children for maximum compatibility
    return Array.from(col.children).length === 1 ? col.firstElementChild : Array.from(col.children);
  });

  // Only build the table if at least one column has content
  if (!columnsContent.some(cell => cell && (typeof cell === 'string' ? cell.trim() : true))) return;

  // Final table: header row (single cell), then one row with N cells for columns
  const tableArray = [headerRow, columnsContent];
  const blockTable = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(blockTable);
}
