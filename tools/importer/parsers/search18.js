/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search index URL by looking for data-search-action on any element
  let searchUrl = '';
  // Look for any element with a data-search-action attribute
  const searchActionElem = element.querySelector('[data-search-action]');
  if (searchActionElem) {
    // Resolve the URL relative to document.baseURI
    const relUrl = searchActionElem.getAttribute('data-search-action');
    // Use an anchor to resolve; ensures absolute URL
    const a = document.createElement('a');
    a.href = relUrl;
    searchUrl = a.href;
  }
  // Fallback: try to find a form with an action
  if (!searchUrl) {
    const form = element.querySelector('form[action]');
    if (form) {
      const relUrl = form.getAttribute('action');
      const a = document.createElement('a');
      a.href = relUrl;
      searchUrl = a.href;
    }
  }
  // Final fallback: keep cell empty

  // Build the block table
  const cells = [
    ['Search (search18)'],
    [searchUrl]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
