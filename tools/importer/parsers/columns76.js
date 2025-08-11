/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match the block name exactly
  const headerRow = ['Columns (columns76)'];
  
  // Get the first (and only) li.featured-product-item (one row of columns)
  const li = element.querySelector('.featured-product-list > .featured-product-item');
  if (!li) return;

  // Left column: possibly image
  let leftContent = null;
  const leftDiv = li.querySelector('.featured-product-item-image');
  if (leftDiv) {
    // Per spec, prefer .img-constrained--active, else any img
    leftContent = leftDiv.querySelector('.img-constrained--active') || leftDiv.querySelector('img');
  }

  // Right column: heading and content
  let rightContent = [];
  const rightDiv = li.querySelector('.featured-product-item-content');
  if (rightDiv) {
    // Heading
    const heading = rightDiv.querySelector('.featured-product-item-content-title');
    if (heading) rightContent.push(heading);
    // All children of featured-product-item-content-text (typically <p> etc)
    const textDiv = rightDiv.querySelector('.featured-product-item-content-text');
    if (textDiv) {
      Array.from(textDiv.children).forEach(child => rightContent.push(child));
    }
  }

  // Each row is an array: [leftCol, rightCol]
  const row = [leftContent, rightContent];
  const cells = [headerRow, row];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
