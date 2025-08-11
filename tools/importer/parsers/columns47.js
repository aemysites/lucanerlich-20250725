/* global WebImporter */
export default function parse(element, { document }) {
  // Get the wrapper div
  const wrapper = element.querySelector('.inner.wrapper');
  if (!wrapper) return;

  // First column: extra links
  const extraLinks = wrapper.querySelector('.extra-links-footer');
  let extraLinksCol = '';
  if (extraLinks) extraLinksCol = extraLinks;

  // Find all columns in important-topics-container
  const topicsContainer = wrapper.querySelector('.important-topics-container');
  let topicCols = [];
  if (topicsContainer) {
    const topicDivs = Array.from(topicsContainer.querySelectorAll(':scope > .important-topics'));
    topicCols = topicDivs;
  }

  // Compose header row as a single cell (array with one string)
  const headerRow = ['Columns (columns47)']; // <-- only ONE column in header

  // Compose columns row (first col: extraLinksCol, others: topicCols)
  const columnsRow = [extraLinksCol, ...topicCols];
  // Always produce exactly four columns, pad with empty string if needed
  while (columnsRow.length < 4) {
    columnsRow.push('');
  }
  // Only two rows: header (1 col), content (4 cols)
  const cells = [headerRow, columnsRow];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
