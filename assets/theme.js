/* =============================================
   VARAHA JEWELS — Shopify Theme JavaScript
   Premium Heritage Jewelry — Core Interactions
   ============================================= */

(function() {
  'use strict';

  /* -----------------------------------------
     Scroll Animations (IntersectionObserver)
     ----------------------------------------- */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.scroll-animate');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => observer.observe(el));
  }

  /* -----------------------------------------
     Hero Slideshow
     ----------------------------------------- */
  function initHeroSlideshow() {
    const slideshow = document.querySelector('[data-hero-slideshow]');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('[data-slide]');
    const dots = slideshow.querySelectorAll('[data-dot]');
    const prevBtn = slideshow.querySelector('[data-prev]');
    const nextBtn = slideshow.querySelector('[data-next]');
    let current = 0;
    let autoPlayTimer = null;
    const autoPlayDelay = 4000;

    function showSlide(index) {
      slides.forEach((s, i) => {
        s.style.opacity = i === index ? '1' : '0';
        s.setAttribute('aria-hidden', i !== index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      current = index;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function pauseAndResume() {
      stopAutoPlay();
      setTimeout(startAutoPlay, 10000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); pauseAndResume(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); pauseAndResume(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { showSlide(i); pauseAndResume(); });
    });

    showSlide(0);
    startAutoPlay();
  }

  /* -----------------------------------------
     Mobile Menu
     ----------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    const backdrop = document.querySelector('[data-mobile-backdrop]');
    const closeBtn = document.querySelector('[data-mobile-menu-close]');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Close on link clicks
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Mobile accordion menus
    menu.querySelectorAll('[data-accordion-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('aria-controls'));
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        
        // Close all others
        menu.querySelectorAll('[data-accordion-toggle]').forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const otherTarget = document.getElementById(other.getAttribute('aria-controls'));
            if (otherTarget) otherTarget.style.maxHeight = '0';
          }
        });

        btn.setAttribute('aria-expanded', !isOpen);
        if (target) {
          target.style.maxHeight = isOpen ? '0' : target.scrollHeight + 'px';
        }
      });
    });
  }

  /* -----------------------------------------
     Announcement Bar Rotation
     ----------------------------------------- */
  function initAnnouncementBar() {
    const bar = document.querySelector('[data-announcement-bar]');
    if (!bar) return;

    const items = bar.querySelectorAll('[data-announcement-item]');
    const dismissBtn = bar.querySelector('[data-announcement-dismiss]');
    const prevBtn = bar.querySelector('[data-announcement-prev]');
    const nextBtn = bar.querySelector('[data-announcement-next]');

    if (items.length <= 0) return;

    // Check if dismissed
    if (localStorage.getItem('announcementBarDismissed') === 'true') {
      bar.style.display = 'none';
      return;
    }

    let current = 0;
    let timer = null;

    function showItem(index) {
      items.forEach((item, i) => {
        item.style.opacity = i === index ? '1' : '0';
        item.style.position = i === index ? 'relative' : 'absolute';
      });
      current = index;
    }

    function nextItem() {
      const next = (current + 1) % items.length;
      items[current].style.opacity = '0';
      setTimeout(() => {
        showItem(next);
      }, 400);
    }

    function prevItem() {
      const prev = (current - 1 + items.length) % items.length;
      items[current].style.opacity = '0';
      setTimeout(() => {
        showItem(prev);
      }, 400);
    }

    function startRotation() {
      if (items.length <= 1) return;
      timer = setInterval(nextItem, 4000);
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        bar.style.display = 'none';
        localStorage.setItem('announcementBarDismissed', 'true');
        if (timer) clearInterval(timer);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (timer) clearInterval(timer); prevItem(); startRotation(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (timer) clearInterval(timer); nextItem(); startRotation(); });

    showItem(0);
    startRotation();
  }

  /* -----------------------------------------
     Back to Top
     ----------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------
     Sticky Header (Desktop)
     ----------------------------------------- */
  function initStickyHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.innerWidth >= 1024) {
        header.classList.toggle('is-sticky', window.scrollY > 100);
      }
    }, { passive: true });
  }

  /* -----------------------------------------
     Metal Rates Simulation (Footer)
     ----------------------------------------- */
  function initMetalRates() {
    const goldEl = document.querySelector('[data-gold-rate]');
    const silverEl = document.querySelector('[data-silver-rate]');
    const goldChangeEl = document.querySelector('[data-gold-change]');
    const silverChangeEl = document.querySelector('[data-silver-change]');

    if (!goldEl || !silverEl) return;

    const baseGold = parseInt(goldEl.getAttribute('data-base') || '124040');
    const baseSilver = parseInt(silverEl.getAttribute('data-base') || '208900');

    function updateRates() {
      const goldChange = (Math.random() - 0.5) * 1.6;
      const silverChange = (Math.random() - 0.5) * 1.2;

      const goldPrice = Math.round(baseGold + (baseGold * goldChange / 100));
      const silverPrice = Math.round(baseSilver + (baseSilver * silverChange / 100));

      goldEl.textContent = '₹' + goldPrice.toLocaleString('en-IN');
      silverEl.textContent = '₹' + silverPrice.toLocaleString('en-IN');

      if (goldChangeEl) {
        const changeText = (goldChange >= 0 ? '+' : '') + goldChange.toFixed(1) + '%';
        goldChangeEl.textContent = changeText;
        goldChangeEl.className = 'rate-change ' + (goldChange >= 0 ? 'rate-up' : 'rate-down');
      }
      if (silverChangeEl) {
        const changeText = (silverChange >= 0 ? '+' : '') + silverChange.toFixed(1) + '%';
        silverChangeEl.textContent = changeText;
        silverChangeEl.className = 'rate-change ' + (silverChange >= 0 ? 'rate-up' : 'rate-down');
      }
    }

    updateRates();
    setInterval(updateRates, 30000);
  }

  /* -----------------------------------------
     Product Spotlight Thumbnails
     ----------------------------------------- */
  function initProductSpotlight() {
    const section = document.querySelector('[data-product-spotlight]');
    if (!section) return;

    const mainImage = section.querySelector('[data-spotlight-image]');
    const mainName = section.querySelector('[data-spotlight-name]');
    const mainDesc = section.querySelector('[data-spotlight-desc]');
    const mainPrice = section.querySelector('[data-spotlight-price]');
    const mainLink = section.querySelector('[data-spotlight-link]');
    const mainTag = section.querySelector('[data-spotlight-tag]');
    const thumbnails = section.querySelectorAll('[data-spotlight-thumb]');

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        if (mainImage) mainImage.src = thumb.getAttribute('data-image');
        if (mainImage) mainImage.alt = thumb.getAttribute('data-name');
        if (mainName) mainName.textContent = thumb.getAttribute('data-name');
        if (mainDesc) mainDesc.textContent = thumb.getAttribute('data-desc') || 'Experience the timeless elegance of our handcrafted masterpiece.';
        if (mainPrice) mainPrice.textContent = thumb.getAttribute('data-price') || 'Price on Request';
        if (mainLink) mainLink.href = thumb.getAttribute('data-url') || '/collections/all';
        if (mainTag) mainTag.textContent = thumb.getAttribute('data-tag') || '';
      });
    });
  }

  /* -----------------------------------------
     Creator Video Cards
     ----------------------------------------- */
  function initCreatorVideos() {
    const cards = document.querySelectorAll('[data-creator-video]');
    cards.forEach(card => {
      const video = card.querySelector('video');
      const playBtn = card.querySelector('[data-play-btn]');
      
      if (!video) return;

      card.addEventListener('click', async () => {
        // Pause all other videos
        document.querySelectorAll('[data-creator-video] video').forEach(v => {
          if (v !== video && !v.paused) v.pause();
        });

        try {
          if (video.paused) {
            video.muted = false;
            await video.play();
            if (playBtn) playBtn.style.display = 'none';
          } else {
            video.pause();
            if (playBtn) playBtn.style.display = 'flex';
          }
        } catch(e) {
          console.error('Playback error:', e);
        }
      });

      video.addEventListener('pause', () => { if (playBtn) playBtn.style.display = 'flex'; });
      video.addEventListener('playing', () => { if (playBtn) playBtn.style.display = 'none'; });
    });

    // Mobile carousel swipe
    const carousel = document.querySelector('[data-creator-carousel]');
    if (!carousel) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let currentSlide = 0;
    const track = carousel.querySelector('[data-creator-track]');
    const totalSlides = carousel.querySelectorAll('[data-creator-slide]').length;
    const dots = carousel.querySelectorAll('[data-creator-dot]');

    function goToSlide(index) {
      currentSlide = index;
      if (track) track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchmove', e => { touchEndX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', () => {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
        else if (diff < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
      }
    });

    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  }

  /* -----------------------------------------
     Cart Drawer (Ajax Cart)
     ----------------------------------------- */
  function initCartDrawer() {
    const cartToggle = document.querySelector('[data-cart-toggle]');
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const cartClose = document.querySelector('[data-cart-close]');
    const cartBackdrop = document.querySelector('[data-cart-backdrop]');

    if (!cartToggle || !cartDrawer) return;

    function openCart() {
      cartDrawer.classList.add('is-open');
      if (cartBackdrop) cartBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      cartDrawer.classList.remove('is-open');
      if (cartBackdrop) cartBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    cartToggle.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  }

  /* -----------------------------------------
     Search Toggle
     ----------------------------------------- */
  function initSearch() {
    const searchToggle = document.querySelector('[data-search-toggle]');
    const searchBar = document.querySelector('[data-search-bar]');
    const searchClose = document.querySelector('[data-search-close]');
    const searchInput = document.querySelector('[data-search-input]');

    if (!searchToggle || !searchBar) return;

    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('is-open');
      if (searchBar.classList.contains('is-open') && searchInput) {
        searchInput.focus();
      }
    });

    if (searchClose) searchClose.addEventListener('click', () => searchBar.classList.remove('is-open'));
    if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') searchBar.classList.remove('is-open'); });
  }

  /* -----------------------------------------
     Initialize Everything on DOM Ready
     ----------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeroSlideshow();
    initMobileMenu();
    initAnnouncementBar();
    initBackToTop();
    initStickyHeader();
    initMetalRates();
    initProductSpotlight();
    initCreatorVideos();
    initCartDrawer();
    initSearch();
  });

})();
