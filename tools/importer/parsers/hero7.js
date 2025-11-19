/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero7) block parser
  // Table: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Background Image
  // Row 3: Title, Subheading, CTA (optional)

  // --- Row 1: Header ---
  const headerRow = ['Hero (hero7)'];

  // --- Row 2: Background Image ---
  let bgImageCell = [''];
  // Find the main image inside .carousel-container
  const carouselContainer = element.querySelector('.carousel-container');
  if (carouselContainer) {
    const img = carouselContainer.querySelector('img');
    if (img) {
      bgImageCell = [img.cloneNode(true)];
    }
  }

  // --- Row 3: Title, Subheading, CTA ---
  let contentCell = [];
  const absContent = element.querySelector('.absolute-content-carousel');
  if (absContent) {
    // Title (main heading)
    const title = absContent.querySelector('.home-page-carousel-text');
    if (title && title.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.textContent = title.textContent.trim();
      contentCell.push(h1);
    }
    // Subheading (optional, but empty in this case)
    const subheading = absContent.querySelector('.home-page-carousel-sub-heading');
    if (subheading && subheading.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = subheading.textContent.trim();
      contentCell.push(p);
    }
    // CTA button (Explore)
    const ctaButton = absContent.querySelector('.home-start-button button');
    if (ctaButton && ctaButton.textContent.trim()) {
      // Create a link element for CTA
      const a = document.createElement('a');
      a.textContent = ctaButton.textContent.trim();
      // If there's a link, use it, otherwise leave as text
      if (ctaButton.hasAttribute('href')) {
        a.href = ctaButton.getAttribute('href');
      }
      contentCell.push(a);
    }
  }
  if (contentCell.length === 0) contentCell = [''];

  // Compose table rows
  const rows = [
    headerRow,
    bgImageCell,
    [contentCell]
  ];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
