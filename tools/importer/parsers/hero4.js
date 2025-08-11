/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main <section> for hero block
  const section = element.querySelector('section.expertise-image-header');

  // --- HEADER ROW ---
  const cells = [['Hero (hero4)']];

  // --- BACKGROUND IMAGE ROW ---
  let bgImgEl = '';
  if (section) {
    // Try to extract background image from style, preferring absolute URL from data-da-cssbgimage if present
    let bgImgUrl = '';
    const style = section.getAttribute('style');
    if (style) {
      const match = style.match(/background-image:\s*url\((?:'|")?(.*?)(?:'|")?\)/);
      if (match && match[1]) {
        bgImgUrl = match[1];
      }
    }
    // If relative, use absolute from data-da-cssbgimage
    if (bgImgUrl && bgImgUrl.startsWith('/') && section.hasAttribute('data-da-cssbgimage')) {
      const absMatch = section.getAttribute('data-da-cssbgimage').match(/url\((?:'|")?(.*?)(?:'|")?\)/);
      if (absMatch && absMatch[1]) {
        bgImgUrl = absMatch[1];
      }
    }
    if (bgImgUrl) {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
      bgImgEl.alt = '';
    }
  }
  cells.push([bgImgEl ? bgImgEl : '']);

  // --- CONTENT ROW ---
  // Get all visible and meaningful content from section, preserving semantic structure
  const contentEls = [];
  if (section) {
    // Select all headings and paragraphs, in DOM order
    section.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
      contentEls.push(el);
    });
    // Include breadcrumb navigation if present
    const breadcrumb = section.querySelector('.breadcrumb-container');
    if (breadcrumb) {
      contentEls.unshift(breadcrumb);
    }
    // Optionally include social/share block if present and visible
    const share = section.querySelector('.header-share');
    if (share) {
      contentEls.push(share);
    }
  }
  cells.push([contentEls.length > 0 ? contentEls : '']);

  // Create table block and replace original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
