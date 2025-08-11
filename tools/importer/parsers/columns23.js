/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container for the expertise tiles
  const tilesContainer = element.querySelector('.expertise__index-tiles');
  if (!tilesContainer) return;

  // We'll collect all columns into an array for the block row
  const columns = [];
  // Each li in the ul is a tile/column
  const tiles = tilesContainer.querySelectorAll(':scope > li');
  tiles.forEach((li) => {
    // Inside the tile, get the main content section
    const section = li.querySelector('section');
    if (!section) return;
    const cellContent = [];

    // 1. Include the left visual or image (background-image)
    const thumbDiv = section.querySelector('.expertise__index-page-thumbnail');
    if (thumbDiv) {
      const style = thumbDiv.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        cellContent.push(img);
      }
    }

    // 2. Include the text/article content, referencing the *existing* element
    const textContainer = section.querySelector('.expertise__index-page-text-container');
    if (textContainer) {
      cellContent.push(textContainer);
    }

    // If only one element, just push that. Otherwise, push all as array
    columns.push(cellContent.length === 1 ? cellContent[0] : cellContent);
  });

  // The table header, exactly as required by the block spec
  const cells = [
    ['Columns (columns23)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
