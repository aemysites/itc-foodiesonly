/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // --- Extract Section Heading ---
  // Find the section heading: Flavours Of (text) and Govardhan Puja (label)
  const h2 = element.querySelector('h2');
  if (h2) {
    // Find the "Flavours Of" span
    const span = h2.querySelector('span');
    // Find the green label box
    const label = h2.querySelector('.festival_greenshadowbox__Ey1uW');
    if (span || label) {
      const heading = document.createElement('div');
      if (span) {
        const headingText = document.createElement('span');
        headingText.textContent = span.textContent;
        heading.appendChild(headingText);
      }
      if (label) {
        heading.appendChild(label.cloneNode(true));
      }
      element.parentNode.insertBefore(heading, element);
    }
  }

  // Find the slider container
  const slider = element.querySelector('.festival_sliderSpecial__gqhDw .slick-slider .slick-track');
  if (!slider) {
    // Defensive: If not found, do nothing
    return;
  }

  // Each slick-slide is a card
  const cardSlides = slider.querySelectorAll('.slick-slide');
  cardSlides.forEach((slide) => {
    // Find the anchor wrapping the card content
    const cardLink = slide.querySelector('a');
    if (!cardLink) return;

    // Image: inside .festival_likemostimg__oHb7h
    const imgWrapper = cardLink.querySelector('.festival_likemostimg__oHb7h');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Text content: inside .festival_likemostbotom__7dUDN
    const bottomContent = cardLink.querySelector('.festival_likemostbotom__7dUDN');
    let textCellContent = [];
    if (bottomContent) {
      // --- Extract Share/Save icons and text ---
      const menuCard = slide.querySelector('.festival_menucard__SRZgF');
      if (menuCard) {
        const shareList = menuCard.querySelectorAll('.festival_sharelist__E7WXT');
        shareList.forEach((item) => {
          // Each .festival_sharelist__E7WXT contains icon and text
          const icon = item.querySelector('img');
          const label = item.querySelector('div:last-child');
          if (icon && label) {
            // Wrap icon and text together
            const wrapper = document.createElement('span');
            wrapper.appendChild(icon.cloneNode(true));
            wrapper.appendChild(document.createTextNode(' ' + label.textContent));
            textCellContent.push(wrapper);
          }
        });
      }
      // Explore label as a pill (not a link)
      const exploreLabel = bottomContent.querySelector('.festival_exploresec__sktcF');
      if (exploreLabel) {
        textCellContent.push(exploreLabel.cloneNode(true));
      }
      // Title/Description (wrap in heading for semantics, and preserve link)
      const desc = bottomContent.querySelector('.festival_likebtmdesc__xANXj');
      if (desc) {
        const h3 = document.createElement('h3');
        if (cardLink.href) {
          const a = document.createElement('a');
          a.href = cardLink.href;
          a.textContent = desc.textContent;
          h3.appendChild(a);
        } else {
          h3.textContent = desc.textContent;
        }
        textCellContent.push(h3);
      }
      // Date
      const date = bottomContent.querySelector('.festival_likedate__Dyy3F');
      if (date) {
        textCellContent.push(date.cloneNode(true));
      }
    }

    // Defensive: Only add row if image and text are present
    if (imgEl && textCellContent.length > 0) {
      rows.push([imgEl.cloneNode(true), textCellContent]);
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
