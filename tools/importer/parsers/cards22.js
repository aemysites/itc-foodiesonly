/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract all main content cards (image + text)
  function extractMainCards() {
    const cards = [];
    // Get all main content blocks (intro, decoration, food, summary)
    const mainBlocks = Array.from(element.querySelectorAll('.extra-content-styles_extraContentContainer__kcYas'));
    const imageDivs = Array.from(element.querySelectorAll('div[style*="display: flex"]'));
    // Pair each image with its following text block
    for (let i = 0; i < Math.min(imageDivs.length, mainBlocks.length); i++) {
      const img = imageDivs[i].querySelector('img');
      const htmlContent = mainBlocks[i].querySelector('.extra-content-styles_htmlExtraContent__8QwO8');
      if (!htmlContent) continue;
      const textCell = document.createElement('div');
      Array.from(htmlContent.children).forEach(child => {
        textCell.appendChild(child.cloneNode(true));
      });
      cards.push([img, textCell]);
    }
    // Also include the intro sections (Quick Summary, Deep Dive) before first image
    const introBlock = element.querySelector('.blog-content-styles_secondContentSection__ISuAy');
    if (introBlock) {
      const flexDiv = introBlock.querySelector('.blog-content-styles_blogFlexDiv__Ol1Hl');
      if (flexDiv && flexDiv.nextElementSibling) {
        // If there is a next sibling, use its content
        const introText = document.createElement('div');
        Array.from(introBlock.parentNode.children).forEach(child => {
          if (child !== introBlock) {
            Array.from(child.children).forEach(grandchild => {
              introText.appendChild(grandchild.cloneNode(true));
            });
          }
        });
        if (introText.children.length) {
          cards.unshift([null, introText]);
        }
      }
    }
    return cards;
  }

  // Extract sidebar cards (Related Blogs)
  function extractSidebarCards() {
    const sidebar = element.querySelector('.BlogDitails_relatedBlog__uqAXr');
    if (!sidebar) return [];
    const items = Array.from(sidebar.querySelectorAll('li'));
    return items.map(li => {
      const img = li.querySelector('img');
      const title = li.querySelector('h2');
      const desc = li.querySelector('.BlogDitails_relatedBlogtxt__6c55o');
      const a = li.querySelector('a');
      const textCell = document.createElement('div');
      if (title) {
        const heading = document.createElement('h3');
        heading.textContent = title.textContent;
        textCell.appendChild(heading);
      }
      if (desc && desc.textContent !== title.textContent) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.appendChild(p);
      }
      if (a) {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.href;
        textCell.appendChild(link);
      }
      return [img, textCell];
    });
  }

  // Extract fact carousel as individual cards (with label as icon)
  function extractBlurbCards() {
    const blurb = element.querySelector('.BlogDitails_blurginner__oBeR9');
    if (!blurb) return [];
    const facts = Array.from(blurb.querySelectorAll('.slick-slide'))
      .map(slide => slide.textContent.trim())
      .filter(Boolean);
    const blurbLabel = element.querySelector('.BlogDitails_greenshadowbox__pqyev');
    let labelDiv = null;
    if (blurbLabel) {
      labelDiv = document.createElement('div');
      labelDiv.textContent = blurbLabel.textContent.trim();
    }
    return facts.map(fact => {
      const textCell = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = fact;
      textCell.appendChild(p);
      return [labelDiv ? labelDiv.cloneNode(true) : null, textCell];
    });
  }

  // Compose table rows
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];
  extractMainCards().forEach(row => rows.push(row));
  extractSidebarCards().forEach(row => rows.push(row));
  extractBlurbCards().forEach(row => rows.push(row));

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
