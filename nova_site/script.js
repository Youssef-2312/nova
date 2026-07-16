// ============================================
// NOVA — shared interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  /* --- Navbar scroll state --- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Mobile menu --- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-close');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.add('open'));
    close?.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  /* --- Reveal on scroll --- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* --- Accordion (FAQ) --- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion')?.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
          openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* --- Portfolio filter (tabs) + search --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.querySelector('.project-search');
  const emptyState = document.querySelector('.projects-empty');

  const applyFilters = () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filter = activeBtn ? activeBtn.dataset.filter : 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(card => {
      const matchesFilter = filter === 'all' || card.dataset.industry === filter;
      const matchesSearch = !query || card.dataset.title.toLowerCase().includes(query) ||
        (card.dataset.tech || '').toLowerCase().includes(query);
      const show = matchesFilter && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  };

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        applyFilters();
      });
    });
  }
  searchInput?.addEventListener('input', applyFilters);

  /* --- Project detail modal --- */
  const modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    const modalThumb = modalOverlay.querySelector('.modal-thumb');
    const modalIndustry = modalOverlay.querySelector('.modal-industry');
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalDesc = modalOverlay.querySelector('.modal-desc');
    const modalTech = modalOverlay.querySelector('.modal-tech');
    const modalClose = modalOverlay.querySelector('.modal-close');
    let lastFocused = null;

    const openModal = (card) => {
      lastFocused = document.activeElement;
      if (modalThumb) modalThumb.style.background = card.dataset.color || 'var(--navy-500)';
      if (modalIndustry) modalIndustry.textContent = card.dataset.industryLabel || '';
      if (modalTitle) modalTitle.textContent = card.dataset.title || '';
      if (modalDesc) modalDesc.textContent = card.dataset.desc || '';
      if (modalTech) {
        modalTech.innerHTML = '';
        (card.dataset.tech || '').split(',').filter(Boolean).forEach(t => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = t.trim();
          modalTech.appendChild(span);
        });
      }
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalClose?.focus();
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      lastFocused?.focus();
    };

    document.querySelectorAll('.project-card .project-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.project-card');
        if (card) openModal(card);
      });
    });

    modalClose?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  /* --- Contact form --- */
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.toast');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
    form.reset();
  });

  /* --- Hero mockup parallax (subtle, mouse-driven) --- */
  const heroStack = document.querySelector('.hero-stack');
  if (heroStack && window.matchMedia('(pointer:fine)').matches) {
    heroStack.addEventListener('mousemove', (e) => {
      const rect = heroStack.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroStack.querySelectorAll('.mockup-card').forEach((card, i) => {
        const depth = (i + 1) * 6;
        card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0) rotate(${card.dataset.rot || 0}deg)`;
      });
    });
  }
});
