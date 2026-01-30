/* ========================================
   Baniastav – Animations JS
   Intersection Observer, Parallax, Counters
   ======================================== */

(function() {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll Reveal with Intersection Observer ---
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || prefersReduced) {
      // Fallback: show everything
      reveals.forEach(function(el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay')) || 0;
          setTimeout(function() {
            el.classList.add('visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function(el) {
      // Set stagger delay as CSS custom property
      var delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.setProperty('--stagger-delay', delay + 'ms');
      }
      observer.observe(el);
    });
  }

  // --- Counter Animation ---
  function initCounters() {
    var counters = document.querySelectorAll('.stat__number[data-target]');

    if (!('IntersectionObserver' in window) || prefersReduced) {
      counters.forEach(function(el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  // --- Parallax Effect ---
  function initParallax() {
    if (prefersReduced) return;

    var parallaxBg = document.querySelector('.hero__parallax-bg');
    if (!parallaxBg) return;

    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrolled = window.scrollY;
          var heroHeight = document.querySelector('.hero').offsetHeight;
          if (scrolled <= heroHeight) {
            parallaxBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initCounters();
    initParallax();
  });

})();
