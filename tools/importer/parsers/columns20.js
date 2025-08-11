/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main text block component
  const textBlock = element.querySelector('.component.text-block');
  if (!textBlock) return;

  // The row containing the columns
  const row = textBlock.querySelector('.row');
  if (!row) return;

  // Get immediate child columns
  const columns = Array.from(row.children);

  // For each column, collect all its children (to ensure all content, including text, headings, lists)
  const cellContents = columns.map(col => {
    // If there are children, collect them all
    const kids = Array.from(col.childNodes);
    // Filter out empty text nodes
    const filteredKids = kids.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // Return single element, array, or col itself if no children
    if (filteredKids.length === 1) {
      return filteredKids[0];
    } else if (filteredKids.length > 1) {
      return filteredKids;
    } else {
      return col;
    }
  });

  // The header row must be EXACTLY one cell, even if there are multiple columns below
  const cells = [
    ['Columns (columns20)'], // One cell header row
    cellContents             // Content row with multiple cells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
