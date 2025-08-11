/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  let columns = [];
  if (row) {
    const colDivs = Array.from(row.children);
    columns = colDivs.map(col => {
      // If it contains a heading, use just that
      const heading = col.querySelector('.text-block-title');
      if (heading) return heading;
      // If it contains .text-block-content, use that
      const content = col.querySelector('.text-block-content');
      if (content) return content;
      // Otherwise fallback to entire column
      return col;
    });
  }
  // Table header row as a single cell
  const headerRow = ['Columns (columns75)'];
  // The content row consists of the columns
  const rows = [headerRow];
  if (columns.length > 0) {
    rows.push(columns);
  } else {
    // fallback: put entire element in one cell if structure is not as expected
    rows.push([element]);
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
