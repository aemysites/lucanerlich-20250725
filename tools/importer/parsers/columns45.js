/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main regions for columns: left (main chart) and right (services)
  // The block is a two-column layout, with each column containing relevant content.

  // 1. Left column: chart, controls, export buttons, social share
  // 2. Right column: services box (menu)

  // --- Left column ---
  let leftContent = [];
  // The main chart/controls area
  const mainPanel = element.querySelector('article#main-panel');
  if (mainPanel) {
    // Contains everything: controls, chart area, export buttons
    const chartGenerator = mainPanel.querySelector('#chartGenerator');
    if (chartGenerator) {
      leftContent.push(chartGenerator);
    }
  }
  // Social share footer (if exists)
  const articleFooter = element.querySelector('div.article-footer');
  if (articleFooter) leftContent.push(articleFooter);

  // --- Right column ---
  let rightContent = [];
  // Find the Services sidebar
  const contentAfterContainer = element.querySelector('div.content-after-container');
  if (contentAfterContainer) {
    const aside = contentAfterContainer.querySelector('aside#content-after');
    if (aside) {
      const servicesBox = aside.querySelector('div.tool-box');
      if (servicesBox) {
        rightContent.push(servicesBox);
      }
    }
  }

  // Header row - must match exactly
  const headerRow = ['Columns (columns45)'];

  // Content row - two columns
  const contentRow = [leftContent, rightContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
