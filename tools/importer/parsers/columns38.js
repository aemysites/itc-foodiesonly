/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns38)'];

  // Find the decorative illustrated border (food items) at the top
  // It is not in the provided HTML, but if present, it would likely be an <img> or <svg> above the columns
  // Defensive: check for an image or svg at the top of the element
  let decorativeBorder = null;
  const firstImgOrSvg = element.querySelector(':scope > img, :scope > svg');
  if (firstImgOrSvg) {
    decorativeBorder = firstImgOrSvg.cloneNode(true);
  }

  // Get the two main column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Helper to extract content from each column
  function extractColumnContent(colEl) {
    // Get all images in the column
    const imgs = Array.from(colEl.querySelectorAll('img'));
    // Get the text container (should be a div with heading and paragraph)
    const textDiv = colEl.querySelector('div');
    let textContent = [];
    if (textDiv) {
      const heading = textDiv.querySelector('h2');
      const para = textDiv.querySelector('p');
      if (heading) textContent.push(heading);
      if (para) textContent.push(para);
    }
    return [...imgs, ...textContent];
  }

  // Build the second row: one cell per column
  const contentRow = columns.map(extractColumnContent);

  // If decorative border exists, add it as a row above the columns
  let tableData;
  if (decorativeBorder) {
    tableData = [headerRow, [decorativeBorder], contentRow];
  } else {
    tableData = [headerRow, contentRow];
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with block table
  element.replaceWith(block);
}
