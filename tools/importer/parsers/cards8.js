/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from each card element
  function extractCard(cardEl, cardLink) {
    // Options icon (secondary icon) at the top of each card
    const optionsImg = cardEl.querySelector('.topText .event-image-parent img');
    // Main image: inside .blog-card-img-container
    const imgContainer = cardEl.querySelector('.blog-card-img-container');
    let mainImg = imgContainer ? imgContainer.querySelector('img') : null;
    if (!mainImg) {
      mainImg = cardEl.querySelector('img');
    }
    // Compose image cell: options icon above, main image below
    let imageCell = '';
    if (mainImg || optionsImg) {
      const imageCellDiv = document.createElement('div');
      if (optionsImg) {
        imageCellDiv.appendChild(optionsImg.cloneNode(true));
        imageCellDiv.appendChild(document.createElement('br'));
      }
      if (mainImg) {
        imageCellDiv.appendChild(mainImg.cloneNode(true));
      }
      imageCell = imageCellDiv.childNodes.length ? imageCellDiv : '';
      // Wrap image cell with link if available
      if (cardLink && cardLink.href) {
        const link = document.createElement('a');
        link.href = cardLink.href;
        link.appendChild(imageCell);
        imageCell = link;
      }
    }

    // Text content: Title, Category, Date, Heart count
    const titleDiv = cardEl.querySelector('.bigTextDiv .bigText');
    const categoryDiv = cardEl.querySelector('.smallImageDiv .text .name');
    let dateText = '';
    const bottomText = cardEl.querySelector('.recipeTextDiv .bottomText');
    if (bottomText) {
      const dateDiv = bottomText.querySelector('.text');
      if (dateDiv) {
        dateText = dateDiv.textContent.trim();
      }
    }
    let heartIcon = null;
    let heartCount = '';
    if (bottomText) {
      const heartDiv = bottomText.querySelector('div[style*="align-items: center"]');
      if (heartDiv) {
        heartIcon = heartDiv.querySelector('img');
        const heartSpan = heartDiv.querySelector('span');
        if (heartSpan) {
          heartCount = heartSpan.textContent.trim();
        }
      }
    }

    // Compose text cell content
    const textCellDiv = document.createElement('div');
    if (categoryDiv) {
      const catLabel = document.createElement('div');
      catLabel.style.fontSize = 'small';
      catLabel.style.fontWeight = 'bold';
      catLabel.style.marginBottom = '4px';
      catLabel.textContent = categoryDiv.textContent.trim();
      textCellDiv.appendChild(catLabel);
    }
    if (heartIcon || heartCount) {
      const heartWrap = document.createElement('div');
      heartWrap.style.display = 'inline-block';
      if (heartIcon) heartWrap.appendChild(heartIcon.cloneNode(true));
      if (heartCount) {
        const countSpan = document.createElement('span');
        countSpan.textContent = ' ' + heartCount;
        heartWrap.appendChild(countSpan);
      }
      textCellDiv.appendChild(heartWrap);
    }
    if (dateText) {
      const dateDiv = document.createElement('div');
      dateDiv.style.float = 'right';
      dateDiv.textContent = dateText;
      textCellDiv.appendChild(dateDiv);
    }
    if (titleDiv) {
      const titleEl = document.createElement('div');
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginTop = '8px';
      titleEl.textContent = titleDiv.textContent.trim();
      textCellDiv.appendChild(titleEl);
    }
    let textCell = textCellDiv.childNodes.length ? textCellDiv : '';
    // Wrap text cell with link if available
    if (cardLink && cardLink.href) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.appendChild(textCell);
      textCell = link;
    }

    return [imageCell, textCell];
  }

  // Find all card elements
  const slickTrack = element.querySelector('.slick-track');
  const cardDivs = [];
  if (slickTrack) {
    const slides = slickTrack.querySelectorAll('.slick-slide');
    slides.forEach(slide => {
      const cardLink = slide.querySelector('a');
      if (cardLink) {
        const cardDiv = cardLink.querySelector('.bloggCardDiv');
        if (cardDiv) {
          cardDivs.push({ cardDiv, cardLink });
        }
      }
    });
  }

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards8)']);
  cardDivs.forEach(({ cardDiv, cardLink }) => {
    rows.push(extractCard(cardDiv, cardLink));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
