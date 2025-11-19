/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all card slides from slick carousel
  function getCardsFromSlick(el) {
    const slickTrack = el.querySelector('.slick-track');
    if (!slickTrack) return [];
    return Array.from(slickTrack.children).filter(child => child.classList.contains('slick-slide'));
  }

  // Helper: extract image and text content from a card slide
  function extractCardContent(cardSlide) {
    const cardContainer = cardSlide.querySelector('.RecipeDitails_slidetab__uz19n');
    if (!cardContainer) return [null, null];
    const cardLink = cardContainer.querySelector('a[href]');
    // Image: wrap image in link if present
    let cardImg = null;
    if (cardLink) {
      const cardImgWrapper = cardLink.querySelector('.RecipeDitails_likemostimg__UM9el');
      if (cardImgWrapper) {
        const img = cardImgWrapper.querySelector('img');
        if (img) {
          const link = document.createElement('a');
          link.href = cardLink.href;
          link.appendChild(img.cloneNode(true));
          cardImg = link;
        }
      }
    }
    // Fallback: try to find image even if no link
    if (!cardImg) {
      const img = cardContainer.querySelector('img');
      if (img) cardImg = img.cloneNode(true);
    }
    // Text cell: gather all visible text and icons from the card
    const textCellContent = document.createElement('div');
    // Add like/favorite count (heart icon and number)
    const favorite = cardContainer.querySelector('.RecipeDitails_favorite___4ut4');
    if (favorite) {
      const heartImg = favorite.querySelector('img');
      const span = favorite.querySelector('span');
      if (heartImg) textCellContent.appendChild(heartImg.cloneNode(true));
      if (span) {
        const favDiv = document.createElement('span');
        favDiv.textContent = span.textContent.trim();
        textCellContent.appendChild(favDiv);
      }
    }
    // Add Share/Save for later icons and text if present
    const menuCard = cardContainer.querySelector('.RecipeDitails_menucard__50I3U');
    if (menuCard) {
      const shareDiv = menuCard.querySelector('.RecipeDitails_sharelist__uXo8z:first-child');
      if (shareDiv) {
        const shareIcon = shareDiv.querySelector('img');
        const shareText = shareDiv.querySelector('div:last-child');
        if (shareIcon) textCellContent.appendChild(shareIcon.cloneNode(true));
        if (shareText) {
          const shareTextDiv = document.createElement('span');
          shareTextDiv.textContent = shareText.textContent.trim();
          textCellContent.appendChild(shareTextDiv);
        }
      }
      const saveDiv = menuCard.querySelector('.RecipeDitails_sharelist__uXo8z:nth-child(2)');
      if (saveDiv) {
        const saveIcon = saveDiv.querySelector('img');
        const saveText = saveDiv.querySelector('div:last-child');
        if (saveIcon) textCellContent.appendChild(saveIcon.cloneNode(true));
        if (saveText) {
          const saveTextDiv = document.createElement('span');
          saveTextDiv.textContent = saveText.textContent.trim();
          textCellContent.appendChild(saveTextDiv);
        }
      }
    }
    return [cardImg, textCellContent];
  }

  // Find the slick-slider container
  const slickSlider = element.querySelector('.slick-slider');
  if (!slickSlider) return;

  // Extract all card slides
  const cardSlides = getCardsFromSlick(slickSlider);
  if (!cardSlides.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards1)']);
  // Card rows
  cardSlides.forEach(cardSlide => {
    const [img, textCellContent] = extractCardContent(cardSlide);
    if (!img && (!textCellContent || !textCellContent.childNodes.length)) return;
    rows.push([
      img ? img : '',
      textCellContent && textCellContent.childNodes.length ? textCellContent : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
