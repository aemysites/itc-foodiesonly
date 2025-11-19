/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards52)'];

  // Find the card container (slick-slider -> slick-list -> slick-track -> slick-slide)
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get all card slides (usually multiple, but here only one)
  const cardSlides = slickTrack.querySelectorAll('.slick-slide');

  // Prepare rows for each card
  const rows = [];

  cardSlides.forEach((slide) => {
    // Card main anchor (wraps image and info)
    const cardLink = slide.querySelector('a[href^="/recipes/"]');
    if (!cardLink) return;

    // --- IMAGE CELL ---
    // Find main image inside the anchor
    const imageContainer = cardLink.querySelector('.RecipeDitails_likemostimg__UM9el');
    let cardImage = null;
    if (imageContainer) {
      cardImage = imageContainer.querySelector('img');
    }
    // Defensive fallback: if not found, try any img inside anchor
    if (!cardImage) {
      cardImage = cardLink.querySelector('img');
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // Share and Save for later buttons (above the card)
    const cardActions = slide.querySelector('.RecipeDitails_menucard__50I3U');
    if (cardActions) {
      const share = cardActions.querySelector('.RecipeDitails_sharelist__uXo8z');
      const save = cardActions.querySelectorAll('.RecipeDitails_sharelist__uXo8z')[1];
      if (share) textCellContent.push(share);
      if (save) textCellContent.push(save);
    }

    // Vegan label (with icon)
    const veganLabel = cardLink.querySelector('.RecipeDitails_vegsec__QOLLA');
    if (veganLabel) {
      textCellContent.push(veganLabel);
    }

    // Like/favorite counter (heart icon + count)
    const favoriteCounter = cardLink.querySelector('.RecipeDitails_favorite___4ut4');
    if (favoriteCounter) {
      textCellContent.push(favoriteCounter);
    }

    // Card title (heading) - ensure it's a heading element
    const cardTitle = cardLink.querySelector('.RecipeDitails_likebtmdesc__YROdT');
    if (cardTitle) {
      const heading = document.createElement('h2');
      heading.textContent = cardTitle.textContent;
      textCellContent.push(heading);
    }

    // Info bar (time and difficulty)
    const infoBox = cardLink.querySelector('.RecipeDitails_infoBox__Z4bqn');
    if (infoBox) {
      textCellContent.push(infoBox);
    }

    // View All button (should be part of the card's text cell, at the bottom)
    const viewAllBtn = element.querySelector('.RecipeDitails_viewbtn__7FuG6');
    if (viewAllBtn) {
      textCellContent.push(viewAllBtn);
    }

    // Compose row: [image, text]
    rows.push([
      cardImage ? cardImage : '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
