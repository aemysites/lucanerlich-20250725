/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: Block name (must match example exactly)
  const headerRow = ['Hero (hero29)'];

  // 2. Extract background image (optional)
  let imgUrl = '';
  const bgImgDiv = element.querySelector('.blog-post-header__background-image');
  if (bgImgDiv) {
    let cssBg = bgImgDiv.getAttribute('data-da-cssbgimage');
    if (cssBg) {
      // data-da-cssbgimage is like url("...url...")
      const match = cssBg.match(/url\(("|')(.*?)("|')\)/);
      if (match && match[2]) {
        imgUrl = match[2];
      }
    } else if (bgImgDiv.style && bgImgDiv.style.backgroundImage) {
      const match = bgImgDiv.style.backgroundImage.match(/url\(("|')?(.*?)("|')?\)/);
      if (match && match[2]) {
        // handle relative URLs
        if (/^\//.test(match[2])) {
          // relative to domain
          imgUrl = new URL(match[2], document.location.origin).toString();
        } else {
          imgUrl = match[2];
        }
      }
    }
  }
  let imageEl = null;
  if (imgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imgUrl;
    imageEl.alt = '';
    imageEl.setAttribute('loading', 'eager');
    imageEl.style.maxWidth = '100%';
  }

  // 3. Compose content: title, publish date, social share
  const contentWrapper = element.querySelector('.blog-post-header__content-wrapper');
  let contentEls = [];
  if (contentWrapper) {
    // Title (as heading)
    const title = contentWrapper.querySelector('h1.blog-post-header__title, .blog-post-header__title');
    if (title) contentEls.push(title);
    // Publish date (label and date)
    const publishDate = contentWrapper.querySelector('.blog-post-header__publish-date');
    if (publishDate) contentEls.push(publishDate);
    // Social share group, if present
    const socialShare = contentWrapper.querySelector('.social-share');
    if (socialShare) contentEls.push(socialShare);
  }

  // Defensive: fallback if nothing is found
  if (contentEls.length === 0) {
    // fallback to everything inside element with content-related classes
    const fallbacks = element.querySelectorAll('.blog-post-header__title, .blog-post-header__publish-date, .social-share');
    for (const el of fallbacks) contentEls.push(el);
  }

  // 4. Build the table: header, image row, content row
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
