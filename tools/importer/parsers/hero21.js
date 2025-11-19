/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero21) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Heading, subheading, CTA (link)

  // Header row
  const headerRow = ['Hero (hero21)'];

  // Row 2: Background image
  // Find the first <img> inside the block
  const img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // Row 3: Heading, CTA
  // Find the inner container for text and CTA
  const inner = element.querySelector('.RecipeDitails_recipegetcookinner__B9xOu');
  let contentCell = [];

  if (inner) {
    // Heading
    const headingDiv = inner.querySelector('.RecipeDitails_recipegetcookleft__iFh0s');
    if (headingDiv) {
      // Convert to <h1> for semantic heading
      const h1 = document.createElement('h1');
      h1.textContent = headingDiv.textContent;
      contentCell.push(h1);
    }

    // CTA link
    const cta = inner.querySelector('a');
    if (cta) {
      // Use the anchor as-is (includes icon and text)
      contentCell.push(cta);
    }
  }

  // Defensive: If nothing found, fallback to text content
  if (contentCell.length === 0) {
    contentCell = [element.textContent.trim()];
  }

  const contentRow = [contentCell];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
