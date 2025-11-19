/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel27)'];

  // Find the carousel track containing all slides
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // Get all direct slide elements
  const slides = Array.from(track.children);

  // Prepare table rows
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Defensive: find image or video in the slide
    let mediaEl = slide.querySelector('img, video');
    let mediaCell;
    if (mediaEl) {
      // If it's a video, convert to a link
      if (mediaEl.tagName.toLowerCase() === 'video') {
        const videoSrc = mediaEl.getAttribute('src');
        if (videoSrc) {
          const videoLink = document.createElement('a');
          videoLink.href = videoSrc;
          videoLink.textContent = videoSrc;
          mediaCell = videoLink;
        } else {
          mediaCell = document.createTextNode('');
        }
      } else {
        // Use the image element directly
        mediaCell = mediaEl;
      }
    } else {
      mediaCell = document.createTextNode('');
    }

    // Find text content (title, description, CTA)
    const textContainer = slide.querySelector('.festival_feastivalbannerdata__s1TNL');
    let textCellContent = [];
    if (textContainer) {
      // Collect all text content, not just headings/buttons
      Array.from(textContainer.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCellContent.push(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          // Wrap text nodes in <p> for structure
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textCellContent.push(p);
        }
      });
    }
    // If nothing found, use empty string
    if (textCellContent.length === 0) {
      textCellContent = [''];
    }

    rows.push([mediaCell, textCellContent]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
