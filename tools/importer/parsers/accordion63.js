/* global WebImporter */
export default function parse(element, { document }) {
  // Start with header row per block requirements
  const rows = [['Accordion (accordion63)']];

  // Find the introductory <p> if present (first child of .accordion-inner)
  const inner = element.querySelector('.accordion-inner');
  let introPara = null;
  let children = [];
  if (inner) {
    children = Array.from(inner.children);
    if (children.length && children[0].tagName === 'P') {
      introPara = children[0];
      children = children.slice(1);
    }
  }

  // Each spreadsheet block is an accordion item
  // For each .spreadsheet inside .accordion-inner
  const spreadsheets = inner ? Array.from(inner.querySelectorAll(':scope > .spreadsheet')) : [];
  spreadsheets.forEach((spreadsheet, idx) => {
    // Title: Try spreadsheet's table caption, or table thead's first th, or fallback to empty string
    let titleText = '';
    const table = spreadsheet.querySelector('table');
    if (table) {
      const caption = table.querySelector('caption');
      if (caption) {
        titleText = caption.textContent.trim();
      } else {
        // Try thead > th
        const theadTh = table.querySelector('thead th');
        if (theadTh) {
          titleText = theadTh.textContent.trim();
        }
      }
    }
    // Fallback if no table or caption
    if (!titleText) {
      titleText = spreadsheet.textContent.trim().slice(0, 80);
    }

    // Content cell: For first spreadsheet, prepend the intro paragraph if present
    let contentList = [];
    if (introPara && idx === 0) {
      contentList.push(introPara);
    }
    // Download link if present
    const downloadLink = spreadsheet.querySelector('a[href]');
    if (downloadLink) {
      contentList.push(downloadLink);
    }
    if (table) {
      contentList.push(table);
    }
    // If nothing found, just use spreadsheet
    if (!contentList.length) {
      contentList = [spreadsheet];
    }

    rows.push([titleText, contentList]);
  });

  // If there are no spreadsheet blocks, do not attempt to output empty accordion
  if (rows.length === 1) {
    element.replaceWith(document.createComment('Accordion block skipped (no spreadsheet blocks found)'));
    return;
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
