/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Hero (hero35)
  const headerRow = ['Hero (hero35)'];

  // Row 2: Background image (none in this case)
  const imageRow = ['']; // No image present in source or screenshot

  // Row 3: Headline and styled keyword
  // The entire heading is a single visual unit, so we reference the h2 directly
  // Defensive: Find the h2 element (should be the only child)
  let headingContent = null;
  const h2 = element.querySelector('h2');
  if (h2) {
    headingContent = h2;
  } else {
    // fallback: use the whole element if h2 not found
    headingContent = element;
  }

  const contentRow = [headingContent];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
