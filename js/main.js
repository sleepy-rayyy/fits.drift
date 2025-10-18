
(function() {
  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Add to Cart and product enhancements (only runs on pages with products)
  const productCards = document.querySelectorAll('.card.product');
  if (productCards.length) {
    // Price mapping in PHP (integer amounts)
    const priceMap = new Map([
      ['Champion Hoodie - Black', 2799],
      ['Essentials Hoodie', 2999],
      ['Polo RL Hoodie', 3499],
      ['Carhartt Hoodie - Orange', 3199],
      ['Classic Navy Hoodie', 2499],
      ['Champion Hoodie - Gray', 2799],
      ['Essentials Hoodie - Black', 2999],
      ['Polo RL Hoodie - Navy', 3499],
      ['Carhartt Hoodie - Charcoal', 3199],
      ['Classic Blue Hoodie', 2499],
      ['Minimal Leather Watch', 4999],
      ['Steel Chrono', 6999],
      ['Sport Nylon', 5499],
      ['Steel Diver', 7499],
      ['Classic Dress Watch', 5999],
    ]);

    const formatPHP = (n) => 'PHP ' + Number(n).toLocaleString('en-PH');

    // toast container exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const showToast = (message) => {
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = message;
      toastContainer.appendChild(t);
      // force reflow to allow transition
      void t.offsetWidth;
      t.classList.add('show');
      setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 250);
      }, 2600);
    };

    // Enhance each product card
    productCards.forEach(card => {
      const titleEl = card.querySelector('h3');
      const priceEl = card.querySelector('.price');
      const btn = card.querySelector('.btn.btn-primary');
      if (!titleEl || !priceEl || !btn) return;

      const name = titleEl.textContent.trim();
      const mapped = priceMap.get(name);
      if (mapped) {
        priceEl.textContent = formatPHP(mapped);
      }

      // Inject size selector for hoodies
      if (/hoodie/i.test(name)) {
        if (!card.querySelector('.size-select')) {
          const label = document.createElement('label');
          label.innerHTML = 'Size<br>';
          const select = document.createElement('select');
          select.className = 'size-select';
          ;['S','M','L','XL','XXL'].forEach(s => {
            const opt = document.createElement('option');
            opt.value = s; opt.textContent = s; select.appendChild(opt);
          });
          label.appendChild(select);
          const body = card.querySelector('.card-body');
          if (body) body.insertBefore(label, btn);
        }
      }

      // Tag button as add-to-cart
      btn.classList.add('add-to-cart');
      btn.setAttribute('data-name', name);
      if (mapped) btn.setAttribute('data-price', String(mapped));
    });

    // Delegate Add to Cart click handling
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.add-to-cart')) {
        const btn = target.closest('.add-to-cart');
        const card = btn.closest('.card.product');
        const name = btn.getAttribute('data-name') || 'Product';
        const price = Number(btn.getAttribute('data-price') || 0);
        let details = '';
        const sizeSel = card ? card.querySelector('.size-select') : null;
        if (sizeSel) {
          details = ` (Size ${sizeSel.value})`;
        }
        const message = `Added: ${name}${details} • ${formatPHP(price)}`;
        showToast(message);
      }
    });
  }
})();
