/* global WebImporter */
export default function parse(element, { document }) {
  // Extract featured-product-items as columns
  const items = Array.from(
    element.querySelectorAll('.featured-product-list > .featured-product-item')
  );
  const columns = items.map((item) => {
    let img = item.querySelector('.featured-product-item-image img.img-constrained--active');
    const contentContainer = item.querySelector('.featured-product-item-content');
    const cellElements = [];
    if (img) cellElements.push(img);
    if (contentContainer) cellElements.push(contentContainer);
    return cellElements.length > 1 ? cellElements : cellElements[0];
  });

  // Build the table with a header row that spans all columns
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns9)';
  headerTh.setAttribute('colspan', columns.length);
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  const rowTr = document.createElement('tr');
  columns.forEach((col) => {
    const td = document.createElement('td');
    if (Array.isArray(col)) {
      td.append(...col);
    } else if (col) {
      td.append(col);
    }
    rowTr.appendChild(td);
  });
  table.appendChild(rowTr);

  element.replaceWith(table);
}
