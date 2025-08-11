/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block header row
  const headerRow = ['Cards (cards15)'];

  // Defensively select the card container
  // The image, title, description are nested deeply
  // Get image
  const img = element.querySelector('img');

  // Safely find title and description elements
  const title = element.querySelector('.image-block-content-title');
  const desc = element.querySelector('.image-block-content-text');

  // Assemble the text cell: include only existing elements
  const textCell = [];
  if (title) textCell.push(title);
  if (desc) textCell.push(desc);

  // Table rows: header then one card row
  const cells = [
    headerRow,
    [img, textCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
