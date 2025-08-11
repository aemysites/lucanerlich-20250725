/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name
  const headerRow = ['Accordion (accordion66)'];

  // Find all direct child accordion items
  const items = Array.from(element.querySelectorAll(':scope > .accordion-wrapper'));
  const rows = [headerRow];

  items.forEach(item => {
    // Title cell: look for heading inside accordion-header
    let titleCell = null;
    const header = item.querySelector('.accordion-header');
    if (header) {
      // Prefer heading element inside .accordion-header
      let heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      if (!heading) {
        // fallback: any element with class containing 'headline'
        heading = header.querySelector('[class*="headline"]');
      }
      // fallback: just use header's text content if no heading at all
      titleCell = heading || header;
    }
    // Content cell: .accordion-inner (all its children, preserving structure)
    let contentCell = null;
    const inner = item.querySelector('.accordion-content .accordion-inner');
    if (inner) {
      // Reference the child nodes of .accordion-inner in an array
      const nodes = Array.from(inner.childNodes).filter(n => {
        // Filter out empty text nodes
        return !(n.nodeType === 3 && !n.textContent.trim());
      });
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      // fallback: use .accordion-content or the item itself
      const fallback = item.querySelector('.accordion-content') || item;
      contentCell = fallback;
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
