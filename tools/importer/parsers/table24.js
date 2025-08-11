/* global WebImporter */
export default function parse(element, { document }) {
  // Find all download tables by known classes
  const tableClasses = [
    'name-downloads-pdf',
    'name-downloads-xls',
    'name-dll-analysts'
  ];

  tableClasses.forEach((tableClass) => {
    const table = element.querySelector(`table.${tableClass}`);
    if (!table) return;

    // Set block name for all as 'Table (table24)'
    const headerRow = ['Table (table24)'];
    const cells = [headerRow];

    // Process rows (skip <thead> row)
    const tbodyRows = Array.from(table.querySelectorAll('tbody > tr'));

    tbodyRows.forEach((tr) => {
      const tds = Array.from(tr.children);
      // For PDF and analysts tables (5 columns):
      // [Title/link, (gap), pages, (gap), size]
      // For XLSX table (3 columns):
      // [Title/link, (gap), size]
      if (tableClass === 'name-downloads-pdf' || tableClass === 'name-dll-analysts') {
        // Defensive: skip empty rows
        if (tds.length < 5) return;
        const title = tds[0].querySelector('a') ? tds[0] : document.createTextNode(tds[0].textContent.trim());
        const pages = tds[2] ? (tds[2].innerHTML.trim() ? tds[2] : document.createTextNode(tds[2].textContent.trim())) : document.createTextNode('');
        const size = tds[4] ? (tds[4].innerHTML.trim() ? tds[4] : document.createTextNode(tds[4].textContent.trim())) : document.createTextNode('');
        cells.push([title, pages, size]);
      } else if (tableClass === 'name-downloads-xls') {
        // Defensive: skip empty rows
        if (tds.length < 3) return;
        const title = tds[0].querySelector('a') ? tds[0] : document.createTextNode(tds[0].textContent.trim());
        const size = tds[2] ? (tds[2].innerHTML.trim() ? tds[2] : document.createTextNode(tds[2].textContent.trim())) : document.createTextNode('');
        cells.push([title, size]);
      }
    });

    // Create and replace block table
    const block = WebImporter.DOMUtils.createTable(cells, document);
    table.replaceWith(block);
  });
}
