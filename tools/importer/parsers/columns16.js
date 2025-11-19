/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Columns (columns16)'];

  // --- COLUMN 1: Logo ---
  // Reference the logo anchor (with image inside)
  const logoAnchor = element.querySelector('a.footer_foodiesImage__qwpQH');

  // --- COLUMN 2: Subscribe Form ---
  // Reference the subscribe form container
  const subscribeDiv = element.querySelector('.footer_subscribeMainDiv__Bg4Bv');

  // --- COLUMN 3: Navigation Links ---
  // Find the flex container holding navigation columns
  const navFlexDiv = Array.from(element.children).find(div => (div.style.display === 'flex' || div.getAttribute('style')?.includes('display:flex')));
  let navCell = '';
  if (navFlexDiv) {
    // Find the two nav lists and the divider
    const navDivs = Array.from(navFlexDiv.children).filter(child => child.classList.contains('footer_pagesList__SpW_J'));
    const divider = Array.from(navFlexDiv.children).find(child => child.style.borderRight || child.getAttribute('style')?.includes('border-right'));
    // Compose navigation cell: two nav lists separated by divider
    if (navDivs.length === 2 && divider) {
      const navFragment = document.createDocumentFragment();
      navFragment.append(navDivs[0]);
      navFragment.append(divider);
      navFragment.append(navDivs[1]);
      navCell = navFragment;
    } else if (navDivs.length === 2) {
      // If no divider, just append both nav lists
      const navFragment = document.createDocumentFragment();
      navFragment.append(navDivs[0]);
      navFragment.append(navDivs[1]);
      navCell = navFragment;
    } else if (navDivs.length === 1) {
      navCell = navDivs[0];
    }
  }

  // Compose the content row in order: logo | subscribe | navigation
  const contentRow = [logoAnchor, subscribeDiv, navCell];

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
