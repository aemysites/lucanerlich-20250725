/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // Get the accordion title (from .accordion-header)
  let accordionTitle = '';
  const headerDiv = element.querySelector('.accordion-header');
  if (headerDiv) {
    const triggerLink = headerDiv.querySelector('a.trigger');
    if (triggerLink) {
      const h2 = triggerLink.querySelector('h2');
      accordionTitle = h2 ? h2.textContent.trim() : triggerLink.textContent.trim();
    }
  }
  const titleElem = document.createElement('p');
  titleElem.textContent = accordionTitle;

  // Extract intro paragraph, spreadsheet blocks
  let introPara = null;
  let spreadsheetDivs = [];
  const contentDiv = element.querySelector('.accordion-content');
  if (contentDiv) {
    const innerDiv = contentDiv.querySelector('.accordion-inner');
    if (innerDiv) {
      // Find the intro paragraph (the paragraph before any .spreadsheet)
      for (const child of innerDiv.children) {
        if (child.classList.contains('paragraph')) {
          introPara = child;
        }
        if (child.classList.contains('spreadsheet')) {
          break;
        }
      }
      // All spreadsheet sections
      spreadsheetDivs = Array.from(innerDiv.querySelectorAll(':scope > .spreadsheet'));
    }
  }

  // For each spreadsheet, create a table row
  spreadsheetDivs.forEach((spreadsheet, i) => {
    const frag = document.createDocumentFragment();
    // Only for the first spreadsheet, add the intro paragraph on top
    if (i === 0 && introPara) {
      frag.appendChild(introPara);
    }
    // Add table (required)
    const tableWrapper = spreadsheet.querySelector('.spreadsheet__table-wrapper');
    const table = tableWrapper ? tableWrapper.querySelector('table') : null;
    if (table) {
      frag.appendChild(table);
    }
    // Add download link, if present
    const downloadLink = spreadsheet.querySelector('.spreadsheet-tools__xls-link');
    if (downloadLink) {
      const p = document.createElement('p');
      p.appendChild(downloadLink);
      frag.appendChild(p);
    }
    // Push this row: [title, content]
    rows.push([titleElem.cloneNode(true), frag]);
  });

  // Replace only if there are spreadsheet entries
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
