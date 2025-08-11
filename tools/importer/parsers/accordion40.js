/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as required
  const rows = [['Accordion (accordion40)']];

  // Find the .acdn-items list that contains all accordion items
  const itemsList = element.querySelector('.acdn-items');
  if (!itemsList) return;

  // Iterate over each accordion item
  itemsList.querySelectorAll(':scope > li').forEach((li) => {
    // Safely get the dropdown section
    const dropdown = li.querySelector('.accordion-dropdown');

    // TITLE CELL: Extract title text directly from header, fallback to aria-label
    let titleText = '';
    let titleNode;
    if (dropdown) {
      // Try to find the .acdn-item-header-title
      const titleEl = dropdown.querySelector('.acdn-item-header-title');
      if (titleEl && titleEl.textContent.trim()) {
        titleText = titleEl.textContent.trim();
      } else {
        // fallback: aria-label on button
        const btn = dropdown.querySelector('button[aria-label]');
        if (btn && btn.getAttribute('aria-label')) {
          titleText = btn.getAttribute('aria-label');
        } else if (dropdown.textContent.trim()) {
          // fallback: use text content from dropdown
          titleText = dropdown.textContent.trim();
        }
      }
      titleNode = document.createElement('p');
      titleNode.textContent = titleText;
    } else {
      // fallback: use li's text
      titleNode = document.createElement('p');
      titleNode.textContent = li.textContent.trim();
    }

    // CONTENT CELL: Use all content inside .accordion-dropdown-content
    let contentCell;
    let contentEl = dropdown ? dropdown.querySelector('.accordion-dropdown-content') : null;
    if (contentEl) {
      // Remove any empty paragraphs (&nbsp;)
      Array.from(contentEl.querySelectorAll('p')).forEach((p) => {
        if (p.innerHTML.trim() === '&nbsp;') {
          p.remove();
        }
      });
      // Gather all child nodes for full fidelity (including text, lists, etc)
      const nodes = Array.from(contentEl.childNodes).filter(
        node => (node.nodeType !== 3) || (node.textContent.trim() !== '')
      );
      // If there's at least one visible node, use all nodes; otherwise fallback to textContent
      if (nodes.length > 0) {
        contentCell = nodes.length === 1 ? nodes[0] : nodes;
      } else {
        contentCell = contentEl.textContent.trim();
      }
    } else {
      // If there's no content section, fallback to empty string
      contentCell = '';
    }

    rows.push([titleNode, contentCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
