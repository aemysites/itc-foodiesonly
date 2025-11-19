/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block parser
  // 1. Header row
  const headerRow = ['Cards (cards30)'];

  // 2. Find all card containers (each .exploreAllBlogsMainDiv > .loadMoreBlogCards > a)
  const cardContainers = Array.from(element.querySelectorAll('.exploreAllBlogsMainDiv .loadMoreBlogCards > a'));

  // 3. Build rows for each card
  const rows = cardContainers.map(card => {
    // --- IMAGE CELL ---
    let imageCell = null;
    const imgContainer = card.querySelector('.blog-card-img-container img');
    if (imgContainer) {
      imageCell = imgContainer.cloneNode(true);
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // Label/tag (Explore/Create)
    const label = card.querySelector('.smallImageDiv .text .name');
    if (label) {
      const labelEl = document.createElement('div');
      labelEl.textContent = label.textContent.trim();
      textCellContent.push(labelEl);
    }

    // Likes and date row
    const bottomText = card.querySelector('.recipeTextDiv .bottomText');
    let dateValue = '';
    if (bottomText) {
      // Date
      const dateDiv = bottomText.querySelector('.text');
      if (dateDiv) {
        dateValue = dateDiv.textContent.trim();
      }
      // Likes
      const likesRow = bottomText.querySelector('div[style*="align-items:center"]');
      if (likesRow) {
        const heartImg = likesRow.querySelector('img');
        const likesSpan = likesRow.querySelector('span');
        if (heartImg && likesSpan) {
          const likesDiv = document.createElement('div');
          likesDiv.appendChild(heartImg.cloneNode(true));
          likesDiv.appendChild(likesSpan.cloneNode(true));
          textCellContent.push(likesDiv);
        }
      }
      // Add date after likes (to match screenshot)
      if (dateValue) {
        const dateP = document.createElement('div');
        dateP.textContent = dateValue;
        textCellContent.push(dateP);
      }
    }

    // Title (bigText)
    const bigText = card.querySelector('.bigTextDiv .bigText');
    if (bigText) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = bigText.textContent.trim();
      textCellContent.push(titleEl);
    }

    // Description: Try to get subtitle/description from .bigTextDiv sibling text, or fallback to card text
    let description = '';
    // Try to find a description in .bigTextDiv that is not the title
    const bigTextDiv = card.querySelector('.bigTextDiv');
    if (bigTextDiv) {
      // Look for direct text nodes or <p> siblings
      Array.from(bigTextDiv.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          description += node.textContent.trim() + ' ';
        }
        if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim()) {
          description += node.textContent.trim() + ' ';
        }
        if (node.nodeType === 1 && node.tagName === 'DIV' && !node.classList.contains('bigText') && node.textContent.trim()) {
          description += node.textContent.trim() + ' ';
        }
      });
    }
    // Fallback: look for a <p> directly under card not already used
    if (!description) {
      const fallbackDesc = Array.from(card.querySelectorAll('p')).find(p => {
        const txt = p.textContent.trim();
        if (!txt) return false;
        if (label && txt === label.textContent.trim()) return false;
        if (bigText && txt === bigText.textContent.trim()) return false;
        return true;
      });
      if (fallbackDesc) {
        description = fallbackDesc.textContent.trim();
      }
    }
    if (description) {
      const descEl = document.createElement('div');
      descEl.textContent = description.trim();
      textCellContent.push(descEl);
    }

    // CTA: The card itself is a link, so add a CTA link at the bottom
    if (card.href) {
      const cta = document.createElement('a');
      cta.href = card.href;
      cta.textContent = card.href;
      textCellContent.push(cta);
    }

    return [imageCell, textCellContent];
  });

  // 4. Assemble table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // 5. Replace original element
  element.replaceWith(table);
}
