/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero26)'];

  // There is no image in this hero block, so row 2 is empty
  const imageRow = [''];

  // Row 3: Title (styled as heading)
  // Collect all text segments from the source HTML
  const h1 = element.querySelector('h1');
  let contentFrag = document.createDocumentFragment();
  if (h1) {
    // Get the first span (before the pill)
    const firstSpan = h1.querySelector('span');
    if (firstSpan) {
      contentFrag.appendChild(document.createTextNode(firstSpan.textContent));
    }
    // Get the pill/green box
    const boxContainer = h1.querySelector('.RecipeDitails_boxcontainer__sxmp6');
    if (boxContainer) {
      const shadowBox = boxContainer.querySelector('.RecipeDitails_greenshadowbox___2DjG');
      if (shadowBox) {
        const pillDiv = document.createElement('span');
        pillDiv.setAttribute('class', 'hero-title-pill');
        pillDiv.textContent = shadowBox.textContent.trim();
        contentFrag.appendChild(document.createTextNode(' '));
        contentFrag.appendChild(pillDiv);
      }
    }
    // Get the trailing span (after the pill)
    const spans = h1.querySelectorAll('span');
    if (spans.length > 1) {
      // The second span is after the pill
      contentFrag.appendChild(document.createTextNode(' ' + spans[1].textContent));
    }
  } else {
    // fallback: just use all text
    contentFrag.appendChild(document.createTextNode(element.textContent.trim()));
  }

  // Wrap in a heading
  const heading = document.createElement('h1');
  heading.appendChild(contentFrag);

  // Row 3 contains the heading with all text segments
  const contentRow = [heading];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
