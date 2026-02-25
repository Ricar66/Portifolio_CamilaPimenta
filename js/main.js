/* ================================================
   CAMILA VIARO - PSICOLOGIA CLINICA
   Main JavaScript - Interactions & Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Initialize AOS ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  // ---- Navbar scroll behavior ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    if (scrollY > 300 && scrollY > lastScrollY) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ---- Mobile menu toggle ----
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerLines = menuToggle.querySelector('.hamburger-lines');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('translate-x-0');

    if (isOpen) {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('-translate-x-full');
      hamburgerLines.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.remove('-translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      hamburgerLines.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  menuToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('-translate-x-full');
      hamburgerLines.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-content');
        otherContent.style.maxHeight = null;
        otherItem.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Back to top button ----
  const backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
      backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
      backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
      backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Parallax effect ----
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  function handleParallax() {
    const scrollY = window.scrollY;

    parallaxBgs.forEach(bg => {
      const section = bg.parentElement;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY < sectionTop + sectionHeight) {
        const offset = (scrollY - sectionTop) * 0.3;
        bg.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });

  // ---- WhatsApp button entrance + speech bubble timer ----
  const whatsappFloat = document.getElementById('whatsapp-float');
  const whatsappBubble = document.getElementById('whatsapp-bubble');

  whatsappFloat.style.opacity = '0';
  whatsappFloat.style.transform = 'scale(0)';
  whatsappFloat.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

  // Button entrance after 2s
  setTimeout(() => {
    whatsappFloat.style.opacity = '1';
    whatsappFloat.style.transform = 'scale(1)';
  }, 2000);

  // Speech bubble appears after 5s
  if (whatsappBubble) {
    setTimeout(() => {
      whatsappBubble.classList.add('visible');
    }, 5000);

    // Hide bubble on click, show again after 30s idle
    whatsappFloat.addEventListener('mouseenter', () => {
      whatsappBubble.classList.remove('visible');
    });

    whatsappFloat.addEventListener('mouseleave', () => {
      setTimeout(() => {
        whatsappBubble.classList.add('visible');
      }, 30000);
    });
  }

  // ================================================
  // TESTIMONIALS CAROUSEL
  // ================================================
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalPages = Math.ceil(slides.length / slidesPerView);
    let autoplayInterval = null;

    function getSlidesPerView() {
      return window.innerWidth >= 768 ? 2 : 1;
    }

    // Create dots
    function createDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 ' +
          (i === 0 ? 'bg-sage-400 w-8' : 'bg-stone-300 hover:bg-sage-300');
        dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.className = 'carousel-dot w-8 h-3 rounded-full transition-all duration-300 bg-sage-400';
        } else {
          dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 bg-stone-300 hover:bg-sage-300';
        }
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = totalPages - 1;
      if (currentIndex >= totalPages) currentIndex = 0;

      const slideWidth = 100 / slidesPerView;
      const offset = currentIndex * slidesPerView * slideWidth;
      track.style.transform = 'translateX(-' + offset + '%)';

      updateDots();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // Button events
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    // Pause on hover
    const carouselSection = document.getElementById('depoimentos');
    carouselSection.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselSection.addEventListener('mouseleave', startAutoplay);

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoplayInterval);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    }, { passive: true });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newPerView = getSlidesPerView();
        if (newPerView !== slidesPerView) {
          slidesPerView = newPerView;
          totalPages = Math.ceil(slides.length / slidesPerView);
          currentIndex = 0;
          createDots();
          goToSlide(0);
        }
      }, 250);
    });

    // Keyboard support for carousel
    document.addEventListener('keydown', (e) => {
      const carousel = document.getElementById('depoimentos');
      if (!carousel) return;
      const rect = carousel.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          resetAutoplay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          resetAutoplay();
        }
      }
    });

    // Initialize
    createDots();
    goToSlide(0);
    startAutoplay();
  }

  // ================================================
  // SCROLL REVEAL — IntersectionObserver fallback
  // ================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (revealElements.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ================================================
  // CINEMA SCROLL — Progressive section reveal
  // ================================================
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const allSections = document.querySelectorAll('section');

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });

    allSections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      sectionObserver.observe(section);
    });

    // Immediately reveal hero (first section)
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      heroSection.style.opacity = '1';
      heroSection.style.transform = 'translateY(0)';
    }
  }

  // ================================================
  // ACCESSIBILITY — Skip to content & focus management
  // ================================================
  // Trap focus in mobile menu when open
  const mobileMenuEl = document.getElementById('mobile-menu');
  if (mobileMenuEl) {
    mobileMenuEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileMenuEl.classList.remove('translate-x-0');
        mobileMenuEl.classList.add('-translate-x-full');
        const hamburger = document.getElementById('menu-toggle');
        hamburger.querySelector('.hamburger-lines').classList.remove('active');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }
});
