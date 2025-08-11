/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero section
  const heroSection = element.querySelector('section.header--image');
  if (!heroSection) return;

  // 1. Extract the background image URL (if any)
  let bgImageUrl = '';
  if (heroSection.hasAttribute('data-da-cssbgimage')) {
    const cssbg = heroSection.getAttribute('data-da-cssbgimage');
    const match = cssbg.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) bgImageUrl = match[1];
  } else {
    const style = heroSection.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) {
      bgImageUrl = match[1];
      if (bgImageUrl.startsWith('/')) {
        // Use the origin from the current document if needed
        bgImageUrl = document.location.origin + bgImageUrl;
      }
    }
  }
  let bgImgElem = null;
  if (bgImageUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImageUrl;
    bgImgElem.alt = '';
  }

  // 2. Collect all textual content (headings, paragraphs, ctas) in order
  const contentElems = [];
  // get heading(s)
  const h1 = heroSection.querySelector('h1');
  if (h1) contentElems.push(h1);
  // get subheading/paragraph(s)
  const paragraphs = heroSection.querySelectorAll('p');
  paragraphs.forEach(p => {
    // Make sure paragraph isn't empty
    if (p.textContent.trim()) contentElems.push(p);
  });
  // get call-to-action(s) from the first text-block-content after hero, if any
  const textBlock = element.querySelector('.text-block-content');
  if (textBlock) {
    textBlock.childNodes.forEach(node => {
      // Only push elements with visible text
      if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
        contentElems.push(node);
      }
    });
  }

  // Build the block table matching the required structure
  const rows = [];
  rows.push(['Hero (hero71)']);
  rows.push([bgImgElem ? bgImgElem : '']);
  rows.push([contentElems.length ? contentElems : '']);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}