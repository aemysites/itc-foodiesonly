/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards48) block
  const headerRow = ['Cards (cards48)'];
  const rows = [headerRow];

  // Find all card containers (must include all, not just direct children)
  const cardContainers = element.querySelectorAll('.festival_slidetab__5qeej');

  cardContainers.forEach(cardContainer => {
    // Defensive: find the main card area
    const card = cardContainer.querySelector('.festival_likeparentrecipe__A2oZn');
    if (!card) return;

    // Find the anchor that wraps the card content
    const cardLink = card.querySelector('a[href]:not(.festival_sharelist__gJukW)');
    if (!cardLink) return;

    // --- IMAGE CELL ---
    // Prefer desktop image, fallback to mobile
    let img = cardLink.querySelector('.festival_mostdesktopimg__Dxw88');
    if (!img) {
      img = cardLink.querySelector('.festival_mostmobileimg__oqZxn');
    }
    // Defensive: if no image, skip this card
    if (!img) return;

    // --- TEXT CELL ---
    // Compose the text cell
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';

    // Veg label (clone with dot)
    const vegLabel = cardLink.querySelector('.festival_vegsec__Gfefa');
    if (vegLabel) {
      textCell.appendChild(vegLabel.cloneNode(true));
    }

    // Title
    const titleDiv = cardLink.querySelector('.festival_likebtmdesc__HVg89');
    if (titleDiv) {
      const titleEl = document.createElement('div');
      titleEl.style.fontWeight = 'bold';
      titleEl.textContent = titleDiv.textContent.trim();
      textCell.appendChild(titleEl);
    }

    // Favorite count and icon
    const favDiv = cardLink.querySelector('.festival_favorite__1m8W_');
    if (favDiv) {
      textCell.appendChild(favDiv.cloneNode(true));
    }

    // Metadata (bottom info, preserve icons and text)
    const infoBox = cardLink.querySelector('.festival_infoBox__VAZQD');
    if (infoBox) {
      textCell.appendChild(infoBox.cloneNode(true));
    }

    // Share/Save actions
    const menuCard = card.querySelector('.festival_menucard__SLhFp');
    if (menuCard) {
      menuCard.querySelectorAll('a.festival_sharelist__gJukW').forEach(a => {
        textCell.appendChild(a.cloneNode(true));
      });
    }

    // Wrap the image in a link to preserve card clickability
    const cardHref = cardLink.getAttribute('href');
    let imgCell = img;
    if (cardHref) {
      const link = document.createElement('a');
      link.href = cardHref;
      link.appendChild(img.cloneNode(true));
      imgCell = link;
    }

    // Add row: [image/link, text]
    rows.push([imgCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
