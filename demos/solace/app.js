// Solace Clinics — demo site interactions
document.addEventListener('DOMContentLoaded', () => {
  /* Nav scroll state */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-close');
  if (menuBtn && mobileNav) {
    const setMenu = (open) => {
      mobileNav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (open) closeBtn?.focus();
      else menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(true));
    closeBtn?.addEventListener('click', () => setMenu(false));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) setMenu(false);
    });
  }

  /* Reveal on scroll */
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

  /* Booking form (demo submit) */
  const form = document.querySelector('.booking-form');
  const toast = document.querySelector('.toast');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
    form.reset();
  });
});
