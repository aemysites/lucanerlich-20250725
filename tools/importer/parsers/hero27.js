/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: prefer desktop poster, then tablet, then mobile
  function getBestPoster(el) {
    const videos = el.querySelectorAll('video');
    let best = '';
    videos.forEach(v => {
      if (v.classList.contains('content-header-video--desktop') && v.poster) {
        best = v.poster;
      }
    });
    if (!best) {
      videos.forEach(v => {
        if (v.classList.contains('content-header-video--tablet') && v.poster) {
          best = v.poster;
        }
      });
    }
    if (!best) {
      videos.forEach(v => {
        if (v.classList.contains('content-header-video--mobile') && v.poster) {
          best = v.poster;
        }
      });
    }
    return best;
  }

  // 1. Header row per spec
  const headerRow = ['Hero (hero27)'];

  // 2. Background image (from video poster, if any)
  const bgPoster = getBestPoster(element);
  let bgImgEl = '';
  if (bgPoster) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgPoster;
    bgImgEl.alt = '';
  }

  // 3. Hero content (title, subheading, CTA, etc): reference the .content-header block
  let contentCell = '';
  const contentHeader = element.querySelector('.content-header');
  if (contentHeader) {
    // Reference entire .content-header block if it contains content
    if (contentHeader.textContent.trim() !== '') {
      contentCell = contentHeader;
    }
  }

  // Compose table: always 3 rows, 1 column each
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentCell ? contentCell : '']
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
