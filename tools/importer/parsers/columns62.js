/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the block container
  const blockContainer = element.querySelector('.text-image-block-container');
  if (!blockContainer) {
    element.replaceWith(WebImporter.DOMUtils.createTable([
      ['Columns (columns62)'],
      [element]
    ], document));
    return;
  }

  // 2. Find the image and content columns
  let imageCell = '';
  let contentCell = '';

  // IMAGE CELL
  const imageCol = blockContainer.querySelector('.text-image-block-image');
  if (imageCol) {
    const imgBg = imageCol.querySelector('.text-image-block-image-background');
    if (imgBg && imgBg.style.backgroundImage) {
      const urlMatch = imgBg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        img.alt = imgBg.getAttribute('aria-label') || '';
        imageCell = img;
      }
    }
    if (!imageCell) imageCell = imageCol;
  }

  // CONTENT CELL
  const contentCol = blockContainer.querySelector('.text-image-block-content');
  if (contentCol) {
    const contentCellItems = [];
    const p = contentCol.querySelector('p');
    if (p) contentCellItems.push(p);
    const a = contentCol.querySelector('a');
    if (a) contentCellItems.push(a);
    contentCell = contentCellItems.length ? contentCellItems : contentCol;
  }

  // 3. Compose the table manually to ensure correct header colspan
  const numCols = [imageCell, contentCell].filter(Boolean).length;

  // Create the table
  const table = document.createElement('table');

  // Header row with single cell that spans all columns
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns62)';
  if (numCols > 1) th.setAttribute('colspan', numCols);
  trHeader.appendChild(th);
  table.appendChild(trHeader);

  // Data row with one cell for each column
  const trContent = document.createElement('tr');
  [imageCell, contentCell].forEach(cell => {
    const td = document.createElement('td');
    if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (cell) {
      td.append(cell);
    } else {
      td.innerHTML = '';
    }
    trContent.appendChild(td);
  });
  table.appendChild(trContent);

  element.replaceWith(table);
}
