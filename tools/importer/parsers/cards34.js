/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly and be a single column.
  const headerRow = ['Cards (cards34)'];

  // Get all the card columns directly under the main row
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];

  cardDivs.forEach(cardDiv => {
    // First cell: image (should reference the actual <img> element in the card)
    const logoDiv = cardDiv.querySelector('.footer-disclaimer-logo');
    let img = null;
    if (logoDiv) {
      img = logoDiv.querySelector('img');
    }
    // Defensive: skip if no image found
    if (!img) return;

    // Second cell: all text content relevant to this logo card
    // For this block, use alt text from image as the 'title', bolded/strong
    const altText = (img.getAttribute('alt') || '').trim();
    const strong = document.createElement('strong');
    strong.textContent = altText;
    const cellContent = [strong];

    // Collect any additional meaningful text from the cardDiv (if present in source html), excluding logoDiv
    Array.from(cardDiv.childNodes).forEach(node => {
      if (node === logoDiv) return;
      if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        cellContent.push(p);
      } else if (node.nodeType === 1 && node.textContent.trim()) {
        cellContent.push(node);
      }
    });

    rows.push([img, cellContent]);
  });

  if (rows.length === 0) return;
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
