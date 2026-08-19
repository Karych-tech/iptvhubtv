// Main behavior for the streaming storefront: navigation, sliders, FAQ, counters, and newsletter feedback.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const faqItems = document.querySelectorAll('.faq-item');
  const counters = document.querySelectorAll('.stat-number');
  const newsletterForm = document.querySelector('.newsletter-form');
  const statusMessage = document.querySelector('.status-message');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      menuButton.classList.toggle('active');
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking outside of it on mobile
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuButton.contains(event.target) && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        menuButton.classList.remove('active');
      }
    });

    // Close menu on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (navLinks.classList.contains('show')) {
        if (window.scrollY > lastScrollY) { // Scrolling down
          navLinks.classList.remove('show');
          menuButton.classList.remove('active');
        }
      }
      lastScrollY = window.scrollY;
    });
  }

  faqItems.forEach((item) => {
    item.querySelector('header').addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });

  const initSliders = () => {
    document.querySelectorAll('.swiper-shell').forEach((shell, index) => {
      const swiperElement = shell.querySelector('.swiper');
      if (!swiperElement || typeof window.Swiper === 'undefined') {
        return;
      }

      const isReversed = index % 2 === 0;

      new window.Swiper(swiperElement, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 18,
        speed: 800,
        grabCursor: true,
        watchOverflow: true,
        autoplay: {
          delay: 3200,
          reverseDirection: isReversed
        },
        navigation: {
          nextEl: shell.querySelector('.slider-btn.next'),
          prevEl: shell.querySelector('.slider-btn.prev')
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 18
          },
          980: {
            slidesPerView: 3,
            spaceBetween: 22
          }
        }
      });
    });

    document.querySelectorAll('.live-tv-swiper').forEach((swiperElement) => {
      if (!swiperElement || typeof window.Swiper === 'undefined') {
        return;
      }

      new window.Swiper(swiperElement, {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 14,
        speed: 6000,
        grabCursor: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false
        },
        freeMode: true,
        allowTouchMove: true,
        watchOverflow: true,
        mousewheel: false,
        breakpoints: {
          320: {
            slidesPerView: 4,
            spaceBetween: 12
          },
          480: {
            slidesPerView: 5,
            spaceBetween: 12
          },
          768: {
            slidesPerView: 6,
            spaceBetween: 14
          },
          1024: {
            slidesPerView: 8,
            spaceBetween: 16
          },
          1400: {
            slidesPerView: 10,
            spaceBetween: 18
          }
        }
      });
    });
  };

  initSliders();

  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target || counter.textContent.replace(/\D/g, ''));
      const duration = 1400;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = target >= 1000 ? `${value.toLocaleString()}+` : `${value}+`;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = `${target.toLocaleString()}+`;
        }
      };
      requestAnimationFrame(update);
    });
  };

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const email = input?.value.trim();
    if (!email) {
      if (statusMessage) {
        statusMessage.textContent = 'Please add an email address to join the list.';
      }
      return;
    }

    if (statusMessage) {
      statusMessage.textContent = `Thanks, ${email}! We will send your first watchlist soon.`;
    }
    newsletterForm.reset();
  });
});
