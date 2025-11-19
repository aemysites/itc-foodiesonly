/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns49)'];

  // Defensive: get all immediate children (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract the entire column element (preserves bubble and triangle)
  // This ensures resilience to minor HTML variations and keeps the visual structure
  const contentRow = columns.map(col => col);

  // Build the table
  const cells = [
    headerRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
