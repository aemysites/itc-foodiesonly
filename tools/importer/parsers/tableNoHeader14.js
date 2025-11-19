/* global WebImporter */
export default function parse(element, { document }) {
  // Extract meta info bar
  const metaInfoBar = element.querySelector('.RecipeDitails_mealInfo__iXbbU');
  let metaInfo = [];
  if (metaInfoBar) {
    const items = metaInfoBar.querySelectorAll('.RecipeDitails_infoItem__D_rSQ');
    items.forEach(item => {
      const value = item.querySelector('.RecipeDitails_labelparent__7VsXH');
      const label = item.querySelector('.RecipeDitails_label__hd2Ko');
      if (value && label) {
        metaInfo.push(`${value.textContent.trim()} ${label.textContent.trim()}`);
      }
    });
  }

  // Extract recipe description
  let description = '';
  const descEl = element.querySelector('.RecipeDitails_detailshort__TyK6w');
  if (descEl) description = descEl.textContent.trim();

  // Extract 'Ingredients' heading and 'Serves 2' dropdown
  let ingredientsHeading = '';
  let servesDropdown = '';
  const ingTop = element.querySelector('.RecipeDitails_recipedetailsingredienttop__RjsmX');
  if (ingTop) {
    const h2 = ingTop.querySelector('h2');
    if (h2) ingredientsHeading = h2.textContent.trim();
    const select = ingTop.querySelector('select');
    if (select) servesDropdown = select.options[select.selectedIndex].textContent.trim();
  }

  // Extract ingredients table
  const headerRow = ['Table (no header, tableNoHeader14)'];
  const ingredientTableContainer = element.querySelector('.RecipeDitails_containertable__mFPos');
  let rows = [];
  if (ingredientTableContainer) {
    const sectionTbl = ingredientTableContainer.querySelector('.RecipeDitails_sectiontbl__82WMx');
    if (sectionTbl) {
      // Only add ingredient rows, no extra header row
      const ingredientRows = sectionTbl.querySelectorAll('.RecipeDitails_rowtbl__8yw_z');
      ingredientRows.forEach(rowEl => {
        const unitSpan = rowEl.querySelector('.RecipeDitails_unittbl__m1AwR');
        const ingredientSpan = rowEl.querySelector('.RecipeDitails_ingredienttbl__Doq8q');
        const unit = unitSpan ? unitSpan.textContent.trim() : '';
        const ingredient = ingredientSpan ? ingredientSpan.textContent.trim() : '';
        rows.push([unit, ingredient]);
      });
    }
  }
  const cells = [headerRow, ...rows];
  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Extract related recipes sidebar content as structured HTML
  const relatedSidebar = element.querySelector('.RecipeDitails_relatedArticle__RTkMw');
  let relatedBlock = null;
  if (relatedSidebar) {
    const wrapper = document.createElement('div');
    // Heading
    const heading = relatedSidebar.querySelector('.RecipeDitails_relatedarthead__x76Lt h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      wrapper.appendChild(h2);
    }
    // View all button
    const viewAll = relatedSidebar.querySelector('.RecipeDitails_relviewall__o6Sfs');
    if (viewAll) {
      const a = document.createElement('a');
      a.href = viewAll.href;
      a.textContent = viewAll.textContent.trim();
      wrapper.appendChild(a);
    }
    // List of related recipes
    const ul = document.createElement('ul');
    const cards = relatedSidebar.querySelectorAll('li');
    cards.forEach(card => {
      const li = document.createElement('li');
      // Image
      const img = card.querySelector('img');
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.alt || '';
        li.appendChild(imgEl);
      }
      // Title
      const title = card.querySelector('h2');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        li.appendChild(h3);
      }
      // Description
      const desc = card.querySelector('.RecipeDitails_relrigdesc__Ug8V1');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        li.appendChild(p);
      }
      // Meta info (time, difficulty)
      const meta = card.querySelector('.RecipeDitails_lftpst__vYreJ');
      if (meta) {
        const metaDiv = document.createElement('div');
        metaDiv.textContent = meta.textContent.replace(/\s+/g, ' ').trim();
        li.appendChild(metaDiv);
      }
      ul.appendChild(li);
    });
    if (cards.length) wrapper.appendChild(ul);
    relatedBlock = wrapper;
  }

  // Compose all content into a single array of blocks
  const blocks = [];
  // Meta info bar
  if (metaInfo.length) {
    const metaDiv = document.createElement('div');
    metaDiv.textContent = metaInfo.join(' | ');
    blocks.push(metaDiv);
  }
  // Description
  if (description) {
    const descDiv = document.createElement('div');
    descDiv.textContent = description;
    blocks.push(descDiv);
  }
  // Ingredients heading and dropdown
  if (ingredientsHeading || servesDropdown) {
    const ingDiv = document.createElement('div');
    ingDiv.textContent = `${ingredientsHeading}${servesDropdown ? ' - ' + servesDropdown : ''}`;
    blocks.push(ingDiv);
  }
  // Ingredients table
  blocks.push(tableBlock);
  // Related recipes sidebar
  if (relatedBlock) blocks.push(relatedBlock);

  // Replace the original element with all blocks
  element.replaceWith(...blocks);
}
