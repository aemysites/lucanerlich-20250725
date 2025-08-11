/* global WebImporter */
export default function parse(element, { document }) {
  // --- Helper: Get Hero Image (background) ---
  function getBackgroundImage() {
    // Prefer high-res bg image
    const hiRes = element.querySelector('.et-header-background-image--highres');
    if (hiRes && hiRes.style.backgroundImage) {
      const m = hiRes.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (m && m[1]) return m[1];
    }
    // Fallback to .et-header-background-image data-src
    const bg = element.querySelector('.et-header-background-image');
    if (bg && bg.dataset && bg.dataset.src) {
      return bg.dataset.src;
    }
    // Fallback to .et-header-background-image style
    if (bg && bg.style.backgroundImage) {
      const m = bg.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (m && m[1]) return m[1];
    }
    return null;
  }

  // --- Compose Table ---
  // 1. Header row: block name (exactly as example)
  const headerRow = ['Hero (hero17)'];

  // 2. Row: Background image in cell
  let imgCell = '';
  let imgUrl = getBackgroundImage();
  if (imgUrl) {
    // Normalize URL if relative
    if (/^[\/]/.test(imgUrl)) {
      imgUrl = window.location.origin + imgUrl;
    }
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = '';
    imgCell = img;
  } else {
    imgCell = '';
  }

  // 3. Row: Content elements (headline, subheading, etc)
  // Collect main text block from .et-header-content
  const contentParts = [];
  const headerContent = element.querySelector('.et-header-content');
  if (headerContent) {
    // Title (h1)
    const title = headerContent.querySelector('.et-header-title');
    if (title) contentParts.push(title);
    // Subheading (p)
    const desc = headerContent.querySelector('.et-header-description');
    if (desc) contentParts.push(desc);
  }

  // Type of event (optional subheading)
  const extraInfo = element.querySelector('.et-header-extra-info');
  if (extraInfo) {
    // Only include text label and value
    const typeTitle = extraInfo.querySelector('.et-header-extra-info__title');
    const typeText = extraInfo.querySelector('.et-header-extra-info__text');
    if (typeTitle && typeText) {
      // Wrap both in a div
      const typeDiv = document.createElement('div');
      typeDiv.appendChild(typeTitle);
      typeDiv.appendChild(typeText);
      contentParts.push(typeDiv);
    }
  }

  // Event info block (date, website, location)
  const eventInfo = element.querySelector('.et-header-info');
  if (eventInfo) {
    // Reference entire block for resilience
    contentParts.push(eventInfo);
  }

  // Compose content cell
  const contentCell = contentParts.length ? contentParts : [''];

  // --- Final Table Array ---
  const cells = [
    headerRow,
    [imgCell],
    [contentCell],
  ];

  // --- Replace Element ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
