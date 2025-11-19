/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Build header row
  const headerRow = ['Columns (columns13)'];

  // Find the vertical toolbar (Like, Save, Share)
  let toolbarDiv = null;
  const toolbar = Array.from(element.querySelectorAll('nav, .RecipeDitails_toolbar__*')).find(el => {
    const text = el.textContent;
    return text && /Like|Save|Share/.test(text);
  });
  if (toolbar) {
    toolbarDiv = document.createElement('div');
    toolbarDiv.style.display = 'flex';
    toolbarDiv.style.flexDirection = 'column';
    toolbar.querySelectorAll('*').forEach((el) => {
      const txt = el.textContent.trim();
      if (txt === 'Like' || txt === 'Save' || txt === 'Share') {
        const span = document.createElement('span');
        span.textContent = txt;
        toolbarDiv.appendChild(span);
      }
    });
    // If no children found, fallback to textContent split
    if (!toolbarDiv.childNodes.length) {
      ['Like','Save','Share'].forEach(txt => {
        if (toolbar.textContent.includes(txt)) {
          const span = document.createElement('span');
          span.textContent = txt;
          toolbarDiv.appendChild(span);
        }
      });
    }
  }

  // Section header: 'Follow Directions'
  const sectionHeader = element.querySelector('.RecipeDitails_RecipeFollowtop__vyxYO h2');
  const sectionHeaderClone = sectionHeader ? sectionHeader.cloneNode(true) : null;

  // Get all slides (steps)
  const mainSlider = element.querySelector('.slider-container .slick-slider.slick-initialized');
  const slides = mainSlider ? mainSlider.querySelectorAll('.slick-slide') : [];

  // Get all step cards (for time info, etc)
  const cardSlider = element.querySelector('.RecipeDitails_secondlider__E_C53 .slick-slider');
  const cards = cardSlider ? cardSlider.querySelectorAll('.slick-slide .RecipeDitails_card___czV3') : [];

  // 2. Build rows for each step (each step = one row, two columns)
  const rows = [headerRow];
  slides.forEach((slide, idx) => {
    // LEFT COLUMN: toolbar (only for first step) + video + step card
    const leftWrapper = document.createElement('div');
    if (toolbarDiv && idx === 0) leftWrapper.appendChild(toolbarDiv.cloneNode(true));
    // Video
    const video = slide.querySelector('video');
    if (video) {
      leftWrapper.appendChild(video.cloneNode(true));
    }
    // Step card (by index)
    if (cards[idx]) {
      leftWrapper.appendChild(cards[idx].cloneNode(true));
    }

    // RIGHT COLUMN: section header (only for first step) + step details
    const rightWrapper = document.createElement('div');
    if (sectionHeaderClone && idx === 0) rightWrapper.appendChild(sectionHeaderClone.cloneNode(true));
    const rightCol = slide.querySelector('.RecipeDitails_recflowslidright__jN6WV');
    if (rightCol) {
      rightCol.querySelectorAll('h3, p').forEach((el) => {
        if (el.textContent && el.textContent.trim()) {
          rightWrapper.appendChild(el.cloneNode(true));
        }
      });
    }
    // Modal overlay (account creation popup) - only ONCE, at the end
    if (idx === slides.length - 1) {
      const modal = element.querySelector('.loginpopup_blurpopup__Kld8o');
      if (modal) {
        rightWrapper.appendChild(modal.cloneNode(true));
      }
    }

    rows.push([leftWrapper, rightWrapper]);
  });

  // 3. Build the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 4. Replace the original element
  element.replaceWith(block);
}
