/* global WebImporter */
export default function parse(element, { document }) {
  // Extract heading (section heading)
  const heading = element.querySelector('h2.something-new-heading_container-data');
  let headingBlock = null;
  if (heading) {
    const headingDiv = document.createElement('div');
    headingDiv.appendChild(heading.cloneNode(true));
    headingBlock = headingDiv;
  }

  // Helper to extract card elements
  function extractCards(el) {
    const track = el.querySelector('.slick-track');
    if (!track) return [];
    return Array.from(track.children).filter(child => child.classList.contains('slick-slide'));
  }

  // Helper to extract all images/icons for the card image cell
  function extractCardImageCell(card) {
    const cell = document.createElement('div');
    // Main recipe image
    const mainImg = card.querySelector('.recipe-image-container img.topRecipeImage');
    if (mainImg) cell.appendChild(mainImg.cloneNode(true));
    // Overlay add icon
    const overlayIcon = card.querySelector('.recipe-image-overlay .add-icon-div img');
    if (overlayIcon) cell.appendChild(overlayIcon.cloneNode(true));
    // Heart icon
    const heartIcon = card.querySelector('.like-image img');
    if (heartIcon) cell.appendChild(heartIcon.cloneNode(true));
    return cell;
  }

  // Helper to extract text content for the card text cell
  function extractCardTextCell(card) {
    const cell = document.createElement('div');
    // Label
    const label = card.querySelector('.bottomText .text');
    if (label) {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = label.textContent;
      cell.appendChild(labelDiv);
    }
    // Likes count
    const likeSpan = card.querySelector('.like-image span');
    if (likeSpan) {
      const likeDiv = document.createElement('div');
      likeDiv.textContent = likeSpan.textContent;
      cell.appendChild(likeDiv);
    }
    // Title (with link if present)
    const title = card.querySelector('.bigTextDiv .bigText');
    const link = card.closest('a[href]');
    if (title) {
      const titleEl = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = title.textContent;
        titleEl.appendChild(a);
      } else {
        titleEl.textContent = title.textContent;
      }
      cell.appendChild(titleEl);
    }
    // Time and Difficulty with icons
    const yellowSubDiv = card.querySelector('.yellowSubDiv');
    if (yellowSubDiv) {
      const infoDiv = document.createElement('div');
      infoDiv.style.display = 'flex';
      infoDiv.style.gap = '1em';
      // Time icon and text
      const timeIcon = yellowSubDiv.querySelector('.leftText img');
      if (timeIcon) infoDiv.appendChild(timeIcon.cloneNode(true));
      const timeSpan = yellowSubDiv.querySelector('.leftText .leftSpan');
      if (timeSpan) {
        const timeEl = document.createElement('span');
        timeEl.textContent = timeSpan.textContent;
        infoDiv.appendChild(timeEl);
      }
      // Difficulty icon and text
      const diffIcon = yellowSubDiv.querySelector('.rightText img');
      if (diffIcon) infoDiv.appendChild(diffIcon.cloneNode(true));
      const diffSpan = yellowSubDiv.querySelector('.rightText .rightSpan');
      if (diffSpan) {
        const diffEl = document.createElement('span');
        diffEl.textContent = diffSpan.textContent;
        infoDiv.appendChild(diffEl);
      }
      cell.appendChild(infoDiv);
    }
    return cell;
  }

  // Prepare table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards41)']);

  // For each card, extract image and text
  extractCards(element).forEach(slide => {
    const cardContainer = slide.querySelector('.recipe-card-container');
    if (!cardContainer) return;
    const imgCell = extractCardImageCell(cardContainer);
    const textCell = extractCardTextCell(cardContainer);
    rows.push([imgCell, textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  if (headingBlock) {
    element.replaceWith(headingBlock, block);
  } else {
    element.replaceWith(block);
  }
}
