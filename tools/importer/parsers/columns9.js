/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns9)'];

  // --- COLUMN 1: Logo ---
  let logoCell = null;
  const logoLink = element.querySelector('a[href="/"]');
  if (logoLink && logoLink.querySelector('img')) {
    logoCell = logoLink.cloneNode(true);
  }

  // --- COLUMN 2: Subscription Form (flattened) ---
  let subscribeCell = null;
  const subscribe = element.querySelector('.common_fsubscribeMain__ZzuKi');
  if (subscribe) {
    const frag = document.createDocumentFragment();
    const heading = subscribe.querySelector('.common_fsubscribeTitle__d08ce');
    if (heading) frag.appendChild(heading.cloneNode(true));
    const input = subscribe.querySelector('input[type="text"]');
    if (input) frag.appendChild(input.cloneNode(true));
    const checkboxWrap = subscribe.querySelector('.common_fcheckboxSelect__swSQW');
    if (checkboxWrap) {
      const label = checkboxWrap.querySelector('label');
      if (label) frag.appendChild(label.cloneNode(true));
      const checkText = checkboxWrap.querySelector('.common_fcheckboxSelecttxt__beX3h');
      if (checkText) frag.appendChild(checkText.cloneNode(true));
    }
    const button = subscribe.querySelector('button');
    if (button) frag.appendChild(button.cloneNode(true));
    subscribeCell = frag;
  }

  // --- COLUMN 3: Navigation Links (no divider) ---
  let navCell = null;
  const nav = element.querySelector('.common_fsubright__IXF_7');
  if (nav) {
    const frag = document.createDocumentFragment();
    const navGroups = nav.querySelectorAll('.common_fpagesListn__YZEad');
    navGroups.forEach(group => {
      frag.appendChild(group.cloneNode(true));
    });
    navCell = frag;
  }

  // Compose the columns row
  const columnsRow = [logoCell, subscribeCell, navCell];

  // Table structure: header + columns
  const tableCells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
