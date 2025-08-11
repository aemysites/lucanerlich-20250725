/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero54)'];

  // --- Background Image Row ---
  let bgImgCell = '';
  const headerSection = element.querySelector('.header');
  if (headerSection) {
    let bgUrl = '';
    // Extract from style attribute
    const style = headerSection.getAttribute('style');
    if (style) {
      const bgMatch = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/);
      if (bgMatch && bgMatch[2]) {
        bgUrl = bgMatch[2];
        if (bgUrl.startsWith('/')) {
          // Try data-da-cssbgimage for absolute URL
          const dataBg = headerSection.getAttribute('data-da-cssbgimage');
          if (dataBg) {
            const dataMatch = dataBg.match(/url\((['"]?)(.*?)\1\)/);
            if (dataMatch && dataMatch[2]) {
              bgUrl = dataMatch[2];
            }
          }
        }
      }
    }
    if (bgUrl) {
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      bgImgCell = img;
    }
  }
  const bgRow = [bgImgCell];

  // --- Main Content Row ---
  // Collect all headings and paragraphs visible in the header's content
  let contentArr = [];
  if (headerSection) {
    const container = headerSection.querySelector('.container');
    if (container) {
      // Get all headings and paragraphs in visual order
      const textEls = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
      textEls.forEach((el) => {
        // Only include if it has visible text
        if (el.textContent && el.textContent.trim() !== '') {
          contentArr.push(el);
        }
      });
    }
  }
  // Fallback: If nothing found, look in the whole element
  if (contentArr.length === 0) {
    const allTextEls = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    allTextEls.forEach((el) => {
      if (el.textContent && el.textContent.trim() !== '') {
        contentArr.push(el);
      }
    });
  }
  const contentRow = [contentArr.length ? contentArr : ''];

  // Compose and replace
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
