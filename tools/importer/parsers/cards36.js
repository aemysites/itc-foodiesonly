/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Cards (cards36)'];
  const rows = [headerRow];

  // 2. Find all card slides
  const cardSlides = element.querySelectorAll('.slick-slide');
  cardSlides.forEach((slide) => {
    // Card link (for CTA)
    const cardLink = slide.querySelector('a');
    const cardHref = cardLink ? cardLink.getAttribute('href') : null;
    // Card image
    let cardImg = cardLink ? cardLink.querySelector('img') : null;
    if (!cardImg) cardImg = slide.querySelector('img');

    // Card text container
    let cardText = cardLink ? cardLink.querySelector('.RecipeDitails_likemostbotom__pXFSa') : null;
    if (!cardText) cardText = slide.querySelector('.RecipeDitails_likemostbotom__pXFSa');
    // Badge
    let badgeEl = cardText ? cardText.querySelector('.RecipeDitails_vegsec__QOLLA') : null;
    if (!badgeEl) badgeEl = slide.querySelector('.RecipeDitails_vegsec__QOLLA');
    // Title
    let titleEl = cardText ? cardText.querySelector('.RecipeDitails_likebtmdesc__YROdT') : null;
    if (!titleEl) titleEl = slide.querySelector('.RecipeDitails_likebtmdesc__YROdT');
    // Info chips
    let infoBoxEl = cardLink ? cardLink.querySelector('.RecipeDitails_infoBox__Z4bqn') : null;
    if (!infoBoxEl) infoBoxEl = slide.querySelector('.RecipeDitails_infoBox__Z4bqn');
    // Like count
    let likeEl = cardText ? cardText.querySelector('.RecipeDitails_favorite___4ut4') : null;
    if (!likeEl) likeEl = slide.querySelector('.RecipeDitails_favorite___4ut4');
    // Share/Save actions (call-to-actions)
    const shareSaveEls = [];
    const menucard = slide.querySelector('.RecipeDitails_menucard__50I3U');
    if (menucard) {
      menucard.querySelectorAll('.RecipeDitails_sharelist__uXo8z').forEach(el => {
        shareSaveEls.push(el.cloneNode(true));
      });
    }
    // Compose text cell: badge, heading, like, info, share/save, CTA
    const textCell = document.createElement('div');
    if (badgeEl) {
      const badge = badgeEl.cloneNode(true);
      textCell.appendChild(badge);
    }
    if (titleEl) {
      const heading = document.createElement('strong');
      heading.textContent = titleEl.textContent.trim();
      textCell.appendChild(heading);
    }
    if (likeEl) {
      textCell.appendChild(likeEl.cloneNode(true));
    }
    if (infoBoxEl) {
      textCell.appendChild(infoBoxEl.cloneNode(true));
    }
    shareSaveEls.forEach(node => textCell.appendChild(node));
    // Add CTA as a link at the bottom if available
    if (cardHref && titleEl) {
      const cta = document.createElement('div');
      const link = document.createElement('a');
      link.href = cardHref;
      link.textContent = 'View Recipe';
      cta.appendChild(link);
      textCell.appendChild(cta);
    }
    // Compose the row: [image, text cell]
    rows.push([
      cardImg ? cardImg.cloneNode(true) : '',
      textCell.childNodes.length ? Array.from(textCell.childNodes) : ''
    ]);
  });

  // 3. Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // 4. Replace the original element
  element.replaceWith(table);
}
