/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, header row, each following row is [title, content]
  const headerRow = ['Accordion (accordion61)'];
  const rows = [];

  // All top-level accordion-wrapper elements
  const accordionItems = element.querySelectorAll(':scope > .accordion-wrapper');

  accordionItems.forEach((item) => {
    // Title cell: use the existing headline element under .accordion-header
    let titleEl = null;
    const header = item.querySelector(':scope > .accordion-header');
    if (header) {
      titleEl = header.querySelector('h2, h3');
      // If no h2/h3, fallback to .trigger or fallback to header text (unlikely)
      if (!titleEl) {
        const trigger = header.querySelector('.trigger');
        if (trigger) {
          // Use the trigger's textContent as fallback
          const span = document.createElement('span');
          span.textContent = trigger.textContent.trim();
          titleEl = span;
        } else {
          const span = document.createElement('span');
          span.textContent = header.textContent.trim();
          titleEl = span;
        }
      }
    }
    // Content cell: everything in .accordion-content > .accordion-inner (if present), else .accordion-content
    let contentEl = null;
    const content = item.querySelector(':scope > .accordion-content');
    if (content) {
      const inner = content.querySelector(':scope > .accordion-inner');
      contentEl = inner ? inner : content;
    }
    rows.push([titleEl, contentEl]);
  });

  // Build cells array and create the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
