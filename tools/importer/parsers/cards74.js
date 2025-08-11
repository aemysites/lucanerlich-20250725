/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Cards (cards74)'];
  const cells = [headerRow];

  // Find all cards
  const ul = element.querySelector('ul.brochure-grid-component-elements');
  if (!ul) return;
  const items = ul.querySelectorAll('li.brochure-grid-element');

  items.forEach((item) => {
    // --- Image cell logic ---
    let imgEl = '';
    const imgDiv = item.querySelector('.brochure-grid-image-background');
    if (imgDiv) {
      let imgUrl = '';
      // Try to get full url from data-da-cssbgimage
      let daCssBg = imgDiv.getAttribute('data-da-cssbgimage');
      if (daCssBg) {
        const match = daCssBg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          imgUrl = match[1];
        }
      }
      if (!imgUrl) {
        // fallback: try to parse style="background-image: url(...)"
        const style = imgDiv.getAttribute('style') || '';
        const match = style.match(/background-image:\s*url\((.*?)\)/);
        if (match && match[1]) {
          imgUrl = match[1].replace(/"|'/g, '');
        }
      }
      if (imgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        imgEl.alt = '';
      }
    }

    // --- Text cell logic ---
    const textParts = [];
    const title = item.querySelector('.brochure-grid-title');
    if (title) {
      // Use <strong> for heading (matches visual hierarchy from example)
      const strong = document.createElement('strong');
      strong.innerHTML = title.innerHTML;
      textParts.push(strong);
    }
    const desc = item.querySelector('.brochure-grid-description');
    if (desc) {
      if (textParts.length) {
        textParts.push(document.createElement('br'));
      }
      // Use <span> to keep inline structure
      const span = document.createElement('span');
      span.innerHTML = desc.innerHTML;
      textParts.push(span);
    }
    const cta = item.querySelector('.brochure-grid-button');
    if (cta) {
      // Reference the existing <a> element directly, but only keep its main text
      const ctaEl = document.createElement('a');
      ctaEl.href = cta.href;
      ctaEl.target = cta.target;
      if (cta.hasAttribute('rel')) ctaEl.setAttribute('rel', cta.getAttribute('rel'));
      // Only the main text (ignore <span> inside the button)
      ctaEl.textContent = cta.childNodes[0] ? cta.childNodes[0].textContent.trim() : cta.textContent.trim();
      textParts.push(document.createElement('br'));
      textParts.push(ctaEl);
    }
    // Remove trailing <br> if it's the last item
    while (textParts.length > 0 && textParts[textParts.length - 1]?.tagName === 'BR') {
      textParts.pop();
    }

    cells.push([
      imgEl,
      textParts
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
