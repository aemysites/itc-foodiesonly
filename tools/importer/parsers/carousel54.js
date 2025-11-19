/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel54) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Carousel (carousel54)'];
  const rows = [headerRow];

  // Find all slides in the carousel
  const track = element.querySelector('.slick-track');
  if (!track) return;
  const slides = Array.from(track.children).filter(child => child.classList.contains('slick-slide'));

  slides.forEach((slide) => {
    // Only create a row if there is an image in the slide (for left cell)
    const img = slide.querySelector('img');
    if (!img) return; // If no image, skip this slide
    // LEFT CELL: image
    const leftCell = img.cloneNode(true);
    // RIGHT CELL: text content
    let rightCell = document.createElement('div');
    const right = slide.querySelector('.RecipeDitails_recflowslidright__jN6WV');
    if (right) {
      Array.from(right.children).forEach(child => {
        if (child.textContent && child.textContent.trim()) {
          rightCell.appendChild(child.cloneNode(true));
        }
      });
    }
    rows.push([leftCell, rightCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
