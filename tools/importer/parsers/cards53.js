/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards53) block
  const headerRow = ['Cards (cards53)'];
  const cells = [headerRow];

  // Insert section header above the table
  const sectionHeader = element.querySelector('h2');
  if (sectionHeader) {
    element.parentNode.insertBefore(sectionHeader.cloneNode(true), element);
  }

  // Find the slider container holding all cards
  const slider = element.querySelector('.festival_sliderSpecial__gqhDw .slick-slider');
  if (!slider) return;

  // Find all card slides
  const slides = slider.querySelectorAll('.slick-slide');

  slides.forEach((slide) => {
    // Each slide contains the card
    // Find the anchor that wraps the card content
    const anchor = slide.querySelector('a');
    if (!anchor) return;

    // --- Image cell ---
    // Find the main card image inside the anchor
    const imgContainer = anchor.querySelector('.festival_likemostimg__oHb7h');
    let cardImg = null;
    if (imgContainer) {
      cardImg = imgContainer.querySelector('img');
    }
    // Defensive: fallback to any img inside anchor if not found
    if (!cardImg) {
      cardImg = anchor.querySelector('img');
    }

    // --- Text cell ---
    // Wrap all card text content in the anchor to preserve the link
    const cardContent = document.createElement('div');

    // Dietary label (e.g., Vegan, Veg + Dairy)
    const dietLabel = anchor.querySelector('.festival_vegsec__mjhWY');
    if (dietLabel) {
      cardContent.appendChild(dietLabel.cloneNode(true));
    }

    // Title/Description
    const titleDesc = anchor.querySelector('.festival_likebtmdesc__xANXj');
    if (titleDesc) {
      // Make the title a heading for clarity
      const heading = document.createElement('h3');
      heading.textContent = titleDesc.textContent.trim();
      cardContent.appendChild(heading);
    }

    // Info tags (time, difficulty)
    const infoBox = anchor.querySelector('.festival_infoBox__sP0zD');
    if (infoBox) {
      cardContent.appendChild(infoBox.cloneNode(true));
    }

    // Share/Save actions
    const menuCard = slide.querySelector('.festival_menucard__SRZgF');
    if (menuCard) {
      // Get both share and save elements
      const shareLists = menuCard.querySelectorAll('.festival_sharelist__E7WXT');
      shareLists.forEach((shareList) => {
        cardContent.appendChild(shareList.cloneNode(true));
      });
    }

    // Favorite/heart icon (decorative but present)
    const favIcon = anchor.querySelector('.festival_favorite__Nv9ik') || anchor.querySelector('.festival_addtofav__E8SDq');
    if (favIcon) {
      cardContent.appendChild(favIcon.cloneNode(true));
    }

    // Wrap all card content in the anchor to preserve the link
    const cardLink = document.createElement('a');
    cardLink.href = anchor.getAttribute('href');
    cardLink.appendChild(cardContent);

    // Assemble row: [image, text]
    cells.push([
      cardImg ? cardImg.cloneNode(true) : '',
      cardLink
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
