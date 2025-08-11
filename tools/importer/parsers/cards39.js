/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards39)'];
  // Get all the card elements (they are <a> children)
  const cards = Array.from(element.querySelectorAll(':scope > a.product-categories-item'));
  const rows = cards.map(card => {
    // Image cell: find the image inside the card
    const imgWrapper = card.querySelector('.product-categories-item-img-wrapper');
    let imgEl = imgWrapper ? imgWrapper.querySelector('img') : null;
    // Text cell: get title, description, and possible CTA
    const content = document.createElement('div');
    const title = card.querySelector('.product-categories-item-title');
    const desc = card.querySelector('.product-categories-item-copy');
    if (title) {
      // Retain heading level if present, else use strong
      const heading = document.createElement('strong');
      heading.textContent = title.textContent;
      content.appendChild(heading);
    }
    if (desc) {
      if (title) content.appendChild(document.createElement('br'));
      content.appendChild(desc);
    }
    // No CTA per provided HTML structure
    return [imgEl, content];
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
