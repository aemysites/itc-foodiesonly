/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards32) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards32)'];

  // Find the main card container
  const cardRoot = element.querySelector('.festival_likeparentrecipe__A2oZn');
  if (!cardRoot) return;

  // --- COLUMN 1: Image(s) ---
  // Collect both desktop and mobile images
  const imgContainer = document.createElement('div');
  const desktopImg = cardRoot.querySelector('.festival_likemostimg__vldJV img.festival_mostdesktopimg__Dxw88');
  const mobileImg = cardRoot.querySelector('.festival_likemostimg__vldJV img.festival_mostmobileimg__oqZxn');
  if (desktopImg) imgContainer.appendChild(desktopImg.cloneNode(true));
  if (mobileImg) imgContainer.appendChild(mobileImg.cloneNode(true));

  // --- COLUMN 2: Text ---
  const textCol = document.createElement('div');
  textCol.style.display = 'flex';
  textCol.style.flexDirection = 'column';

  // 1. Veg indicator
  const vegDiv = cardRoot.querySelector('.festival_vegsec__Gfefa');
  if (vegDiv) {
    textCol.appendChild(vegDiv.cloneNode(true));
  }

  // 2. Title/Description
  const titleDiv = cardRoot.querySelector('.festival_likebtmdesc__HVg89');
  if (titleDiv) {
    const heading = document.createElement('h3');
    heading.textContent = titleDiv.textContent.trim();
    textCol.appendChild(heading);
  }

  // 3. Favorite count (with icon)
  const favDiv = cardRoot.querySelector('.festival_favorite__1m8W_');
  if (favDiv) {
    textCol.appendChild(favDiv.cloneNode(true));
  }

  // 4. Info bar (time icons)
  const infoBox = cardRoot.querySelector('.festival_infoBox__VAZQD');
  if (infoBox) {
    textCol.appendChild(infoBox.cloneNode(true));
  }

  // 5. Share and Save for later actions (include all text content)
  const actions = cardRoot.querySelector('.festival_menucard__SLhFp');
  if (actions) {
    const actionLinks = actions.querySelectorAll('.festival_sharelist__gJukW');
    actionLinks.forEach((link) => {
      textCol.appendChild(link.cloneNode(true));
    });
  }

  // Compose table rows
  const rows = [headerRow, [imgContainer, textCol]];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
