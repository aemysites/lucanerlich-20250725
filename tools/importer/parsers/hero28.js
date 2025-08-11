/* global WebImporter */
export default function parse(element, { document }) {
  // Block name as header
  const headerRow = ['Hero (hero28)'];

  // Find the overlay image div for background image
  let backgroundImgEl = null;
  const overlayImageDiv = element.querySelector('.hero__overlay-image');
  if (overlayImageDiv) {
    const style = overlayImageDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/);
    if (match && match[1]) {
      const src = match[1].replace(/['"]/g, '').trim();
      if (src) {
        // Reference the single img element
        backgroundImgEl = document.createElement('img');
        backgroundImgEl.src = src;
      }
    }
  }

  // The provided HTML does not include any headline, subheading, or call-to-action,
  // so the details cell remains empty for this input

  const cells = [
    headerRow,
    [backgroundImgEl ? backgroundImgEl : ''],
    ['']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
