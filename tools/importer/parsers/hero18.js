/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero18) block: 1 column, 3 rows
  // Row 1: Header
  const headerRow = ['Hero (hero18)'];

  // Row 2: Background image (none in this case)
  const imageRow = ['']; // No image present in source HTML or screenshot

  // Row 3: Title, subheading, CTA (all text in a single heading)
  // We'll extract the main heading content, preserving its structure
  // Defensive: find the h1 (or main heading) and use its content
  let contentRow;
  const h1 = element.querySelector('h1');
  if (h1) {
    contentRow = [h1];
  } else {
    // Fallback: use the whole element if h1 is missing
    contentRow = [element];
  }

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
