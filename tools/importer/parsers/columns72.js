/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements and example
  const headerRow = ['Columns (columns72)'];

  // Find the main content (text/buttons) and image side
  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');

  // --- LEFT COLUMN ---
  // Get content section
  const contentSection = element.querySelector('.work-with-us-content');
  if (contentSection) {
    // Append header (h2)
    const h2 = contentSection.querySelector('.work-with-us-content-header');
    if (h2) leftCol.appendChild(h2);
    // Append title (h3)
    const h3 = contentSection.querySelector('.work-with-us-content-title');
    if (h3) leftCol.appendChild(h3);
    // Append description (p)
    const desc = contentSection.querySelector('.work-with-us-content-description');
    if (desc) leftCol.appendChild(desc);
    // Append all CTA buttons
    const ctas = contentSection.querySelectorAll('a.work-with-us__cta');
    ctas.forEach(a => leftCol.appendChild(a));
  }

  // --- RIGHT COLUMN ---
  // Get image: only the main non-blur image
  const img = element.querySelector('.work-with-us-image-inner-bottom img.img-constrained--active');
  if (img) {
    rightCol.appendChild(img);
  }

  // NOTE: no need to extract svg/backgrounds as only the main image is relevant

  // Assemble the columns row
  const columnsRow = [leftCol, rightCol];
  const cells = [headerRow, columnsRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
