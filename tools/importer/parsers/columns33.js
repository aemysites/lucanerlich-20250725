/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section root
  const section = element.querySelector('section.component.pioneering-work-component');
  if (!section) return;

  // -- LEFT COLUMN: Avatars/carousel images + ALL text content (headline, subtitle, description, link) --
  const leftCol = [];

  // Get avatar images from the carousel grid (in order)
  const grid = section.querySelector('.pioneering-work__grid');
  if (grid) {
    grid.querySelectorAll('img').forEach(img => leftCol.push(img));
  }

  // Get all text content from the text wrapper
  const textWrapper = section.querySelector('.pioneering-work__text-wrapper');
  if (textWrapper) {
    // Find the first .pioneering-work-item-content element (the active one, or fallback)
    let content = textWrapper.querySelector('.pioneering-work-item-content.active') || textWrapper.querySelector('.pioneering-work-item-content');
    if (content) {
      // Push all children (headings, subtitle, description, link) in order
      Array.from(content.children).forEach(child => leftCol.push(child));
    }
  }

  // -- RIGHT COLUMN: Main image (active in pioneering-work__image-wrapper) --
  let rightCol = [];
  const imageWrapper = section.querySelector('.pioneering-work__image-wrapper');
  if (imageWrapper) {
    const activeImgDiv = imageWrapper.querySelector('.pioneering-work-image-item.active') || imageWrapper.querySelector('.pioneering-work-image-item');
    if (activeImgDiv) {
      const img = activeImgDiv.querySelector('img');
      if (img) rightCol = [img];
    }
  }

  // Compose the table: header row and one content row (2 columns)
  const headerRow = ['Columns (columns33)'];
  const contentRow = [leftCol, rightCol];
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
