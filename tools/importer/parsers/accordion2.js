/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the Accordion2 block
  const rows = [['Accordion (accordion2)']];

  // Find the main clickable title (accordion label)
  const titleLink = element.querySelector('.navigation-desktop-primary-list-item-link');

  // Find the panel containing the submenu (accordion content)
  const panel = element.querySelector('.navigation-desktop-secondary-panel');
  let contentCell = '';
  if (panel) {
    // Use the innermost submenu container if present, else panel itself
    const inner = panel.querySelector('.navigation-desktop-secondary-panel-inner');
    if (inner) {
      contentCell = inner;
    } else {
      contentCell = panel;
    }
  }

  // Ensure that both the title and the content are present
  if (titleLink && contentCell) {
    rows.push([titleLink, contentCell]);
  } else if (titleLink) {
    rows.push([titleLink, '']);
  } else if (contentCell) {
    rows.push(['', contentCell]);
  }
  // If neither found, do not push a row

  // Generate the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
