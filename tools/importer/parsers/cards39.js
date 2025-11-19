/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards39) block parsing
  const headerRow = ['Cards (cards39)'];
  const rows = [headerRow];

  // Find the parent container for cards
  const exploreSpecial = element.querySelector('.festival_exploreSpecial__MUGIR');
  if (!exploreSpecial) return;

  // Select all card containers
  const cardContainers = exploreSpecial.querySelectorAll('.festival_slidetab__4cd3S');

  cardContainers.forEach((cardCont) => {
    // The card content is inside .festival_likeparentrecipe__4KNQv
    const card = cardCont.querySelector('.festival_likeparentrecipe__4KNQv');
    if (!card) return;

    // Find the main link for the card (wraps most of the card content)
    const mainLink = card.querySelector('a[href]');
    // Find the main image for the card
    let image = null;
    if (mainLink) {
      image = mainLink.querySelector('img');
    }
    // Defensive: fallback to image inside .festival_likemostimg__oHb7h
    if (!image) {
      const imgWrap = card.querySelector('.festival_likemostimg__oHb7h');
      if (imgWrap) image = imgWrap.querySelector('img');
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';

    // Dietary type (Veg/Vegan)
    const dietElem = card.querySelector('.festival_vegsec__mjhWY');
    if (dietElem) {
      const dietText = dietElem.textContent.trim();
      if (dietText) {
        const dietSpan = document.createElement('span');
        dietSpan.textContent = dietText;
        textCell.appendChild(dietSpan);
      }
    }

    // Title (recipe name)
    const titleElem = card.querySelector('.festival_likebtmdesc__xANXj');
    if (titleElem) {
      const h3 = document.createElement('h3');
      h3.textContent = titleElem.textContent;
      textCell.appendChild(h3);
    }

    // --- FLEXIBLE: Try to find a description, using less specific selectors ---
    // Try to find a description from the alt attribute of the image if available
    let description = '';
    if (image && image.alt && image.alt.trim() && (!titleElem || image.alt.trim() !== titleElem.textContent.trim())) {
      description = image.alt.trim();
    }
    // If description found, add it
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description;
      textCell.appendChild(descP);
    }

    // Info chips (time and difficulty)
    const infoBox = card.querySelector('.festival_infoBox__sP0zD');
    if (infoBox) {
      textCell.appendChild(infoBox.cloneNode(true));
    }

    // Compose the row: [image, textCell]
    const row = [image, textCell];
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
