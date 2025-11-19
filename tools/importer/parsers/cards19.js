/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block: Only create a card if there is both image and text content
  const headerRow = ['Cards (cards19)'];

  const img = element.querySelector('img');

  // Check for visible text content in the element (not alt text, not whitespace)
  let textContent = '';
  element.querySelectorAll('*').forEach((el) => {
    if (el.childNodes.length) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent.trim();
          if (txt) textContent += txt + ' ';
        }
      });
    }
  });
  textContent = textContent.trim();

  // Always replace the element, even if no card is created
  if (img && textContent) {
    const cardRow = [img, textContent];
    const cells = [headerRow, cardRow];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  } else {
    // If not a valid card (no text), replace with empty node
    element.replaceWith(document.createTextNode(''));
  }
}
