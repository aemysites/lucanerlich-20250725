/* global WebImporter */
export default function parse(element, { document }) {
  // Find all featured card wrappers (direct children) within the supplied element
  const cardEls = Array.from(element.querySelectorAll('.featured-image-text'));

  // Prepare block table header
  const headerRow = ['Cards (cards48)'];
  const rows = [headerRow];

  cardEls.forEach(cardEl => {
    // Find the main card content section
    const section = cardEl.querySelector('section.featured-component');
    if (!section) return;

    // Extract the prominent image for the card
    let img = null;
    const imgWrap = section.querySelector('.featured-component__image');
    if (imgWrap) {
      // Take the visible/active image only (should always be present)
      img = imgWrap.querySelector('img.img-constrained--active');
    }

    // Extract text content for the card
    const contentWrap = section.querySelector('.featured-component__content');
    const contentArray = [];
    if (contentWrap) {
      // Title (heading)
      const title = contentWrap.querySelector('.featured-component__content-title');
      if (title) contentArray.push(title);

      // Description (paragraph or div)
      const desc = contentWrap.querySelector('.featured-component__content-text');
      if (desc) contentArray.push(desc);

      // CTA Button (link)
      const cta = contentWrap.querySelector('a.button');
      if (cta) contentArray.push(cta);
    }

    // Only add row if there's either an image or text content
    if (img || contentArray.length) {
      rows.push([
        img,
        contentArray
      ]);
    }
  });

  // Create and replace with the new block table if there are enough cards (at least header + one row)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
