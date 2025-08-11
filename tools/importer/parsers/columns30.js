/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build header row: single cell, exactly as in example
  const headerRow = ['Columns (columns30)'];

  // Second row: one cell for each column's relevant content
  const contentRow = columns.map((col) => {
    // For date
    const date = col.querySelector('.et-header-info-value-date');
    if (date) return date;
    // For website
    const website = col.querySelector('a.et-header-info-value[href]');
    if (website) return website;
    // For location
    const address = col.querySelector('address');
    if (address) return address;
    // Fallback: reference whole column
    return col;
  });

  // Table cells structure: header is a single cell, second row has N cells
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
