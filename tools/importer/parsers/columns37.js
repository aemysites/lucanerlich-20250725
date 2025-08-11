/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row: exactly one cell
  const headerRow = ['Columns (columns37)'];

  // Each child <li> is a column
  const columns = Array.from(element.querySelectorAll(':scope > li')).map(li => li);

  // Structure: first row = header, second row = all columns (one per <li>)
  const cells = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
