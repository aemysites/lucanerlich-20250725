/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab labels from desktop and/or mobile
  let tabLabels = [];
  let navList = element.querySelector('.in-page-nav-desktop-list');
  if (!navList) {
    navList = element.querySelector('.in-page-nav-mobile-list');
  }
  if (navList) {
    tabLabels = Array.from(navList.querySelectorAll('a')).map(a => a.textContent.trim()).filter(Boolean);
  }

  // If there is content associated with each tab, we should extract it, but this HTML only has navigation, no tab content
  // So we will produce rows with tab label and empty content as per the block pattern

  // Header row: exact match with example
  const rows = [['Tabs (tabs78)']];
  tabLabels.forEach(label => {
    rows.push([label, '']);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Ensure header spans two columns if there are tab rows
  const th = table.querySelector('th');
  if (th && table.rows.length > 1 && table.rows[1].cells.length === 2) {
    th.colSpan = 2;
  }
  // Replace the original block
  element.replaceWith(table);
}
