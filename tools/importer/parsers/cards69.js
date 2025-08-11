/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create an <img> from a background-image style, given a div
  function extractImageFromBg(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (match && match[1]) {
      const url = match[1];
      const img = document.createElement('img');
      img.src = url;
      // Try to set alt from aria-label if possible
      const alt = div.getAttribute('aria-label') || '';
      img.alt = alt;
      return img;
    }
    return null;
  }

  const rows = [['Cards (cards69)']];

  // Select all cards
  const cards = Array.from(element.querySelectorAll('.text-image-item'));
  cards.forEach(card => {
    // Image cell
    const imgBg = card.querySelector('.text-image-block-image-background');
    const imageEl = extractImageFromBg(imgBg);

    // Text cell
    const content = card.querySelector('.text-image-block-content');
    const textCellContent = [];

    if (content) {
      // Title (if exists)
      const titleWrapper = content.querySelector('.text-image-block-content-title');
      if (titleWrapper) {
        // Get the text content from the <div> inside title
        let headingText = '';
        const innerTitleDiv = titleWrapper.querySelector('div');
        if (innerTitleDiv) {
          headingText = innerTitleDiv.textContent.trim();
        } else {
          headingText = titleWrapper.textContent.trim();
        }
        // Use a <strong> for heading
        const heading = document.createElement('strong');
        heading.textContent = headingText;
        textCellContent.push(heading);
      }
      // Description (if exists)
      const desc = content.querySelector('.text-image-block-content-text');
      if (desc) {
        // Reference the actual <p> element
        textCellContent.push(desc);
      }
    }
    rows.push([imageEl, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
