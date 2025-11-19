/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards50) block: expects 2 columns, each row is a card (image, text)
  // Only create a card if BOTH image and text content are present

  const headerRow = ['Cards (cards50)'];
  const img = element.querySelector('img');

  // Extract visible text content from the element (excluding empty/whitespace)
  let textContent = '';
  // Get all text nodes that are visible
  element.querySelectorAll('*').forEach((el) => {
    if (el.childNodes.length) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textContent += node.textContent.trim() + ' ';
        }
      });
    }
  });
  textContent = textContent.trim();

  // Only create a table if both image and text content are present
  if (img && textContent) {
    const rows = [headerRow, [img, textContent]];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  } else {
    // If not, remove the element (do not output a block)
    element.remove();
  }
}
