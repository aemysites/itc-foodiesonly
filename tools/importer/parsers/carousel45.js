/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel45)'];
  const rows = [headerRow];

  // --- MAIN SLIDE (video poster + text + video link + all headings + modal text if present) ---
  const mainSlide = element.querySelector('.slick-list .slick-track > .slick-slide.slick-current');
  if (mainSlide) {
    // Find the video poster image
    const posterImg = mainSlide.querySelector('video[poster]');
    let imgCell = document.createElement('span');
    if (posterImg && posterImg.getAttribute('poster')) {
      const img = document.createElement('img');
      img.src = posterImg.getAttribute('poster');
      img.alt = posterImg.getAttribute('aria-label') || '';
      imgCell = img;
    }
    // Text cell: headings, description, time, video link, modal dialog text
    const textCell = [];
    // Step heading (e.g., "Description - Step 1")
    const stepHeading = mainSlide.querySelector('.RecipeDitails_slidtp__HT6yi');
    if (stepHeading) {
      const h4 = document.createElement('h4');
      h4.textContent = stepHeading.textContent;
      textCell.push(h4);
    }
    // Step title (as heading)
    const stepTitle = mainSlide.querySelector('.RecipeDitails_slidtp1__6sotG');
    if (stepTitle) {
      const h3 = document.createElement('h3');
      h3.textContent = stepTitle.textContent;
      textCell.push(h3);
    }
    // Description
    const desc = mainSlide.querySelector('.RecipeDitails_desc__D1J_z');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.push(p);
    }
    // Time
    const timeDiv = mainSlide.querySelector('.RecipeDitails_timerecipe__Uz9Oc');
    if (timeDiv) {
      const timeText = timeDiv.textContent.trim();
      if (timeText) {
        const p = document.createElement('p');
        p.textContent = timeText;
        textCell.push(p);
      }
    }
    // Video source link
    const videoSource = mainSlide.querySelector('video > source');
    if (videoSource && videoSource.getAttribute('src')) {
      const a = document.createElement('a');
      a.href = videoSource.getAttribute('src');
      a.textContent = videoSource.getAttribute('src');
      textCell.push(a);
    }
    // Modal dialog text (if present)
    // Look for a modal dialog overlay in the entire element
    const modal = element.querySelector('div[role="dialog"], div[style*="z-index"]');
    if (modal) {
      // Get all visible text nodes in the modal
      const modalTexts = Array.from(modal.querySelectorAll('*'))
        .map(e => e.textContent.trim())
        .filter(t => t);
      if (modalTexts.length) {
        const modalDiv = document.createElement('div');
        modalTexts.forEach(t => {
          const p = document.createElement('p');
          p.textContent = t;
          modalDiv.appendChild(p);
        });
        textCell.push(modalDiv);
      }
    }
    rows.push([imgCell, textCell]);
  }

  // --- STEP CARDS (lower carousel) ---
  const cardTrack = element.querySelector('.RecipeDitails_secondlider__E_C53 .slick-track');
  if (cardTrack) {
    const cardDivs = Array.from(cardTrack.children).filter(div => div.classList.contains('slick-slide'));
    cardDivs.forEach(cardDiv => {
      const card = cardDiv.querySelector('.RecipeDitails_card___czV3');
      if (!card) return;
      // 1st cell: image (mandatory)
      const imgWrapper = card.querySelector('.RecipeDitails_imageWrapper__VexYc img');
      let imgCell = document.createElement('span');
      if (imgWrapper) {
        // Clone image without extra attributes
        const img = document.createElement('img');
        img.src = imgWrapper.src;
        img.alt = imgWrapper.alt || '';
        imgCell = img;
      }
      // 2nd cell: text content (step number, title, time)
      const cellContent = [];
      // Step number
      const stepNum = card.querySelector('.RecipeDitails_stepNumber__u1Pxf');
      if (stepNum) {
        const stepNumClone = document.createElement('div');
        stepNumClone.textContent = stepNum.textContent;
        cellContent.push(stepNumClone);
      }
      // Step title (as heading)
      const stepTitle = card.querySelector('.RecipeDitails_stepTitle__mowR1');
      if (stepTitle) {
        const h3 = document.createElement('h3');
        h3.textContent = stepTitle.textContent;
        cellContent.push(h3);
      }
      // Time (optional)
      const timeDiv = card.querySelector('.RecipeDitails_time__kFNo9');
      if (timeDiv) {
        const timeSpan = timeDiv.querySelector('span:not(.RecipeDitails_timeIcon__y0PI7)');
        if (timeSpan) {
          const p = document.createElement('p');
          p.textContent = timeSpan.textContent;
          cellContent.push(p);
        }
      }
      rows.push([imgCell, cellContent]);
    });
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
