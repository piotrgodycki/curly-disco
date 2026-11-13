export default function decorate(block) {
  const rows = [...block.children];
  const pictureRow = rows.find((row) => row.querySelector('picture'));
  const picture = pictureRow?.querySelector('picture');
  const img = picture?.querySelector('img');

  // Alt text comes from the authored imageAlt field; its row is not rendered.
  const altEl = block.querySelector('[data-aue-prop="imageAlt"]');
  const altRow = altEl ? rows.find((row) => row.contains(altEl)) : undefined;
  const altText = altEl?.textContent.trim() || '';

  if (img) {
    if (!img.alt && altText) img.alt = altText;
    // Hero image is the LCP element: load it eagerly with high priority.
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }

  if (altRow) altRow.remove();

  // Promote the authored heading to H1 so the hero title is the page's main heading.
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.tagName !== 'H1') {
    const h1 = document.createElement('h1');
    h1.append(...heading.childNodes);
    heading.replaceWith(h1);
  }

  // Text content sits in a wrapper above the background image and overlay.
  const content = document.createElement('div');
  content.className = 'hero-content';
  rows.forEach((row) => {
    if (row === pictureRow || row === altRow) return;
    content.append(row);
  });
  block.append(content);
}
