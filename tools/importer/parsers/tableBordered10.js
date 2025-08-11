/* global WebImporter */
export default function parse(element, { document }) {
  // Find the spreadsheet table
  const tableWrapper = element.querySelector('.spreadsheet__table-wrapper');
  const spreadsheetTable = tableWrapper && tableWrapper.querySelector('table');
  if (!spreadsheetTable) return;

  // Create the block header row
  const headerRow = ['Table (bordered)'];

  // Extract the actual column headers (from <th> in thead, not tds, and skip spacing columns)
  let tableHeader = [];
  const thead = spreadsheetTable.querySelector('thead');
  if (thead) {
    const tr = thead.querySelector('tr');
    if (tr) {
      // Only pick <th> that are not spacing/empty
      const ths = Array.from(tr.children).filter(cell =>
        cell.tagName.toLowerCase() === 'th' &&
        !cell.classList.contains('inbetween') &&
        !cell.classList.contains('empty')
      );
      tableHeader = ths.map(th => {
        // Use all child nodes for formatting
        return th.childNodes.length > 0 ? Array.from(th.childNodes) : th.textContent.trim();
      });
    }
  }

  // Extract body rows, only real data columns matching header count
  let dataBodyRows = [];
  const tbody = spreadsheetTable.querySelector('tbody');
  if (tbody && tableHeader.length) {
    tbody.querySelectorAll('tr').forEach((tr) => {
      // Only pick cells that are not spacing/empty and match the number of headers
      const cells = Array.from(tr.children).filter(td =>
        (td.tagName.toLowerCase() === 'td' || td.tagName.toLowerCase() === 'th') &&
        !td.classList.contains('inbetween') &&
        !td.classList.contains('empty')
      );
      // Ignore rows that are completely empty or are the wrong length
      const allEmpty = cells.every(cell => cell.textContent.replace(/\s|\u00a0/g, '') === '');
      if (cells.length === tableHeader.length && !allEmpty) {
        // Use all child nodes for each cell
        const rowData = cells.map(td => td.childNodes.length > 0 ? Array.from(td.childNodes) : td.textContent.trim());
        dataBodyRows.push(rowData);
      }
    });
  }

  // Compose cells array
  const cells = [
    headerRow,
    tableHeader,
    ...dataBodyRows
  ];
  // No footnote row (as per markdown example)

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
