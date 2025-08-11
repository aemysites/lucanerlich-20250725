/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, matching example exactly
  const headerRow = ['Hero (hero60)'];

  // Find the hero div
  const heroDiv = element.querySelector('.hero') || element;

  // Extract background image from the desktop video's poster
  let bgImg = null;
  const desktopVideo = heroDiv.querySelector('.hero__video--desktop');
  if (desktopVideo && desktopVideo.hasAttribute('poster')) {
    bgImg = document.createElement('img');
    bgImg.src = desktopVideo.getAttribute('poster');
    bgImg.alt = '';
  }

  // Extract headline, subheadline, paragraph, etc. (none present in HTML, handle missing)
  // If in future the block contains headings/text, add them here.
  // For now, only extract a possible CTA: scroll-down anchor
  const scrollDown = heroDiv.querySelector('a.scroll-down');
  let mainContent = [];
  if (scrollDown) {
    mainContent.push(scrollDown);
  }

  // Create the table, 1 column 3 rows
  // 1. Header
  // 2. Background image (or empty string)
  // 3. Main content (CTA, in this case only scroll down or empty string)
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [mainContent.length ? mainContent : ''],
  ];

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
