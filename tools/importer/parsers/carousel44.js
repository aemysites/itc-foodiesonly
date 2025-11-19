/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel44) block
  const headerRow = ['Carousel (carousel44)'];
  const rows = [headerRow];

  // Find the carousel root
  const carouselRoot = element.querySelector('.carousel-root');
  if (!carouselRoot) return;

  // Find the slider wrapper and slides
  const sliderWrapper = carouselRoot.querySelector('.slider-wrapper');
  if (!sliderWrapper) return;
  const slider = sliderWrapper.querySelector('ul.slider');
  if (!slider) return;

  // Get all slides
  const slideEls = Array.from(slider.querySelectorAll('li.slide'));

  slideEls.forEach((slideEl) => {
    // IMAGE CELL
    let imageCell = null;
    // Try video first
    const videoWrap = slideEl.querySelector('.home-carousel_videoCarousel__mk_vX');
    if (videoWrap) {
      const video = videoWrap.querySelector('video');
      if (video) {
        imageCell = video;
      }
    }
    // If no video, look for image
    if (!imageCell) {
      const img = slideEl.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    // If still no image, try to extract background image from style
    if (!imageCell) {
      const bgDiv = slideEl.querySelector('div[style*="background-image"]');
      if (bgDiv) {
        const style = bgDiv.getAttribute('style');
        const match = style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          const img = document.createElement('img');
          img.src = match[1];
          imageCell = img;
        }
      }
    }
    // If still no image, allow an empty cell (do not skip slide)
    if (!imageCell) {
      imageCell = '';
    }

    // TEXT CELL
    let textCellContent = [];
    // Find the main content container for text
    let contentContainer = slideEl.querySelector('.home-carousel_absoluteLeftoverContent__182ur')
      || slideEl.querySelector('.home-carousel_absoluteContent__NDKRW');
    if (!contentContainer) {
      // fallback: use the slideEl itself
      contentContainer = slideEl;
    }
    // Heading
    const heading = contentContainer.querySelector('.home-carousel_homebannervidtit__L1h1b, .home-carousel_homePageCarouselText__nVD1B');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent;
      textCellContent.push(h2);
    }
    // Description
    const desc = contentContainer.querySelector('.home-carousel_homebannerviddesc__3Z_fB, .home-carousel_homePageCarouselSubHeading__L67NH');
    if (desc) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      textCellContent.push(p);
    }
    // Search bar (include the whole search bar container if present)
    const searchBar = contentContainer.querySelector('.search-bar-container2-home');
    if (searchBar) {
      textCellContent.push(searchBar.cloneNode(true));
    }
    // Ingredient suggestions (as a single block, if present)
    const suggestionDiv = contentContainer.querySelector('.home-carousel_mainSuggestionDiv__c4FGa');
    if (suggestionDiv) {
      textCellContent.push(suggestionDiv.cloneNode(true));
    }
    // CTA button (include the whole button)
    const ctaBtn = contentContainer.querySelector('.home-carousel_homesearchButton__D6Ta5');
    if (ctaBtn) {
      textCellContent.push(ctaBtn.cloneNode(true));
    }
    // If nothing found, fallback to all text content
    if (textCellContent.length === 0) {
      const allText = contentContainer.textContent.trim();
      if (allText) {
        textCellContent.push(allText);
      } else {
        textCellContent.push('');
      }
    }

    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
