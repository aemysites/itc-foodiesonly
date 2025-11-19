/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero15) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (none in this case)
  // Row 3: Heading, subheading, CTA (all text in this case)

  // Header row
  const headerRow = ['Hero (hero15)'];

  // No background image in this source, so row 2 is empty
  const imageRow = [''];

  // Row 3: Collect the heading content
  // Clone the element to avoid DOM mutation issues
  const headingClone = element.cloneNode(true);
  const contentRow = [headingClone];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
