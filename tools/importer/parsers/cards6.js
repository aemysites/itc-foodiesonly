/* global WebImporter */
export default function parse(element, { document }) {
  // Extract section heading (Tales from the Banana Leaf)
  const headingContainer = element.querySelector('.festival_feastivalfoodtalas__kqJkT h2');
  let headingFragment = null;
  if (headingContainer) {
    headingFragment = headingContainer.cloneNode(true);
  }

  // Find the cards container (slider)
  const slider = element.querySelector('.festival_sliderSpecial__gqhDw');
  const cardsParent = slider || element;
  // Find all card elements (each .festival_likeparentrecipe__4KNQv)
  const cardEls = Array.from(cardsParent.querySelectorAll('.festival_likeparentrecipe__4KNQv'));

  // Helper to extract card info from a card element
  function extractCard(cardEl) {
    // Main image: inside .festival_likemostimg__oHb7h
    let mainImg = null;
    const imgContainer = cardEl.querySelector('.festival_likemostimg__oHb7h img');
    if (imgContainer) {
      mainImg = imgContainer.cloneNode(true);
    }
    // Share and Save actions
    const actions = Array.from(cardEl.querySelectorAll('.festival_sharelist__E7WXT'));
    const actionsFragment = document.createElement('div');
    actions.forEach(action => {
      actionsFragment.appendChild(action.cloneNode(true));
    });
    // Explore CTA
    const cta = cardEl.querySelector('.festival_exploresec__sktcF');
    // Title/desc
    const desc = cardEl.querySelector('.festival_likebtmdesc__xANXj');
    // Date
    const date = cardEl.querySelector('.festival_likedate__Dyy3F');
    // Link
    const link = cardEl.querySelector('a');

    // Compose text cell
    const textCell = document.createElement('div');
    if (actionsFragment.childNodes.length) {
      textCell.appendChild(actionsFragment);
    }
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }
    if (desc) {
      // Use a heading for the title/desc
      const heading = document.createElement('h3');
      heading.textContent = desc.textContent.trim();
      textCell.appendChild(heading);
    }
    if (date) {
      textCell.appendChild(date.cloneNode(true));
    }
    // Wrap in link if present
    let finalTextCell = textCell;
    if (link) {
      const linkEl = document.createElement('a');
      linkEl.href = link.getAttribute('href');
      linkEl.appendChild(textCell);
      finalTextCell = linkEl;
    }
    return [mainImg, finalTextCell];
  }

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards6)']);
  // Card rows
  cardEls.forEach(cardEl => {
    rows.push(extractCard(cardEl));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Insert heading before table if present
  if (headingFragment) {
    element.parentNode.insertBefore(headingFragment, element);
  }
  // Replace original element
  element.replaceWith(block);
}
