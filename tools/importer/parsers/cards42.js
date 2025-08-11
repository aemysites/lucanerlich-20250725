/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the side-column related articles section (cards block).
  const section = element.querySelector('section.expertise__index-curated--blogpost');
  if (!section) return;
  // Find the vertical list of related article cards (not the carousel)
  const cardList = section.querySelector('article.expertise__index-list-view');
  if (!cardList) return;
  // Each card is in .expertise__index-page-info.row
  const cardRows = cardList.querySelectorAll('.expertise__index-page-info.row');
  const cells = [ ['Cards (cards42)'] ];
  cardRows.forEach(card => {
    // IMAGE CELL: Extract background image URL from .expertise__index-page-thumbnail
    let imageEl = null;
    const thumb = card.querySelector('.expertise__index-thumbnail-container .expertise__index-page-thumbnail');
    if (thumb) {
      let bg = thumb.style.backgroundImage || thumb.getAttribute('data-da-cssbgimage') || '';
      const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imageEl = document.createElement('img');
        imageEl.src = urlMatch[1];
        imageEl.alt = '';
      }
    }
    // TEXT CELL: Reference and preserve all text content, including strong, br, and links, from info text column
    const textWrap = card.querySelector('.expertise__index-page-info-text');
    let textCell = '';
    if (textWrap) {
      // Reference the existing element to preserve structure and inline elements
      textCell = Array.from(textWrap.childNodes).filter(n => {
        // Remove empty nodes
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
        return true;
      });
      // If only one node and it's a text node, just use it as a string
      if (textCell.length === 1 && textCell[0].nodeType === Node.TEXT_NODE) {
        textCell = textCell[0].textContent;
      } else if (textCell.length === 0) {
        textCell = '';
      }
    }
    cells.push([imageEl, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
