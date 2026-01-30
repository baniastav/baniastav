/* ========================================
   Baniastav – Lightbox Gallery
   ======================================== */

(function() {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector('.lightbox__img');
  var lightboxCaption = lightbox.querySelector('.lightbox__caption');
  var closeBtn = lightbox.querySelector('.lightbox__close');
  var prevBtn = lightbox.querySelector('.lightbox__prev');
  var nextBtn = lightbox.querySelector('.lightbox__next');

  var items = [];
  var currentIndex = 0;

  // Collect all lightbox items
  function collectItems() {
    var elements = document.querySelectorAll('[data-lightbox]');
    items = [];
    elements.forEach(function(el) {
      items.push({
        src: el.getAttribute('data-lightbox'),
        caption: el.getAttribute('data-caption') || ''
      });
    });
  }

  function openLightbox(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    lightboxImg.src = items[index].src;
    lightboxImg.alt = items[index].caption;
    lightboxCaption.textContent = items[index].caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function showPrev() {
    var newIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(newIndex);
  }

  function showNext() {
    var newIndex = (currentIndex + 1) % items.length;
    openLightbox(newIndex);
  }

  // Event: click on lightbox triggers
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      e.preventDefault();
      collectItems();
      var src = trigger.getAttribute('data-lightbox');
      var index = items.findIndex(function(item) { return item.src === src; });
      openLightbox(index >= 0 ? index : 0);
    }
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

})();
