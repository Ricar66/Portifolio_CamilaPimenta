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
  // PRELOADER
  // ================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    };

    // Hide after load + minimum 1.2s display
    const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
    const pageLoad = new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve);
    });

    Promise.all([minDelay, pageLoad]).then(hidePreloader);
  }

  // ================================================
  // COUNTER ANIMATION
  // ================================================
  const counterNumbers = document.querySelectorAll('.counter-number');

  if (counterNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterNumbers.forEach(el => counterObserver.observe(el));
  }

  // ================================================
  // 3D TILT EFFECT ON AREA CARDS
  // ================================================
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 768) {
    const areaCards = document.querySelectorAll('.area-card');

    areaCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ================================================
  // SCROLL PROGRESS BAR
  // ================================================
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  // ================================================
  // TYPING TEXT EFFECT
  // ================================================
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = [
      'Ansiedade',
      'Depressao',
      'Autoestima',
      'Estresse e Burnout',
      'Relacionamentos',
      'Autoconhecimento'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 300; // Pause before next word
      }

      setTimeout(typeEffect, typingSpeed);
    }

    // Start after a delay to let the page load
    setTimeout(typeEffect, 2000);
  }

  // ================================================
  // MAGNETIC BUTTON EFFECT
  // ================================================
  if (window.innerWidth >= 768) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s ease-out';
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }

  // ================================================
  // CUSTOM CURSOR EFFECT (Desktop only)
  // ================================================
  if (window.innerWidth >= 1024 && !window.matchMedia('(hover: none)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursorDot && cursorRing) {
      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      });

      // Smooth ring follow
      function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      }
      animateRing();

      // Hover effect on interactive elements
      const hoverTargets = document.querySelectorAll('a, button, .area-card, .blog-card, .testimonial-card, .identification-card, .counter-card, .instagram-card, .transformation-card, .booking-step-card, .contact-detail-card');
      hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          cursorDot.classList.add('cursor-hover');
          cursorRing.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
          cursorDot.classList.remove('cursor-hover');
          cursorRing.classList.remove('cursor-hover');
        });
      });

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '0.5';
      });

      // Override default cursor on body
      document.body.style.cursor = 'none';
      hoverTargets.forEach(t => t.style.cursor = 'none');
    }
  }

  // ================================================
  // LGPD COOKIE CONSENT BANNER
  // ================================================
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookie-consent');

    if (!cookieConsent) {
      // Show banner after 2 seconds
      setTimeout(() => {
        cookieBanner.classList.add('cookie-visible');
      }, 2000);
    }

    const hideBanner = (choice) => {
      localStorage.setItem('cookie-consent', choice);
      cookieBanner.classList.remove('cookie-visible');
    };

    if (cookieAccept) cookieAccept.addEventListener('click', () => hideBanner('accepted'));
    if (cookieDecline) cookieDecline.addEventListener('click', () => hideBanner('declined'));
  }

  // ================================================
  // SECTION HEADER REVEAL (Scale + Fade on scroll)
  // ================================================
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const sectionHeaders = document.querySelectorAll('section h2');

    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('header-revealed');
          headerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    sectionHeaders.forEach(el => {
      el.classList.add('header-animate');
      headerObserver.observe(el);
    });
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
