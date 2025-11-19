/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Find all card containers (each card is a .RecipeDitails_recipeplatcolumnmob__Dl9tJ)
  const cardContainers = element.querySelectorAll('.RecipeDitails_recipeplatcolumnmob__Dl9tJ');

  cardContainers.forEach(card => {
    // Image: inside .RecipeDitails_recipplateimg__gbywG img
    let img = card.querySelector('.RecipeDitails_recipplateimg__gbywG img');
    // Clone the image for use in the table
    let imgClone = img ? img.cloneNode(true) : '';

    // Title: inside .RecipeDitails_greenshadowplat__GnfU9
    let title = card.querySelector('.RecipeDitails_greenshadowplat__GnfU9');

    // Description: extract all visible text from .RecipeDitails_recipeplatebtm__AkwAc, ignoring hidden spans
    let descContainer = card.querySelector('.RecipeDitails_recipeplatebtm__AkwAc');
    let descriptionText = '';
    if (descContainer) {
      // Get all spans that are visible (not hidden)
      let mainSpan = descContainer.querySelector('span[width="0"] > span[style*="display:block"]');
      if (mainSpan) {
        // Collect all text from child <span>s, separated by spaces for <br>
        let textParts = [];
        mainSpan.childNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
            textParts.push(node.textContent.trim());
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            textParts.push('\n');
          }
        });
        descriptionText = textParts.join(' ').replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
      } else {
        // fallback: use the whole descContainer text, but remove ...Read More if present
        let text = descContainer.textContent.replace(/\.\.\. Read More/g, '').trim();
        descriptionText = text;
      }
    }

    // Compose the text cell: Title (strong), then description
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
    }
    if (descriptionText) {
      const p = document.createElement('p');
      p.textContent = descriptionText;
      textCell.appendChild(p);
    }

    // Row: [Image, Text]
    const row = [imgClone, textCell];
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
