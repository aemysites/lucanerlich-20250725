/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block table: 2 columns, multiple rows: [header], then one row per accordion item
  const headerRow = ['Accordion (accordion65)'];

  // Find all child accordion items (immediate children with class .accordion-wrapper.tabc-element)
  const items = Array.from(element.querySelectorAll(':scope > .accordion-wrapper.tabc-element'));

  // Compose each row: [title, content]
  const rows = items.map(item => {
    // 1. Title cell: header h3 or first heading in .accordion-header
    let titleCell = null;
    const header = item.querySelector('.accordion-header');
    if (header) {
      // Try to find heading element (h3, h4, etc.) inside header
      let heading = header.querySelector('h1, h2, h3, h4, h5, h6');
      titleCell = heading ? heading : header;
    } else {
      // fallback: just use textContent
      titleCell = document.createTextNode('');
    }

    // 2. Content cell: all direct children of .accordion-content .accordion-inner
    let contentCell = null;
    const contentInner = item.querySelector('.accordion-content .accordion-inner');
    if (contentInner) {
      // If only one child, use it directly; if multiple, pass as array
      const children = Array.from(contentInner.childNodes).filter(n => (n.nodeType !== Node.TEXT_NODE) || n.textContent.trim());
      if (children.length === 1) {
        contentCell = children[0];
      } else {
        contentCell = children;
      }
    } else {
      // fallback: use the .accordion-content itself
      const contentWrap = item.querySelector('.accordion-content');
      if (contentWrap) {
        contentCell = contentWrap;
      } else {
        // fallback: empty
        contentCell = document.createTextNode('');
      }
    }
    return [titleCell, contentCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
