/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main text-image-block section
  const textImageBlock = element.querySelector('.text-image-block');
  if (!textImageBlock) return;

  // --- Extract image ---
  let imageElem = null;
  const imageBg = textImageBlock.querySelector('.text-image-block-image-background');
  if (imageBg) {
    const bgStyle = imageBg.getAttribute('style') || '';
    // Extract URL from background-image
    const urlMatch = bgStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      imageElem = document.createElement('img');
      imageElem.src = urlMatch[1];
      imageElem.alt = imageBg.getAttribute('aria-label') || '';
    }
  }

  // --- Extract content: heading, paragraph, CTA ---
  const content = textImageBlock.querySelector('.text-image-block-content');
  const contentParts = [];
  if (content) {
    // Title
    const titleEl = content.querySelector('.text-image-block-content-title');
    if (titleEl) {
      // The actual title is in a <div> inside <h2>
      const h2 = document.createElement('h2');
      const div = titleEl.querySelector('div');
      h2.textContent = div ? div.textContent.trim() : titleEl.textContent.trim();
      contentParts.push(h2);
    }
    // Paragraph
    const paraEl = content.querySelector('.text-image-block-content-text');
    if (paraEl) {
      contentParts.push(paraEl);
    }
    // CTA
    const ctaEl = content.querySelector('.text-image-block-content-cta');
    if (ctaEl) {
      contentParts.push(ctaEl);
    }
  }

  // --- Compose the table ---
  const cells = [
    ['Hero (hero11)'],
    [imageElem ? imageElem : ''],
    [contentParts.length > 0 ? contentParts : '']
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
