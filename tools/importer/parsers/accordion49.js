/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Accordion (accordion49)'];
  const rows = [];

  // Extract the accordion title from .accordion-header
  let titleCell = '';
  const header = element.querySelector('.accordion-header');
  if (header) {
    const h2 = header.querySelector('h2');
    if (h2) {
      titleCell = h2;
    } else if (header.firstElementChild) {
      titleCell = header.firstElementChild;
    } else {
      titleCell = header.textContent.trim();
    }
  }

  // Extract the accordion content
  let contentCell = [];
  const contentDiv = element.querySelector('.accordion-content');
  if (contentDiv) {
    const inner = contentDiv.querySelector('.accordion-inner');
    if (inner) {
      // Get all spreadsheet blocks and paragraphs
      const children = Array.from(inner.children);
      children.forEach(child => {
        contentCell.push(child);
      });
    } else {
      // fallback to whatever is in .accordion-content
      if (contentDiv.children.length > 0) {
        Array.from(contentDiv.children).forEach(child => {
          contentCell.push(child);
        });
      } else if (contentDiv.textContent.trim()) {
        contentCell.push(contentDiv.textContent.trim());
      }
    }
  }

  // Only include content from paragraphs that follow the block if present (not inside .accordion-content)
  // But in the provided HTML, all relevant paragraphs are inside .accordion-inner, so we do not need to search outside.

  rows.push([titleCell, contentCell]);

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
