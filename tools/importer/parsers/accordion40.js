/* global WebImporter */
export default function parse(element, { document }) {
  // Extract breadcrumb text
  const breadcrumbDiv = element.querySelector('.breadcrumbDiv');
  let breadcrumbText = '';
  if (breadcrumbDiv) {
    breadcrumbText = breadcrumbDiv.textContent.replace(/\s+/g, ' ').trim();
  }

  // Extract heading text (including 'Questions' in green box)
  let headingText = '';
  const headingDiv = element.querySelector('.faq-custom-heading-parent');
  if (headingDiv) {
    const headingTextParent = headingDiv.querySelector('.heading-text-parent');
    if (headingTextParent) {
      headingText = headingTextParent.textContent.replace(/\s+/g, ' ').trim();
    }
  }

  // Accordion block header row
  const headerRow = ['Accordion (accordion40)'];

  // Find all accordion items (each is a root accordion div)
  const accordionItems = Array.from(
    element.querySelectorAll('.accordionDiv > .MuiAccordion-root')
  );

  if (!accordionItems.length) return;

  // For each accordion item, extract title and content (preserve links)
  const rows = accordionItems.map(acc => {
    // Title cell: find the clickable header
    const titleBtn = acc.querySelector('[role="button"]');
    let titleContent = '';
    if (titleBtn) {
      const titleTextEl = titleBtn.querySelector('p');
      if (titleTextEl) {
        titleContent = titleTextEl.textContent.trim();
      } else {
        titleContent = titleBtn.textContent.trim();
      }
    } else {
      titleContent = acc.textContent.trim();
    }

    // Content cell: find the details region (preserve HTML for links)
    let contentCell = '';
    const details = acc.querySelector('.MuiAccordionDetails-root .expandContent');
    if (details) {
      contentCell = details.innerHTML.trim();
    } else {
      contentCell = '';
    }
    return [titleContent, contentCell];
  });

  // Compose table rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Insert breadcrumb and heading above the block, if present
  if (breadcrumbText) {
    const breadcrumbP = document.createElement('p');
    breadcrumbP.textContent = breadcrumbText;
    element.parentNode.insertBefore(breadcrumbP, element);
  }
  if (headingText) {
    const headingP = document.createElement('p');
    headingP.textContent = headingText;
    element.parentNode.insertBefore(headingP, element);
  }

  // Replace the original element with the block table
  element.replaceWith(block);
}
