/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main nav list (ul)
  const navList = element.querySelector('ul.navigation-desktop-primary-list');
  if (!navList) return;

  // Gather all tab list items
  const tabItems = Array.from(navList.children).filter(li => li.classList.contains('navigation-desktop-primary-list-item'));

  // First row: block name (single cell)
  const firstRow = ['Tabs (tabs50)'];

  // Second row: tab labels (one column per tab)
  const labelsRow = tabItems.map(tabItem => {
    const labelLink = tabItem.querySelector('.navigation-desktop-primary-list-item-link');
    return labelLink ? labelLink.textContent.trim() : '';
  });

  // Third row: tab contents (one column per tab)
  const contentRow = tabItems.map(tabItem => {
    const panel = tabItem.querySelector('.navigation-desktop-secondary-panel');
    if (panel && panel.innerHTML.trim() !== '') {
      return panel;
    } else {
      // fallback: just use the tab label link if no panel
      const labelLink = tabItem.querySelector('.navigation-desktop-primary-list-item-link');
      return labelLink;
    }
  });

  // Compose table cells
  const cells = [firstRow, labelsRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
