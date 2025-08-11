/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the navigation tabs container
  const navPrimary = element.querySelector('.navigation-desktop-primary');
  if (!navPrimary) return;
  // 2. Get all top-level tab items
  const tabItems = Array.from(
    navPrimary.querySelectorAll('.navigation-desktop-primary-list > li.navigation-desktop-primary-list-item')
  );
  if (!tabItems.length) return;

  // 3. Prepare header row per block definition
  const headerRow = ['Tabs (tabs6)'];
  const tableRows = [headerRow];

  tabItems.forEach(tabItem => {
    // Tab label from the primary nav link
    const tabLabelAnchor = tabItem.querySelector('.navigation-desktop-primary-list-item-link');
    let tabLabel = '';
    if (tabLabelAnchor) {
      tabLabel = tabLabelAnchor.textContent.trim();
    }

    // Tab content: all children of .navigation-desktop-secondary-panel-inner
    let tabContent = [];
    const secondaryPanelInner = tabItem.querySelector('.navigation-desktop-secondary-panel-inner');
    if (secondaryPanelInner) {
      // Only add children with real content
      const children = Array.from(secondaryPanelInner.children).filter(child => {
        // Exclude empty sections
        if (
          child.classList.contains('navigation-desktop-secondary-panel-section') &&
          !child.querySelector('a, ul, p, li')
        ) {
          return false;
        }
        return true;
      });
      if (children.length) {
        tabContent = children;
      }
    }
    // Fallback to tabItem itself if everything is empty
    if (!tabContent.length) tabContent = [tabItem];

    // Add the tab row
    tableRows.push([
      tabLabel,
      tabContent
    ]);
  });

  // 4. Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
