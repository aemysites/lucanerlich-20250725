/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example
  const headerRow = ['Hero (hero70)'];

  // 2. Image/background row: there is NO image in this HTML, so empty string is used for the 2nd row.
  const imageRow = [''];

  // 3. Text row: Collect heading and paragraphs from the textblock section
  const textContent = [];
  // Find the .textblock section
  const textBlock = element.querySelector('.textblock');
  if (textBlock) {
    // Title (usually h2)
    const titleDiv = textBlock.querySelector('.text-block-title');
    if (titleDiv) {
      textContent.push(titleDiv);
    }
    // Content paragraphs (and other direct children)
    const contentDiv = textBlock.querySelector('.text-block-content');
    if (contentDiv) {
      Array.from(contentDiv.children).forEach(child => {
        textContent.push(child);
      });
    }
  }

  // 4. Table construction: 1 column, 3 rows, no extra tables, no metadata block
  const cells = [
    headerRow,
    imageRow,
    [textContent]
  ];

  // 5. Create and replace table, referencing only existing elements
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
