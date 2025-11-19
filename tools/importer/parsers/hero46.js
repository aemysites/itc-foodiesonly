/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero46)'];

  // 2. Find the hero image (background/decorative)
  let heroImg = element.querySelector('img');
  let imgCell = heroImg ? [heroImg] : [''];

  // 3. Find the hero text content (heading, subheading, CTA)
  const dataContainer = element.querySelector('.festival_feastivalbannerdata__s1TNL');
  let contentCell = [];

  if (dataContainer) {
    // Heading
    const heading = dataContainer.querySelector('h1');
    if (heading) contentCell.push(heading);

    // CTA: scroll indicator span
    const cta = dataContainer.querySelector('.festival_festscrolldwn__uhTOO');
    if (cta) {
      // Remove any aria-label added previously, preserve original HTML only
      cta.removeAttribute('aria-label');
      contentCell.push(cta);
    }
  }

  // If no content found, fallback to the element's text
  if (contentCell.length === 0) {
    const fallback = document.createElement('div');
    fallback.textContent = element.textContent.trim();
    if (fallback.textContent) contentCell.push(fallback);
  }

  // 4. Build the table
  const rows = [
    headerRow,
    imgCell,
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
