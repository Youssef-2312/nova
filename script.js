// ============================================
// NOVA — shared interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  /* --- Navbar scroll state + back-to-top --- */
  const navbar = document.querySelector('.navbar');

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 12V2M7 2L2 7M7 2L12 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backToTop);

  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 12);
    backToTop.classList.toggle('visible', window.scrollY > window.innerHeight);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Mobile menu --- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-close');
  if (toggle && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) close?.focus();
      else toggle.focus();
    };
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => setMenu(true));
    close?.addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
  }

  /* --- Data-driven project rendering ---
     Reads NOVA_PROJECTS (projects.js, newest first) and renders:
     [data-projects-grid]    → all projects (portfolio page)
     [data-project-filters]  → filter buttons built from the data
     [data-projects-preview] → newest 3 (homepage Selected Work)
     [data-projects-collage] → newest 3 (about page collage)
     Runs before the reveal/filter/modal bindings below so the
     generated elements get picked up by them. */
  const projects = window.NOVA_PROJECTS || [];
  const arrowSvg = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.4"/></svg>';
  const linkAttrs = (p) => p.external ? ' target="_blank" rel="noopener"' : '';

  const grid = document.querySelector('[data-projects-grid]');
  if (grid && projects.length) {
    grid.innerHTML = projects.map(p => `
      <div class="project-card reveal" data-industry="${p.industry}" data-title="${p.title}" data-industry-label="${p.industryLabel}" data-tech="${p.tech.join(', ')}" data-url="${p.url}" data-img="${p.img}" data-color="${p.color}" data-desc="${p.desc}">
        <div class="project-thumb" style="background:${p.color};"><img src="${p.img}" alt="${p.title} website screenshot" loading="lazy" width="1280" height="960"></div>
        <div class="project-body">
          <div class="project-top">
            <div><h3>${p.title}</h3><span class="project-industry">${p.industryLabel}</span></div>
          </div>
          <p style="margin:14px 0 0;">${p.blurb}</p>
          <div class="tech-row">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <a href="${p.url || '#'}" class="project-link"${linkAttrs(p)}>View Project ${arrowSvg}</a>
        </div>
      </div>`).join('');
  }

  const filtersWrap = document.querySelector('[data-project-filters]');
  if (filtersWrap && projects.length) {
    const industries = [...new Map(projects.map(p => [p.industry, p.industryLabel])).entries()];
    filtersWrap.innerHTML =
      '<button class="filter-btn active" data-filter="all" aria-pressed="true">All</button>' +
      industries.map(([key, label]) => `<button class="filter-btn" data-filter="${key}" aria-pressed="false">${label}</button>`).join('');
  }

  const preview = document.querySelector('[data-projects-preview]');
  if (preview && projects.length) {
    preview.innerHTML = projects.slice(0, 3).map(p => `
      <div class="pf-card reveal">
        <div class="pf-thumb" style="background:${p.color};"><img src="${p.img}" alt="${p.title} website screenshot" loading="lazy" width="1280" height="960"></div>
        <div class="pf-body">
          <span class="tag">${p.industryLabel}</span>
          <h4>${p.title}</h4>
          <p style="margin:0;">${p.blurb}</p>
          <a href="${p.url || 'portfolio.html'}"${linkAttrs(p)} class="pf-link">View Project →</a>
        </div>
      </div>`).join('');
  }

  const collage = document.querySelector('[data-projects-collage]');
  if (collage && projects.length) {
    collage.innerHTML = projects.slice(0, 3).map((p, i) => `
      <div class="shot shot-${i + 1}"><img src="${p.img}" alt="${p.title} — built by Nova" loading="lazy" width="1280" height="960"></div>`).join('') +
      '<span class="caption">Recent work</span>';
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
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion')?.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
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
    const modalVisit = modalOverlay.querySelector('.modal-visit');
    let lastFocused = null;

    const openModal = (card) => {
      lastFocused = document.activeElement;
      if (modalThumb) {
        modalThumb.style.background = card.dataset.color || 'var(--navy-500)';
        if (card.dataset.img) {
          modalThumb.style.backgroundImage = `url("${card.dataset.img}")`;
          modalThumb.style.backgroundSize = 'cover';
          modalThumb.style.backgroundPosition = 'top center';
        }
      }
      if (modalIndustry) modalIndustry.textContent = card.dataset.industryLabel || '';
      if (modalTitle) modalTitle.textContent = card.dataset.title || '';
      if (modalDesc) modalDesc.textContent = card.dataset.desc || '';
      if (modalVisit) {
        if (card.dataset.url) {
          modalVisit.href = card.dataset.url;
          modalVisit.style.display = '';
        } else {
          modalVisit.style.display = 'none';
        }
      }
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
