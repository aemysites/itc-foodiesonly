/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review Checklist ---
  // 1. No hardcoded content; all content extracted dynamically
  // 2. No markdown formatting; only HTML elements used
  // 3. Only one table per block (as per example)
  // 4. Table header matches EXACTLY: ['Hero (hero5)']
  // 5. Handles empty/missing elements gracefully
  // 6. No Section Metadata block in example, so none created
  // 7. References existing elements (no cloning)
  // 8. Semantic meaning retained (heading, metadata, etc.)
  // 9. All text content included via overlay
  // 10. Only references image/video elements, no data URLs
  // 11. No model provided, so no html comments needed

  // --- Extraction Logic ---
  // Find overlay (contains heading, metadata, scroll indicator)
  const overlay = element.querySelector('.recipebanner_overlay__a_9gs');

  // Find background media (video or image)
  let bgMedia = null;
  // Prefer video if present
  bgMedia = element.querySelector('video');
  // If no video, try to find a main image
  if (!bgMedia) {
    bgMedia = element.querySelector('img.recipebanner_recipeImage__W0_bC');
  }

  // Row 1: Block name (critical)
  const headerRow = ['Hero (hero5)'];

  // Row 2: Background image or video (only one, referenced)
  let bgRow = [null];
  if (bgMedia) {
    bgRow = [bgMedia];
  }

  // Row 3: Text content (title, metadata, scroll indicator)
  // Use overlay div, which contains all relevant text and icons
  let textRow = [null];
  if (overlay) {
    textRow = [overlay];
  }

  // Compose table (1 column, 3 rows)
  const cells = [
    headerRow,
    bgRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
