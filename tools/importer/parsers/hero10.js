/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost hero block
  let heroBlock = element;
  while (heroBlock && heroBlock.querySelector(':scope > div')) {
    const childDivs = heroBlock.querySelectorAll(':scope > div');
    if (childDivs.length === 1) {
      heroBlock = childDivs[0];
    } else {
      break;
    }
  }

  // Find the overlay and background image
  const overlay = heroBlock.querySelector('.recipebanner_overlay__a_9gs');
  const bgImage = heroBlock.querySelector('img.recipebanner_recipeImage__W0_bC');

  // Row 2: Background image
  let imageRow = [''];
  if (bgImage) imageRow = [bgImage];

  // Row 3: Text content (heading, meta, tags)
  const textContent = document.createElement('div');
  if (overlay) {
    // Heading
    const heading = overlay.querySelector('h2');
    if (heading) textContent.appendChild(heading);
    // Meta info (time, date)
    const meta = overlay.querySelector('.recipebanner_meta__pJb8u');
    if (meta) textContent.appendChild(meta);
    // Tags
    const tags = overlay.querySelector('.recipebanner_bannertags__Fa6xV');
    if (tags) textContent.appendChild(tags);
    // Do NOT include scroll icon
  }
  const textRow = [textContent];

  // Table assembly
  const headerRow = ['Hero (hero10)'];
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
