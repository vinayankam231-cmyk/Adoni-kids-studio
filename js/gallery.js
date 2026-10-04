/**
 * ADONI KIDS STUDIO — Portfolio Filter & Interactive Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initLightbox();
});

// Category Tab Filtering
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-pill, .portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-editorial-card, .portfolio-item');

  if (!filterBtns.length || !portfolioItems.length) return;

  function applyFilter(filterValue) {
    // Update active button state
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterValue) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Filter items
    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const isMatch = filterValue === 'all' || category === filterValue || (category && category.includes(filterValue));
      if (isMatch) {
        item.style.display = '';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 30);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.97)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 220);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue);
    });
  });

  // Check URL query parameters (e.g. ?filter=newborn)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedFilter = urlParams.get('filter');
  if (requestedFilter) {
    applyFilter(requestedFilter);
  }
}

// Fullscreen Editorial Lightbox
function initLightbox() {
  const lightbox = document.getElementById('studioLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const items = Array.from(document.querySelectorAll('.portfolio-editorial-card, .portfolio-item'));

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const currentItem = items[currentIndex];
    const img = currentItem.querySelector('img');
    const titleEl = currentItem.querySelector('.portfolio-editorial-title, .portfolio-title');
    const tagEl = currentItem.querySelector('.portfolio-editorial-tag, .portfolio-tag');
    const title = titleEl ? titleEl.textContent : '';
    const tag = tagEl ? tagEl.textContent : '';

    const highResSrc = currentItem.getAttribute('data-highres') || img.src;

    lightboxImg.src = highResSrc;
    lightboxImg.alt = img.alt || title;
    lightboxCaption.innerHTML = `<strong>${title}</strong> &mdash; <span>${tag}</span>`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    // Only cycle through currently visible items
    const visibleItems = items.filter(it => it.style.display !== 'none');
    if (!visibleItems.length) return;
    const currentItem = items[currentIndex];
    let visIdx = visibleItems.indexOf(currentItem);
    visIdx = (visIdx + 1) % visibleItems.length;
    openLightbox(items.indexOf(visibleItems[visIdx]));
  }

  function showPrev() {
    const visibleItems = items.filter(it => it.style.display !== 'none');
    if (!visibleItems.length) return;
    const currentItem = items[currentIndex];
    let visIdx = visibleItems.indexOf(currentItem);
    visIdx = (visIdx - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(items.indexOf(visibleItems[visIdx]));
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-container') || e.target.classList.contains('lightbox-img-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
