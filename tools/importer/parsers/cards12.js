/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Get all card <li> elements
  const cards = element.querySelectorAll('ul.brochure-grid-component-elements > li.brochure-grid-element');
  cards.forEach((card) => {
    // --- IMAGE CELL ---
    let imageEl = null;
    const bgDiv = card.querySelector('.brochure-grid-image-background');
    // Extract image src from background-image style
    if (bgDiv && bgDiv.style.backgroundImage) {
      const urlMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        imageEl = document.createElement('img');
        imageEl.src = urlMatch[1];
        imageEl.alt = '';
      }
    }

    // --- TEXT CELL ---
    const cellParts = [];
    // Title (as <strong>, preserves semantic bold)
    const title = card.querySelector('.route-grid-title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      cellParts.push(strong);
    }
    // Description (below Title)
    const desc = card.querySelector('.brochure-grid-description');
    if (desc && desc.textContent.trim()) {
      // If title exists, add a <br>
      if (cellParts.length) {
        cellParts.push(document.createElement('br'));
      }
      const span = document.createElement('span');
      span.textContent = desc.textContent.trim();
      cellParts.push(span);
    }
    // CTA link (if any)
    const cta = card.querySelector('.route-grid-button');
    if (cta && cta.textContent.trim()) {
      // Add <br> above CTA if there's other text
      if (cellParts.length) {
        cellParts.push(document.createElement('br'));
      }
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = cta.childNodes[0].textContent.trim();
      link.target = cta.target || '_self';
      cellParts.push(link);
    }

    rows.push([
      imageEl,
      cellParts
    ]);
  });

  // Create the block table.
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
