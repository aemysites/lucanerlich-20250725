/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per guidelines
  const headerRow = ['Columns (columns52)'];

  // Find the primary nav list
  const navList = element.querySelector('.navigation-desktop-primary-list');
  if (!navList) {
    // No main nav, replace with empty columns block
    const table = WebImporter.DOMUtils.createTable([headerRow, []], document);
    element.replaceWith(table);
    return;
  }
  // Each top-level nav item = a column
  const navItems = Array.from(navList.children);
  // Build columns (cells)
  const columns = navItems.map(li => {
    const columnContent = [];
    // Main nav link (e.g. Company)
    const mainLink = li.querySelector('a.navigation-desktop-primary-list-item-link');
    if (mainLink) {
      // Bold the name
      const strong = document.createElement('strong');
      strong.textContent = mainLink.textContent.trim();
      columnContent.push(strong);
    }
    // Find secondary panel, if any
    const panel = li.querySelector('.navigation-desktop-secondary-panel-inner');
    if (panel) {
      // Category section: headline, description, CTA
      const catSection = panel.querySelector('.navigation-desktop-secondary-panel-category-section');
      if (catSection) {
        const headline = catSection.querySelector('.navigation-desktop-secondary-panel-category-section-headline');
        if (headline && headline.textContent.trim()) {
          columnContent.push(headline);
        }
        const desc = catSection.querySelector('.navigation-desktop-secondary-panel-category-section-description');
        if (desc && desc.textContent.trim()) {
          columnContent.push(desc);
        }
        const cta = catSection.querySelector('.navigation-desktop-secondary-panel-category-section-cta');
        if (cta && cta.textContent.trim()) {
          columnContent.push(cta);
        }
      }
      // Sections with lists
      const sections = Array.from(panel.querySelectorAll('.navigation-desktop-secondary-panel-section'));
      sections.forEach(section => {
        const sectionTitle = section.querySelector('.navigation-desktop-secondary-panel-section-title');
        if (sectionTitle && sectionTitle.textContent.trim()) {
          columnContent.push(sectionTitle);
        }
        const ul = section.querySelector('.navigation-desktop-secondary-panel-list');
        if (ul && ul.children.length) {
          columnContent.push(ul);
        }
      });
      // Featured Content
      const featured = panel.querySelector('.navigation-desktop-secondary-panel-featured-content');
      if (featured) {
        const featHeadline = featured.querySelector('.navigation-desktop-secondary-panel-featured-content-headline');
        if (featHeadline && featHeadline.textContent.trim()) {
          columnContent.push(featHeadline);
        }
        const blocks = Array.from(featured.querySelectorAll('.navigation-desktop-secondary-panel-featured-content-block'));
        blocks.forEach(block => {
          // Image with link
          const imgContainer = block.querySelector('a.image-container');
          if (imgContainer && imgContainer.querySelector('img')) {
            columnContent.push(imgContainer);
          }
          // Title
          const infoTitle = block.querySelector('.navigation-desktop-secondary-panel-featured-content-info-title');
          if (infoTitle && infoTitle.textContent.trim()) {
            columnContent.push(infoTitle);
          }
          // CTA link
          const infoType = block.querySelector('.navigation-desktop-secondary-panel-featured-content-info-type');
          if (infoType && infoType.textContent.trim()) {
            columnContent.push(infoType);
          }
        });
      }
    }
    // Remove columns with no meaningful content
    return columnContent.length ? columnContent : null;
  }).filter(Boolean);

  // Edge case: if no columns found
  if (columns.length === 0) {
    const table = WebImporter.DOMUtils.createTable([headerRow, []], document);
    element.replaceWith(table);
    return;
  }

  // Build table (header row, then one row with each top nav as a column)
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
