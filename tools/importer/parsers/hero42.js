/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO (hero42) block ---
  // 1 column, 3 rows: [Header], [Image], [Text/CTA]

  // 1. Header row
  const headerRow = ['Hero (hero42)'];

  // 2. Image row: select only the desktop image for the hero background
  const images = Array.from(element.querySelectorAll('img'));
  let heroImg = images.find(img => img.className.includes('desktop')) || images[0];
  const imageRow = [heroImg ? heroImg : ''];

  // 3. Text/CTA row: find heading, subheading, CTA
  const dataDiv = element.querySelector('.festival_feastivalbannerdata__s1TNL');
  let textContent = [];
  if (dataDiv) {
    // Heading (h1)
    const heading = dataDiv.querySelector('h1');
    if (heading) textContent.push(heading);
    // Subheading (none in this example, but check for h2/h3/p)
    const subheading = dataDiv.querySelector('h2, h3, p');
    if (subheading) textContent.push(subheading);
    // CTA: look for anchor or button inside dataDiv (none in this example)
    const cta = dataDiv.querySelector('a, button');
    if (cta) textContent.push(cta);
    // Also include the scroll-down icon if present
    const scrollIcon = dataDiv.querySelector('span');
    if (scrollIcon) textContent.push(scrollIcon);
  }
  // Defensive: if no text found, leave cell empty
  const textRow = [textContent.length ? textContent : ''];

  // Build table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
