/* TechNest theme.js — vanilla JS, no dependencies */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = doc.querySelector('[data-nav-toggle]');
    var nav = doc.querySelector('[data-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Quantity steppers ---------- */
  function initQuantity() {
    doc.querySelectorAll('[data-quantity]').forEach(function (wrap) {
      var input = wrap.querySelector('input');
      if (!input) return;
      wrap.querySelectorAll('[data-qty-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var step = parseInt(btn.getAttribute('data-qty-step'), 10) || 1;
          var min = parseInt(input.getAttribute('min'), 10);
          var max = parseInt(input.getAttribute('max'), 10);
          var next = (parseInt(input.value, 10) || 1) + step;
          if (!isNaN(min) && next < min) next = min;
          if (!isNaN(max) && max > 0 && next > max) next = max;
          if (next < 1) next = 1;
          input.value = next;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
  }

  /* ---------- Product gallery ---------- */
  function initGallery() {
    var main = doc.querySelector('[data-gallery-main] img');
    if (!main) return;
    doc.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        var srcset = thumb.getAttribute('data-srcset');
        if (!src) return;
        main.removeAttribute('srcset');
        if (srcset) main.setAttribute('srcset', srcset);
        main.setAttribute('src', src);
        doc.querySelectorAll('[data-gallery-thumb]').forEach(function (t) {
          t.setAttribute('aria-current', t === thumb ? 'true' : 'false');
        });
      });
    });
  }

  /* ---------- Cart drawer ---------- */
  var drawer = doc.querySelector('[data-cart-drawer]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.removeAttribute('hidden');
    doc.body.style.overflow = 'hidden';
    var close = drawer.querySelector('[data-cart-close]');
    if (close) close.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('hidden', '');
    doc.body.style.overflow = '';
  }

  function initDrawer() {
    if (!drawer) return;
    drawer.querySelectorAll('[data-cart-close], [data-cart-overlay]').forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  /* ---------- Cart count refresher ---------- */
  function refreshCartCount(count) {
    doc.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.hidden = !count;
    });
  }

  /* ---------- Add to cart (AJAX) ---------- */
  function initProductForm() {
    var form = doc.querySelector('form.product-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Προσθήκη…'; }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: [
            {
              id: parseInt(form.querySelector('[name="id"]').value, 10),
              quantity: parseInt(form.querySelector('[name="quantity"]').value, 10) || 1
            }
          ]
        })
      })
        .then(function (r) { return r.json(); })
        .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
        .then(function (cart) {
          refreshCartCount(cart.item_count);
          if (drawer) {
            fetch(window.location.pathname + '?section_id=main-cart')
              .then(function (r) { return r.text(); })
              .then(function (html) {
                var parsed = new DOMParser().parseFromString(html, 'text/html');
                var fresh = parsed.querySelector('[data-cart-body]');
                var target = drawer.querySelector('[data-cart-body]');
                if (fresh && target) target.innerHTML = fresh.innerHTML;
              })
              .catch(function () {})
              .finally(openDrawer);
          }
        })
        .catch(function () { form.submit(); })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
        });
    });
  }

  /* ---------- Newsletter ---------- */
  function initNewsletter() {
    doc.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var msg = form.parentElement.querySelector('[data-form-message]');
        if (!msg) return;
        e.preventDefault();
        msg.textContent = 'Ευχαριστούμε! Θα λαμβάνεις πρώτος τα drops.';
        form.reset();
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = doc.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.style.opacity = 1; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      io.observe(el);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initMobileNav();
    initQuantity();
    initGallery();
    initDrawer();
    initProductForm();
    initNewsletter();
    initReveal();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.TechNest = { openCart: openDrawer, closeCart: closeDrawer, refreshCartCount: refreshCartCount };
})();
