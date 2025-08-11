/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as required
  const headerRow = ['Table (no header, tableNoHeader41)'];

  const rows = [];

  // Find the download list in the element
  const downloadsList = element.querySelector('.downloads__list');
  if (downloadsList) {
    downloadsList.querySelectorAll('li').forEach((li) => {
      // Collect all left-side (document name, metadata) content as text
      const left = li.querySelector('.downloads__left');
      const right = li.querySelector('.downloads__right');
      // We'll combine both left and right into a new container, to preserve semantic meaning and all text
      if (left || right) {
        const container = document.createElement('div');
        if (left) container.appendChild(left);
        if (right) container.appendChild(right);
        rows.push([container]);
      } else {
        // fallback: just push the li's text if structure changes
        rows.push([li]);
      }
    });
  }

  if (!rows.length) return;

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
