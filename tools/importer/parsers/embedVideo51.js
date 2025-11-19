/* global WebImporter */
export default function parse(element, { document }) {
  // Always create a table with the correct header row for Embed (embedVideo51)
  const headerRow = ['Embed (embedVideo51)'];
  // Extract the image from the element (decorative background)
  const img = element.querySelector('img');

  // Per validation, do NOT add a link if there is no external video URL; only include the image
  const cellContent = [];
  if (img) cellContent.push(img);

  // Table structure: header, then cell with image only
  const tableCells = [
    headerRow,
    [cellContent]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(blockTable);
}
