/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero31) block parsing
  // 1 column, 3 rows: [header], [background image], [content]

  // Header row
  const headerRow = ['Hero (hero31)'];

  // --- Background image row ---
  // Find the first img element (decorative background)
  let bgImg = element.querySelector('img');
  let bgImgRow = [bgImg ? bgImg : ''];

  // --- Content row ---
  // Find the heading container (h2)
  const headingContainer = element.querySelector('h2');
  // Find the description container
  const descriptionDiv = element.querySelector('.tastetrivia_tasteTriviaDescription__FMbGs');

  // Compose content cell
  const contentCell = [];
  if (headingContainer) contentCell.push(headingContainer);
  if (descriptionDiv) contentCell.push(descriptionDiv);

  // Table assembly
  const cells = [
    headerRow,
    bgImgRow,
    [contentCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
