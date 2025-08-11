/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the correct root section for cards26 (brochure-grid route-grid)
  const section = element.querySelector('section.brochure-grid.route-grid');
  if (!section) return;
  
  // Create table header row as per requirements
  const cells = [['Cards (cards26)']];

  // Find all card items
  const cards = section.querySelectorAll('li.brochure-grid-element');
  cards.forEach(card => {
    // First column: image (from .brochure-grid-image-background background-image)
    let imageEl = null;
    const imgBg = card.querySelector('.brochure-grid-image-background');
    if (imgBg && imgBg.style && imgBg.style.backgroundImage) {
      const match = imgBg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        imageEl = document.createElement('img');
        imageEl.src = match[1];
        imageEl.alt = '';
      }
    }

    // Second column: title, description, cta (all present in card)
    const frag = document.createDocumentFragment();
    // Title (h4.route-grid-title)
    const title = card.querySelector('h4.route-grid-title');
    if (title && title.textContent.trim()) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.trim();
      frag.appendChild(h);
      frag.appendChild(document.createElement('br'));
    }
    // Description (div.brochure-grid-description)
    const desc = card.querySelector('div.brochure-grid-description');
    if (desc && desc.textContent.trim()) {
      frag.appendChild(document.createTextNode(desc.textContent.trim()));
      frag.appendChild(document.createElement('br'));
    }
    // CTA (a.route-grid-button)
    const cta = card.querySelector('a.route-grid-button');
    if (cta && cta.textContent.trim()) {
      frag.appendChild(cta); // Reference the existing CTA element directly
    }
    // Remove trailing <br> if present
    if (frag.lastChild && frag.lastChild.nodeName === 'BR') {
      frag.removeChild(frag.lastChild);
    }
    cells.push([
      imageEl,
      frag
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  section.replaceWith(table);
}
