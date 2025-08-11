/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: find all spreadsheet tables directly in the element
  function getTables(container) {
    // Only tables that are inside spreadsheet__table-wrapper
    return Array.from(container.querySelectorAll('.spreadsheet__table-wrapper > table'));
  }

  // Map captions to table column headers (must match the example structure)
  function getHeaders(table) {
    const caption = table.querySelector('caption');
    const capText = caption ? caption.textContent.trim().toLowerCase() : '';
    // PDF table: "Product Name", "Pages", "Size"
    if (capText.includes('pdf')) {
      return ['Product Name', 'Pages', 'Size'];
    }
    // XLSX table: "Product Name", "Size"
    if (capText.includes('xlsx')) {
      return ['Product Name', 'Size'];
    }
    // Analyst table: "Product Name", "Pages", "Size"
    if (capText.includes('analyst')) {
      return ['Product Name', 'Pages', 'Size'];
    }
    // Default fallback
    return ['Product Name'];
  }

  // Extract rows from a table
  function extractRows(table, headers) {
    const rows = [];
    const tb = table.querySelector('tbody');
    if (!tb) return rows;
    for (const tr of tb.querySelectorAll('tr')) {
      const tds = Array.from(tr.querySelectorAll('td'));
      if (!tds.length) continue;
      // File (always first cell)
      let fileCell = tds[0].querySelector('a');
      if (!fileCell) fileCell = tds[0];
      // Pages (PDF/analyst only)
      let pagesCell = null;
      if (headers.includes('Pages')) {
        // For PDF/analyst: pages is the 3rd td (index 2)
        pagesCell = tds.length > 2 ? tds[2] : null;
        if (pagesCell && pagesCell.textContent.replace(/\s/g, '') === '') pagesCell = null;
      }
      // Size (always last cell)
      let sizeCell = null;
      if (headers.includes('Size')) {
        sizeCell = tds[tds.length-1];
      }
      // Compose row
      const row = [];
      // Product Name (render as link if exists)
      if (fileCell && fileCell.tagName === 'A') {
        row.push(fileCell);
      } else if (fileCell) {
        row.push(fileCell.textContent.trim());
      } else {
        row.push('');
      }
      if (headers.includes('Pages')) {
        if (pagesCell) {
          const strong = pagesCell.querySelector('strong');
          if (strong) {
            row.push(strong.textContent.trim());
          } else {
            row.push(pagesCell.textContent.trim());
          }
        } else {
          row.push('');
        }
      }
      if (headers.includes('Size')) {
        if (sizeCell) {
          const strong = sizeCell.querySelector('strong');
          if (strong) {
            row.push(strong.textContent.trim());
          } else {
            row.push(sizeCell.textContent.trim());
          }
        } else {
          row.push('');
        }
      }
      rows.push(row);
    }
    return rows;
  }

  // Compose all extracted tables into separate block tables (one per source table)
  const tables = getTables(element);
  tables.forEach((table) => {
    // Build block for each table
    const cells = [];
    // Header row: block name
    cells.push(['Table (striped, bordered)']);
    // Subheader: use table caption text as a strong element
    const captionEl = table.querySelector('caption');
    const subHeader = document.createElement('strong');
    subHeader.textContent = captionEl ? captionEl.textContent.trim() : '';
    cells.push([subHeader]);
    // Column header row
    const headers = getHeaders(table);
    cells.push(headers);
    // Data rows
    const dataRows = extractRows(table, headers);
    for (const row of dataRows) {
      cells.push(row);
    }
    // Create block table and insert
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    // Insert after the table's parent spreadsheet__table-wrapper
    const parentWrapper = table.closest('.spreadsheet__table-wrapper');
    if (parentWrapper && parentWrapper.parentNode) {
      parentWrapper.parentNode.insertBefore(blockTable, parentWrapper);
      parentWrapper.remove();
    }
  });
  // Finally, remove the main element after processing all blocks if it's empty
  if (element.parentNode && element.childNodes.length === 0) {
    element.parentNode.removeChild(element);
  }
}
