/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the header row as a single-column array
  const headerRow = ['Columns (columns43)'];

  // 2. Find the swiper-wrapper containing slides
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  // 3. Collect only the first instance of each unique data-swiper-slide-index
  const seen = new Set();
  const slides = [];
  wrapper.querySelectorAll('.swiper-slide.keyfigure').forEach((slide) => {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (!seen.has(idx)) {
      seen.add(idx);
      slides.push(slide);
    }
  });
  if (!slides.length) return;

  // 4. For each slide, collect all content of the slide in a cell (reference, do not clone)
  const columnsRow = slides.map((slide) => {
    // Gather all child nodes that are either element or non-empty text
    const children = [];
    slide.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        children.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        children.push(span);
      }
    });
    // If only one child, use it; otherwise, use array
    return (children.length === 1) ? children[0] : children;
  });

  // 5. Compose the block table cells: header row (single cell), then one row with all content columns
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
