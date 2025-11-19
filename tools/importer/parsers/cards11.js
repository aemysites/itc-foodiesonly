/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: 2 columns, multiple rows
  // Each card: [image/icon, text content]

  // Find the slick-list container (holds the cards)
  const slickList = element.querySelector('.slick-list');
  if (!slickList) return;

  // Find all slick-slide elements inside slick-track
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;

  // Always include all slick-slide elements (not just aria-hidden="false")
  const slides = Array.from(slickTrack.querySelectorAll('.slick-slide'));

  // Helper to extract card content from a slide
  function extractCardContent(slide) {
    // Find the anchor that wraps the card content
    const cardAnchor = slide.querySelector('a[href]');
    if (!cardAnchor) return null;

    // Find the main image inside the anchor
    const imgWrapper = cardAnchor.querySelector('.RecipeDitails_likemostimg__UM9el');
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // --- Extract text content in a flexible way ---
    // 1. Label (e.g., "Innovate")
    let label = '';
    const labelDiv = cardAnchor.querySelector('.RecipeDitails_exploresec__eSuWh');
    if (labelDiv) {
      const labelEl = document.createElement('div');
      labelEl.textContent = labelDiv.textContent.trim();
      labelEl.style.fontSize = 'small';
      labelEl.style.display = 'inline-block';
      label = labelEl;
    }

    // 2. Title (as heading)
    let title = '';
    const titleDiv = cardAnchor.querySelector('.RecipeDitails_likebtmdesc__YROdT');
    if (titleDiv) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = titleDiv.textContent.trim();
      title = titleEl;
    }

    // 3. Date
    let date = '';
    const dateDiv = cardAnchor.querySelector('.RecipeDitails_likedate__6XfhU');
    if (dateDiv) {
      const dateEl = document.createElement('div');
      dateEl.textContent = dateDiv.textContent.trim();
      dateEl.style.fontSize = 'small';
      date = dateEl;
    }

    // 4. Like count with heart icon
    let like = '';
    const likeDiv = cardAnchor.querySelector('.RecipeDitails_favorite___4ut4');
    if (likeDiv) {
      like = likeDiv.cloneNode(true);
    }

    // 5. Share/Save labels (from menuCard)
    let shareSave = '';
    const menuCard = slide.querySelector('.RecipeDitails_menucard__50I3U');
    if (menuCard) {
      // Only extract the share/save text labels
      const shareSaveDivs = menuCard.querySelectorAll('.RecipeDitails_sharelist__uXo8z');
      shareSave = document.createElement('div');
      shareSaveDivs.forEach(div => {
        const label = div.querySelector('div:last-child');
        if (label) {
          const labelEl = document.createElement('div');
          labelEl.textContent = label.textContent.trim();
          shareSave.appendChild(labelEl);
        }
      });
    }

    // Compose text cell with all content, preserving structure and icons
    const textCell = document.createElement('div');
    if (label) textCell.appendChild(label);
    if (title) textCell.appendChild(title);
    if (date) textCell.appendChild(date);
    if (like) textCell.appendChild(like);
    if (shareSave && shareSave.childNodes.length) textCell.appendChild(shareSave);

    // Wrap image and text cell in anchor to preserve link
    let imageCell = img;
    let textCellWithLink = textCell;
    if (cardAnchor.href) {
      // Wrap image in link
      const imgLink = document.createElement('a');
      imgLink.href = cardAnchor.href;
      if (img) imgLink.appendChild(img.cloneNode(true));
      imageCell = imgLink;
      // Wrap text in link
      const textLink = document.createElement('a');
      textLink.href = cardAnchor.href;
      textLink.appendChild(textCell);
      textCellWithLink = textLink;
    }

    return [imageCell, textCellWithLink];
  }

  // Build table rows for each card
  const rows = slides
    .map(extractCardContent)
    .filter(row => row && row[0]); // Only include cards with images

  // Table header
  const headerRow = ['Cards (cards11)'];

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);

  // Add the View All CTA below the table if present
  const viewAll = element.querySelector('a.RecipeDitails_viewbtn__7FuG6');
  if (viewAll) {
    const ctaDiv = document.createElement('div');
    ctaDiv.appendChild(viewAll.cloneNode(true));
    block.parentNode.insertBefore(ctaDiv, block.nextSibling);
  }
}
