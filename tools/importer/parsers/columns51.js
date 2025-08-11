/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main navigation list
  const navList = element.querySelector('.navigation-desktop-primary-list');
  if (!navList) return;
  // Get all top-level nav items
  const navItems = Array.from(navList.querySelectorAll(':scope > li'));
  if (!navItems.length) return;

  // Build up each column's content as an array of existing elements and text
  const columns = navItems.map((li) => {
    const parts = [];
    // Main nav label (the text label link)
    const mainLabel = li.querySelector(':scope > .navigation-desktop-primary-list-item-container > a');
    if (mainLabel) parts.push(mainLabel);

    // Panel with subnav and featured content
    const secondaryPanel = li.querySelector(':scope > .navigation-desktop-secondary-panel, :scope > .navigation-desktop-secondary-panel--init-hidden');
    if (secondaryPanel) {
      // Category headline & description
      const catSec = secondaryPanel.querySelector('.navigation-desktop-secondary-panel-category-section');
      if (catSec) {
        const headline = catSec.querySelector('.navigation-desktop-secondary-panel-category-section-headline');
        if (headline && headline.textContent.trim()) parts.push(headline);
        const desc = catSec.querySelector('.navigation-desktop-secondary-panel-category-section-description');
        if (desc && desc.textContent.trim()) parts.push(desc);
        const cta = catSec.querySelector('.navigation-desktop-secondary-panel-category-section-cta');
        if (cta && cta.textContent.trim()) parts.push(cta);
      }
      // Each nav section (title + ul)
      const sections = secondaryPanel.querySelectorAll('.navigation-desktop-secondary-panel-section');
      sections.forEach((section) => {
        const sectionEls = [];
        // Has title?
        const secTitle = section.querySelector('.navigation-desktop-secondary-panel-section-title');
        if (secTitle && secTitle.textContent.trim()) sectionEls.push(secTitle);
        // Has list?
        const secList = section.querySelector('.navigation-desktop-secondary-panel-list');
        if (secList && secList.children.length) sectionEls.push(secList);
        if (sectionEls.length) {
          // Wrap into a div for semantic grouping
          const div = document.createElement('div');
          sectionEls.forEach(el => div.appendChild(el));
          parts.push(div);
        }
      });
      // Featured Content
      const featured = secondaryPanel.querySelector('.navigation-desktop-secondary-panel-featured-content');
      if (featured) {
        const fHeadline = featured.querySelector('.navigation-desktop-secondary-panel-featured-content-headline');
        if (fHeadline && fHeadline.textContent.trim()) parts.push(fHeadline);
        const fBlocks = featured.querySelectorAll('.navigation-desktop-secondary-panel-featured-content-block');
        fBlocks.forEach(block => parts.push(block));
      }
    }
    // Return either single element or array for table cell
    if (parts.length === 1) return parts[0];
    if (parts.length > 1) return parts;
    return '';
  });

  // Header row must be exactly one column
  const tableRows = [
    ['Columns (columns51)'], // Header as a single cell
    columns                 // Second row: one cell per nav item (columns)
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
