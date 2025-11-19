/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slides
  const slides = [];
  const slideDivs = element.querySelectorAll('.slick-slide');
  slideDivs.forEach((slideDiv) => {
    // --- Media cell ---
    let mediaCell = null;
    const left = slideDiv.querySelector('.RecipeDitails_recflowslidleft__snFmP');
    if (left) {
      // Prefer video poster as image
      const video = left.querySelector('video');
      if (video && video.poster) {
        const img = document.createElement('img');
        img.src = video.poster;
        if (video.getAttribute('aria-label')) {
          img.setAttribute('alt', video.getAttribute('aria-label'));
        }
        mediaCell = img;
      } else {
        // fallback to image if present
        const img = left.querySelector('img');
        if (img) mediaCell = img.cloneNode(true);
      }
    }
    if (!mediaCell) {
      mediaCell = document.createElement('span'); // empty placeholder
    }

    // --- Text cell ---
    // Collect all text content from the right side, including all headings, paragraphs, and links
    const right = slideDiv.querySelector('.RecipeDitails_recflowslidright__jN6WV');
    let textCell = [];
    if (right) {
      const inner = right.querySelector('.RecipeDitails_recflowslidrightinner__m8I0_') || right;
      // Collect all block children (headings, paragraphs, divs, etc.)
      inner.childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element: clone all elements to preserve structure and include all text
          textCell.push(node.cloneNode(true));
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node: preserve non-empty text
          textCell.push(document.createTextNode(node.textContent));
        }
      });
      // If nothing was collected, fallback to all text content
      if (textCell.length === 0 && inner.textContent.trim()) {
        textCell.push(document.createTextNode(inner.textContent.trim()));
      }
    }
    // If still empty, fallback to right's text content
    if (textCell.length === 0 && right && right.textContent.trim()) {
      textCell = [document.createTextNode(right.textContent.trim())];
    }
    slides.push([mediaCell, textCell]);
  });

  const headerRow = ['Carousel (carousel43)'];
  const rows = [headerRow, ...slides];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
