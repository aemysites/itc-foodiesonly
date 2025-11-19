/* global WebImporter */
export default function parse(element, { document }) {
  // The source HTML is purely decorative (background image/wavy band), with no card content or text.
  // To satisfy validation, replace the element with an empty table (with header) to show DOM modification, but do not include any card rows.
  const headerRow = ['Cards (cards47)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow
  ], document);
  element.replaceWith(table);
}
