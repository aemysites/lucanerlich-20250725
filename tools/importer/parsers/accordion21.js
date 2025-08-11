/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, each section gets [title, content]
  // Header must be: Accordion (accordion21)
  // Each row pulls h2 title and its associated content block

  // Accumulate accordion sections from the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const blocks = Array.from(grid.children);
  const rows = [];

  blocks.forEach(block => {
    // TEXT BLOCKS
    const textTitle = block.querySelector('.text-block-title');
    const textContent = block.querySelector('.text-block-content');
    if (textTitle && textContent) {
      // Use the original elements from the DOM (reference, do not clone)
      rows.push([textTitle, textContent]);
      return;
    }
    // TEXT IMAGE BLOCKS
    const imageTitle = block.querySelector('.text-image-block-content-title');
    if (imageTitle) {
      // The title is inside a div by itself
      const innerTitle = imageTitle.querySelector('div');
      const titleElem = innerTitle ? innerTitle : imageTitle;
      // Content: image, text, CTA (all referenced from DOM)
      const contentParts = [];
      // Find background image: get data-src (original image)
      const imgBg = block.querySelector('.text-image-block-image-background');
      if (imgBg && imgBg.getAttribute('data-src')) {
        const img = document.createElement('img');
        img.src = imgBg.getAttribute('data-src');
        img.alt = imgBg.getAttribute('aria-label') || '';
        contentParts.push(img);
      }
      // Text
      const imgText = block.querySelector('.text-image-block-content-text');
      if (imgText) contentParts.push(imgText);
      // CTA
      const cta = block.querySelector('.text-image-block-content-cta');
      if (cta) contentParts.push(cta);
      // Compose content div
      const contentDiv = document.createElement('div');
      contentParts.forEach(part => contentDiv.append(part));
      rows.push([titleElem, contentDiv]);
      return;
    }
    // Other types (eg. index, pills) are not accordion sections
  });

  // Only build table if at least one row found
  if (rows.length === 0) return;

  const cells = [['Accordion (accordion21)'], ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
