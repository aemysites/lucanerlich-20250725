/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image src from background-image or data-da-cssbgimage
  function getImageSrc(div) {
    let src = '';
    if (div) {
      if (div.hasAttribute('data-da-cssbgimage')) {
        const cssBg = div.getAttribute('data-da-cssbgimage');
        const m = cssBg.match(/url\((['"]?)(.*?)\1\)/i);
        if (m) src = m[2];
      }
      if (!src && div.style && div.style.backgroundImage) {
        const m = div.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/i);
        if (m) src = m[2];
      }
      if (src.startsWith('/')) {
        src = window.location.origin + src;
      }
    }
    return src;
  }

  // Find all card list items
  const resultsList = element.querySelector('.conference-events-results-list');
  if (!resultsList) return;
  const cardItems = Array.from(resultsList.querySelectorAll(':scope > li'));

  // Prepare rows for the block table
  const rows = [['Cards (cards35)']]; // Table header row

  cardItems.forEach(li => {
    const section = li.querySelector('section.card-conference-events');
    if (!section) return;
    // --- Image Cell ---
    let imgEl = null;
    const imgDiv = section.querySelector('.card-conference-events__image-thumbnail');
    const imgSrc = getImageSrc(imgDiv);
    if (imgSrc) {
      imgEl = document.createElement('img');
      imgEl.src = imgSrc;
      imgEl.alt = imgDiv ? (imgDiv.getAttribute('aria-label') || '') : '';
    }

    // --- Text Cell ---
    const textFragments = [];
    const content = section.querySelector('.card-conference-events__content');
    if (content) {
      // date
      const date = content.querySelector('.date-text');
      if (date) textFragments.push(date);
      // title (should be a heading)
      const title = content.querySelector('.title-text');
      if (title) {
        if (title.tagName.toLowerCase() === 'h3') {
          textFragments.push(title);
        } else {
          const h3 = document.createElement('h3');
          h3.textContent = title.textContent.trim();
          textFragments.push(h3);
        }
      }
      // type
      const type = content.querySelector('.type-text');
      if (type) textFragments.push(type);
    }
    // Footer CTA (View Event link)
    const cta = section.querySelector('.card-conference-events__footer-detail a');
    if (cta) textFragments.push(cta);

    // If no text content, skip this row
    if (textFragments.length === 0 && !imgEl) return;

    rows.push([
      imgEl || '',
      textFragments
    ]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
