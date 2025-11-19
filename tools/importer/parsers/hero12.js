/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero12)'];

  // Find the main hero image
  let heroImg = null;
  const imgs = Array.from(element.querySelectorAll('img'));
  heroImg = imgs.find(img => img.classList.contains('recipebanner_recipeImage__W0_bC'));
  if (!heroImg && imgs.length > 0) {
    heroImg = imgs[imgs.length - 1];
  }
  const imageRow = [heroImg ? heroImg : ''];

  // --- TEXT ROW ---
  // Compose all overlay text and meta info into a single cell
  const textCellContent = [];

  // 1. Breadcrumb (from top of block)
  // Try to find breadcrumb visually (not just semantic)
  let breadcrumbText = '';
  // Search from document for any element with text matching 'Home > Blogs'
  const possibleBreadcrumb = Array.from(document.querySelectorAll('a, span, strong, p, div')).find(el => /Home\s*>\s*Blogs/.test(el.textContent));
  if (possibleBreadcrumb) {
    breadcrumbText = possibleBreadcrumb.textContent.trim();
  }
  if (breadcrumbText) {
    const bcEl = document.createElement('p');
    bcEl.textContent = breadcrumbText;
    textCellContent.push(bcEl);
  }

  // 2. Overlay: headline and meta info
  const overlay = element.querySelector('.recipebanner_overlay__a_9gs');
  if (overlay) {
    // Headline (h2)
    const title = overlay.querySelector('h2');
    if (title) textCellContent.push(title.cloneNode(true));
    // Meta info (time, date, etc)
    const meta = overlay.querySelector('.recipebanner_meta__pJb8u');
    if (meta) textCellContent.push(meta.cloneNode(true));
  }

  // 3. Scroll-down icon (decorative)
  const scrollDiv = element.querySelector('.recipebanner_scrolldwn__JU7TI');
  if (scrollDiv) {
    const scrollIcon = scrollDiv.querySelector('img');
    if (scrollIcon) textCellContent.push(scrollIcon.cloneNode(true));
  }

  // Table rows
  const cells = [
    headerRow,
    imageRow,
    [textCellContent.length ? textCellContent : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
