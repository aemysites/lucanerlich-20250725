/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row EXACTLY as required
  const headerRow = ['Tabs (tabs31)'];

  // Find the <nav> element containing navigation lists
  const nav = element.querySelector('nav') || element;

  // Try to get desktop and fallback to mobile tab list
  let tabList = nav.querySelector('.in-page-nav-desktop-list');
  if (!tabList) {
    tabList = nav.querySelector('.in-page-nav-mobile-list');
  }
  if (!tabList) return;

  // Get tab labels from <a> elements in tab list
  const tabLinks = Array.from(tabList.querySelectorAll('li > a'));
  if (!tabLinks.length) return;

  // Attempt to find the content elements for each tab anchor
  // Since only navigation is present in this HTML, and no explicit tab-content sections exist,
  // include the full nav for each tab so all text content is preserved
  const rows = tabLinks.map(a => {
    const label = a.textContent.trim();
    // Reference the nav element directly so all nav content is present in every cell
    return [label, nav];
  });

  // Compose final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
