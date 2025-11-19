/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel3) block: 2 columns, first row is block name, each slide = row
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];

  // Find the slick-track container (holds slides)
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) {
    // Always modify the DOM: remove the element if nothing to parse
    element.replaceWith(document.createTextNode(''));
    return;
  }

  // Get all direct child slides
  const slides = Array.from(slickTrack.children).filter(
    (child) => child.classList.contains('slick-slide')
  );

  let foundAtLeastOne = false;

  slides.forEach((slide) => {
    // Each slide: left = image (mandatory), right = text
    let leftCell = null;
    let rightCell = '';

    // Find left and right containers
    const sliderFlex = slide.querySelector('.RecipeDitails_sliderflex__5inuP, .RecipeDitails_sliderflexonlytxt__Erwlo');
    if (!sliderFlex) return;

    // Left: image (mandatory)
    const leftDiv = sliderFlex.querySelector('.RecipeDitails_recflowslidleft__snFmP');
    let img = leftDiv ? leftDiv.querySelector('img') : null;
    // If no image, do not add this slide
    if (!img) return;
    leftCell = img;
    foundAtLeastOne = true;

    // Right: text content
    const rightDiv = sliderFlex.querySelector('.RecipeDitails_recflowslidright__jN6WV');
    if (rightDiv) {
      const rightInner = rightDiv.querySelector('.RecipeDitails_recflowslidrightinner__m8I0_');
      if (rightInner) {
        // Instead of picking only h3 and p, grab all content preserving structure
        // Remove empty paragraphs and paragraphs with only &nbsp;
        rightInner.querySelectorAll('p').forEach(p => {
          if (!p.textContent.trim() || p.innerHTML.trim() === '&nbsp;') {
            p.remove();
          }
        });
        // If after cleaning, still has content, use it
        if (rightInner.childNodes.length > 0 && rightInner.textContent.trim()) {
          rightCell = Array.from(rightInner.childNodes);
        }
      }
    }

    rows.push([leftCell, rightCell]);
  });

  // Always modify the DOM: if no slides, remove the element
  if (foundAtLeastOne) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  } else {
    element.replaceWith(document.createTextNode(''));
  }
}
