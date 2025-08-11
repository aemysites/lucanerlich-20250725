/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards25)'];

  // Get all immediate card elements
  const cards = Array.from(element.querySelectorAll(':scope > .themes__card'));

  // Build rows for each card
  const rows = cards.map(card => {
    // Get image/icon (mandatory)
    const img = card.querySelector('img');
    // Get title (may be h4 or similar)
    const title = card.querySelector('.themes__title');
    // Get CTA link (optional)
    const linkDiv = card.querySelector('.themes__link');

    // Compose the content cell
    const content = [];
    if (title) content.push(title);
    if (linkDiv) content.push(linkDiv);

    // Always produce two cells per row
    return [img, content.length === 1 ? content[0] : content];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
