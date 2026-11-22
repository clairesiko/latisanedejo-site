/* La Tisane de Jo — scripts communs : menu téléphone, adresse e-mail, panier Shopify */
(function () {
  'use strict';

  /* ---------- Menu téléphone ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    var overlay = document.querySelector('.mobile-menu__overlay');
    if (overlay) overlay.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Adresse e-mail (assemblée ici pour ne pas être lue par les robots) ---------- */
  document.querySelectorAll('[data-mail]').forEach(function (el) {
    var addr = el.getAttribute('data-mail').split('').reverse().join('');
    if (el.tagName === 'A') el.href = 'mailto:' + addr;
    el.textContent = addr;
  });

  /* ---------- Quantité (fiches produit) ---------- */
  document.querySelectorAll('.qty').forEach(function (box) {
    var input = box.querySelector('input');
    box.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = parseInt(input.value, 10) || 1;
        v = Math.min(99, Math.max(1, v + (b.hasAttribute('data-plus') ? 1 : -1)));
        input.value = v;
      });
    });
    input.addEventListener('change', function () {
      var v = parseInt(input.value, 10);
      input.value = (v >= 1 && v <= 99) ? v : 1;
    });
  });

  /* ---------- Message « Ajouté au panier » ---------- */
  var toast = document.querySelector('.toast');
  var toastTimer;
  function showToast(label) {
    if (!toast) return;
    toast.querySelector('strong').textContent = 'Ajouté au panier';
    toast.querySelector('small').textContent = label;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 4500);
  }
  if (toast) {
    toast.querySelector('button').addEventListener('click', function () {
      toast.classList.remove('is-visible');
      openCart();
    });
  }

  /* ---------- Panier Shopify ---------- */
  var SHOP = {
    domain: '1b32ns-tw.myshopify.com',
    storefrontAccessToken: 'f37045444ef326a682c6d404ea71f388',
    moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%C2%A0%E2%82%AC'
  };
  var SANS = "'Source Sans 3', system-ui, sans-serif";
  var cartPromise = null;
  var clientRef = null;
  var badge = document.querySelector('.cart-count');
  var cartBtn = document.querySelector('.cart-btn');

  function countItems(cart) {
    var m = (cart && cart.model) || {};
    var items = m.lineItems || m.lines || [];
    if (items && items.edges) items = items.edges.map(function (e) { return e.node; });
    var n = 0;
    (items || []).forEach(function (i) { n += i.quantity || 0; });
    return n;
  }
  function updateBadge(cart) {
    if (!badge) return;
    var n = countItems(cart);
    badge.textContent = n;
    badge.classList.toggle('is-visible', n > 0);
    if (cartBtn) cartBtn.setAttribute('aria-label', n > 0 ? 'Panier, ' + n + ' article' + (n > 1 ? 's' : '') : 'Panier, vide');
  }

  function loadSdk() {
    return new Promise(function (resolve, reject) {
      if (window.ShopifyBuy && window.ShopifyBuy.UI) return resolve();
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      s.onload = function () { resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function getCart() {
    if (cartPromise) return cartPromise;
    cartPromise = loadSdk().then(function () {
      var client = window.ShopifyBuy.buildClient({ domain: SHOP.domain, storefrontAccessToken: SHOP.storefrontAccessToken });
      clientRef = client;
      return window.ShopifyBuy.UI.onReady(client).then(function (ui) {
        /* createCart renvoie le panier une fois prêt. Un nouveau visiteur n'a pas encore de panier :
           Shopify le crée au premier ajout. */
        return ui.createCart({
          moneyFormat: SHOP.moneyFormat,
          options: {
            cart: {
              popup: false,
              startOpen: false,
              text: {
                title: 'Votre panier',
                total: 'Sous-total',
                empty: 'Votre panier est vide.',
                notice: 'Livraison en France : 5,50 € · Europe : tarif calculé au paiement\nFrais de livraison et codes promo ajoutés à l’étape du paiement.',
                button: 'Commander'
              },
              styles: {
                cart: { 'background-color': '#FBF6EE' },
                header: { 'color': '#5E4033' },
                title: { 'color': '#5E4033', 'font-family': SANS, 'font-weight': '700', 'font-size': '20px' },
                close: { 'color': '#5E4033', ':hover': { 'color': '#5E4033' } },
                footer: { 'background-color': '#FBF6EE' },
                subtotalText: { 'color': '#5E4033', 'font-family': SANS, 'font-size': '15px', 'font-weight': '600' },
                subtotal: { 'color': '#5E4033', 'font-family': SANS, 'font-size': '17px', 'font-weight': '700' },
                notice: { 'color': '#5E4E42', 'font-family': SANS, 'font-size': '13px', 'line-height': '1.5', 'white-space': 'pre-line' },
                currency: { 'color': '#5E4033' },
                emptyCart: { 'color': '#5E4E42', 'font-family': SANS },
                button: {
                  'background-color': '#5E4033', 'border-radius': '999px', 'font-family': SANS,
                  'font-weight': '700', 'letter-spacing': '1.2px', 'font-size': '14px',
                  ':hover': { 'background-color': '#4A3127' }, ':focus': { 'background-color': '#4A3127' }
                }
              },
              googleFonts: ['Source Sans 3'],
              events: { afterRender: updateBadge }
            },
            lineItem: {
              styles: {
                itemTitle: { 'color': '#5E4033', 'font-family': SANS, 'font-size': '15px', 'font-weight': '600' },
                variantTitle: { 'color': '#846055', 'font-family': SANS },
                price: { 'color': '#5E4033', 'font-family': SANS },
                fullPrice: { 'color': '#5E4033' },
                quantity: { 'color': '#5E4033' },
                quantityIncrement: { 'color': '#5E4033', 'border-color': '#C9B9A4' },
                quantityDecrement: { 'color': '#5E4033', 'border-color': '#C9B9A4' },
                quantityInput: { 'color': '#5E4033', 'border-color': '#C9B9A4' }
              }
            },
            toggle: { styles: { toggle: { 'display': 'none' } } }
          }
        }).then(function (c) {
          c = (c && typeof c.addVariantToCart === 'function') ? c : ui.components.cart[0];
          if (!c) throw new Error('panier indisponible');
          updateBadge(c);
          return c;
        });
      });
    });
    cartPromise.catch(function () { cartPromise = null; });
    return cartPromise;
  }

  function openCart() {
    getCart().then(function (cart) { cart.open(); }).catch(showError);
  }
  /* En cas de souci réseau : message, sans quitter le site */
  function showError() {
    if (!toast) return;
    toast.querySelector('strong').textContent = 'Le panier ne répond pas';
    toast.querySelector('small').textContent = 'Merci de réessayer dans un instant.';
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); toast.querySelector('strong').textContent = 'Ajouté au panier'; }, 4500);
  }
  function addToCart(gid, qty, label, btn) {
    if (btn) btn.disabled = true;
    getCart().then(function (cart) {
      return cart.addVariantToCart({ id: gid }, qty, false);
    }).then(function () {
      return getCart();
    }).then(function (cart) {
      updateBadge(cart);
      showToast(label + (qty > 1 ? ' × ' + qty : ''));
    }).catch(function (e) {
      if (window.console) console.error('Panier Shopify :', e);
      showError();
    }).then(function () {
      if (btn) btn.disabled = false;
    });
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);

  /* Boutons directs : « Ajouter 100 g · 14,00 € » */
  document.querySelectorAll('[data-variant]').forEach(function (btn) {
    if (btn.tagName !== 'BUTTON') return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      addToCart(btn.getAttribute('data-variant'), 1, btn.getAttribute('data-label'), btn);
    });
  });

  /* Fiche produit : format + quantité */
  document.querySelectorAll('[data-buy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var scope = btn.closest('.product__info') || document;
      var chosen = scope.querySelector('input[name="format"]:checked') || scope.querySelector('[data-format-default]');
      var qtyInput = scope.querySelector('.qty input');
      var qty = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);
      addToCart(chosen.getAttribute('data-gid'), qty, chosen.getAttribute('data-label'), btn);
    });
  });

  /* Barre « Ajouter au panier » en bas de l'écran (téléphone) : visible quand le bouton principal n'est pas à l'écran */
  var bar = document.querySelector('.buybar');
  var buyRow = document.querySelector('.product .buy');
  if (bar && buyRow && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('buybar-on', !entries[0].isIntersecting);
    }).observe(buyRow);
    var lbl = bar.querySelector('[data-buybar-label]');
    document.querySelectorAll('input[name="format"]').forEach(function (r) {
      r.addEventListener('change', function () { if (lbl && r.checked) lbl.textContent = r.getAttribute('data-price'); });
    });
  }

  /* Charge le panier en arrière-plan pour afficher le nombre d'articles */
  function warm() { getCart().catch(function () {}); }
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 2500 });
  else setTimeout(warm, 1200);

  /* ---------- Lettre de Jo : textes en français + masque « Powered by EmailOctopus » ---------- */
  var lettre = document.querySelector('.lettre');
  function tuneNewsletter() {
    if (!lettre) return false;
    lettre.querySelectorAll('a').forEach(function (a) {
      var t = (a.textContent || '').toLowerCase();
      var h = (a.getAttribute('href') || '').toLowerCase();
      if (t.indexOf('powered') > -1 || h.indexOf('emailoctopus.com') > -1) a.style.display = 'none';
    });
    var input = lettre.querySelector('input[type="email"]');
    var submit = lettre.querySelector('input[type="submit"], button[type="submit"]');
    if (input) { input.placeholder = 'Votre adresse email'; input.setAttribute('aria-label', 'Votre adresse email'); }
    if (submit) { if (submit.tagName === 'INPUT') submit.value = "S'inscrire"; else submit.textContent = "S'inscrire"; }
    return !!(input && submit);
  }
  if (lettre) {
    var tries = 0;
    (function poll() { if (!tuneNewsletter() && ++tries < 40) setTimeout(poll, 250); })();
    setTimeout(tuneNewsletter, 5000);
  }
})();
