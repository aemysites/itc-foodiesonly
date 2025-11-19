/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards34) block parser for a grid of recipe cards
  // Header row as per block spec
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Find all card containers (recipe-card-container inside an <a>)
  const cardLinks = element.querySelectorAll('a > .recipe-card-container');
  const cards = cardLinks.length
    ? Array.from(cardLinks).map(card => card.parentElement)
    : Array.from(element.querySelectorAll('a')).filter(a => a.querySelector('.recipe-card-container'));

  cards.forEach((a) => {
    const card = a.querySelector('.recipe-card-container');
    if (!card) return;
    // --- IMAGE CELL ---
    // Compose all images/icons in a wrapper
    const imageCell = document.createElement('div');
    // Options icon (top left)
    const optionsIcon = card.querySelector('.topText .options-icon');
    if (optionsIcon) {
      imageCell.appendChild(optionsIcon.cloneNode(true));
    }
    // Main image
    let mainImg = card.querySelector('.recipe-image-container img.topRecipeImage');
    if (!mainImg) {
      mainImg = card.querySelector('.recipe-image-container img');
    }
    if (mainImg) {
      imageCell.appendChild(mainImg.cloneNode(true));
    }
    // Add icon (plus, SVG)
    const addIcon = card.querySelector('.add-button-wrapper img');
    if (addIcon) {
      imageCell.appendChild(addIcon.cloneNode(true));
    }
    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    // Dietary label (Veg/Vegan)
    const diet = card.querySelector('.recipeTextDiv .bottomText .text');
    if (diet) {
      const dietDiv = document.createElement('div');
      dietDiv.textContent = diet.textContent.trim();
      textCell.appendChild(dietDiv);
    }
    // Title (bigText)
    const title = card.querySelector('.bigTextDiv .bigText');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }
    // --- METADATA ROW ---
    // Time and Difficulty
    const yellowSubDiv = card.querySelector('.yellowSubDiv');
    if (yellowSubDiv) {
      const metaRow = document.createElement('div');
      // Time (with icon)
      const leftImg = yellowSubDiv.querySelector('.leftText img');
      const leftSpan = yellowSubDiv.querySelector('.leftText .leftSpan');
      if (leftImg) metaRow.appendChild(leftImg.cloneNode(true));
      if (leftSpan) metaRow.appendChild(document.createTextNode(' ' + leftSpan.textContent.trim() + ' '));
      // Difficulty (with icon)
      const rightImg = yellowSubDiv.querySelector('.rightText img');
      const rightSpan = yellowSubDiv.querySelector('.rightText .rightSpan');
      if (rightImg) metaRow.appendChild(rightImg.cloneNode(true));
      if (rightSpan) metaRow.appendChild(document.createTextNode(' ' + rightSpan.textContent.trim()));
      textCell.appendChild(metaRow);
    }
    // Likes (with heart icon)
    const likeDiv = card.querySelector('.like-image');
    if (likeDiv) {
      const likeRow = document.createElement('div');
      const heartImg = likeDiv.querySelector('img');
      if (heartImg) likeRow.appendChild(heartImg.cloneNode(true));
      const likesSpan = likeDiv.querySelector('span');
      if (likesSpan) likeRow.appendChild(document.createTextNode(' ' + likesSpan.textContent.trim()));
      textCell.appendChild(likeRow);
    }
    // --- CTA (card link) ---
    if (a.href) {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = 'View Recipe';
      textCell.appendChild(link);
    }
    // Compose row: [image cell, text cell]
    rows.push([imageCell, textCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
