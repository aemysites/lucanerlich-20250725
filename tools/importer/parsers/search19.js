/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match the example exactly
  const headerRow = ['Search (search19)'];

  // 2. Extract all visible text content and semantic HTML from the source block (no cloning)
  // We'll reference all top-level children, omitting any that are visually hidden
  const blockContent = [];
  // Get all immediate children of the element
  const children = Array.from(element.children);
  children.forEach((child) => {
    // Ignore elements that are hidden via inline style or attribute
    const style = child.getAttribute('style') || '';
    const hidden = child.hasAttribute('hidden');
    // Only include if not hidden
    if (!hidden && !(style.includes('display: none') || style.includes('visibility: hidden'))) {
      blockContent.push(child);
    }
  });

  // 3. Always include the query index link as shown in the markdown example
  const searchIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = searchIndexUrl;
  link.textContent = searchIndexUrl;
  blockContent.push(link);

  // 4. Create table structure: 1 column, 2 rows (header, then all block content)
  const cells = [
    headerRow,
    [blockContent]
  ];

  // 5. Create block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
