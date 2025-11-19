/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37) block: 2 columns, each row = one card
  // Header row
  const headerRow = ['Cards (cards37)'];

  // Find the parent container holding all cards
  // The repeating card structure is: <a> -> <div.must-try-container> -> <img> + <div.option1-text>
  const cardsContainer = element.querySelector('.must-try-options');
  if (!cardsContainer) return;

  // Get all card anchor elements (each card is an <a> with a .must-try-container inside)
  const cardAnchors = Array.from(cardsContainer.querySelectorAll('a'));

  // Build card rows
  const rows = cardAnchors.map(cardAnchor => {
    // The card container
    const cardDiv = cardAnchor.querySelector('.must-try-container');
    if (!cardDiv) return null;

    // Image (first cell)
    const img = cardDiv.querySelector('img');
    // Defensive: only include if exists
    const imageCell = img ? img : '';

    // Text content (second cell)
    const textDiv = cardDiv.querySelector('.option1-text');
    let textCellContent = [];
    if (textDiv) {
      // Title
      const heading = textDiv.querySelector('.option1-heading');
      if (heading) textCellContent.push(heading);
      // Description
      const desc = textDiv.querySelector('.option1-content');
      if (desc) textCellContent.push(desc);
    }
    // If the cardAnchor has an href and it's not just '/', treat as CTA (but in this HTML, all are '/')
    // So we skip CTA for now
    return [imageCell, textCellContent];
  }).filter(Boolean);

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
