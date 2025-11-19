/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for this block
  const headerRow = ['Cards (cardsNoImages4)'];

  // Extract all cards, even if they contain images, but ignore the images in output
  const cards = Array.from(
    element.querySelectorAll('.slick-track > .slick-slide > div > .RecipeDitails_card___czV3, .slick-track > .slick-slide > div > .RecipeDitails_card___czV3.undefined')
  );

  function extractCardContent(card) {
    // Extract step number, title, and time as plain text
    const stepNumber = card.querySelector('.RecipeDitails_stepNumber__u1Pxf');
    const stepTitle = card.querySelector('.RecipeDitails_stepTitle__mowR1');
    const time = card.querySelector('.RecipeDitails_time__kFNo9');

    // Compose cell content as plain text (no images, no unnecessary divs)
    let cellContent = '';
    if (stepNumber) {
      cellContent += stepNumber.textContent.trim() + '\n';
    }
    if (stepTitle) {
      cellContent += stepTitle.textContent.trim() + '\n';
    }
    if (time) {
      cellContent += time.textContent.trim();
    }
    return cellContent.trim();
  }

  const rows = cards.map(card => [extractCardContent(card)]);
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
