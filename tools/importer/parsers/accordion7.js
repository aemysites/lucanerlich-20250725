/* global WebImporter */
export default function parse(element, { document }) {
  // The required block table header
  const cells = [['Accordion (accordion7)']];

  // Get the main accordion header (title)
  const accordionHeader = element.querySelector('.accordion-header');
  let initialTitleCell = null;
  if (accordionHeader) {
    const trigger = accordionHeader.querySelector('a.trigger');
    if (trigger) {
      initialTitleCell = trigger;
    }
  }

  // Get the accordion content
  const contentWrap = element.querySelector('.accordion-content .accordion-inner');
  if (!contentWrap) return;
  const children = Array.from(contentWrap.children);

  // Find and add the first accordion item (content before the first h3)
  let idx = 0;
  const firstContent = [];
  while (idx < children.length && children[idx].tagName !== 'H3') {
    firstContent.push(children[idx]);
    idx++;
  }
  if (initialTitleCell && firstContent.length) {
    cells.push([initialTitleCell, firstContent]);
  }

  // For each h3 and its subsequent siblings until the next h3, create row
  while (idx < children.length) {
    if (children[idx].tagName === 'H3') {
      const titleCell = children[idx];
      const contentCell = [];
      idx++;
      while (idx < children.length && children[idx].tagName !== 'H3') {
        contentCell.push(children[idx]);
        idx++;
      }
      cells.push([titleCell, contentCell]);
    } else {
      idx++;
    }
  }

  // Build the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
