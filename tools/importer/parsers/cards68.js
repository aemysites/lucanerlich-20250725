/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get image from the background-image style of the appropriate div
  function extractImage(div) {
    const bgDiv = div.querySelector('.text-image-block-image-background');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
      if (match && match[1]) {
        const url = match[1];
        const alt = bgDiv.getAttribute('aria-label') || '';
        const img = document.createElement('img');
        img.src = url;
        if (alt) img.alt = alt;
        return img;
      }
    }
    return '';
  }

  // Main content extraction
  const cards = [];
  // Find all direct text-image-item elements (the cards)
  const items = element.querySelectorAll('.text-image-item');
  items.forEach(item => {
    const container = item.querySelector('.text-image-block-container');
    if (!container) return;
    // Left: Image
    const imageCol = container.querySelector('.text-image-block-image');
    let img = null;
    if (imageCol) {
      img = extractImage(imageCol);
    }
    // Right: Content
    const contentCol = container.querySelector('.text-image-block-content');
    const cellContent = [];
    if (contentCol) {
      // Title: h2, may have a div inside
      const h2 = contentCol.querySelector('h2');
      if (h2) {
        // Use its text content, maintain heading structure (strong for card)
        const strong = document.createElement('strong');
        strong.textContent = h2.textContent.trim();
        cellContent.push(strong);
      }
      // Description: p
      const desc = contentCol.querySelector('p');
      if (desc) {
        if (cellContent.length > 0) cellContent.push(document.createElement('br'));
        cellContent.push(desc);
      }
      // CTA: a.button
      const cta = contentCol.querySelector('a.button');
      if (cta) {
        if (cellContent.length > 0) cellContent.push(document.createElement('br'));
        cellContent.push(cta);
      }
    }
    cards.push([img, cellContent]);
  });
  const headerRow = ['Cards (cards68)'];
  const tableRows = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
