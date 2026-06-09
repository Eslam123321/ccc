/* ==========================================================================
   New Power Global - Corporate Premium Main Logic (Vanilla JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Language Translation Configuration
  let currentLang = localStorage.getItem('npg_lang') || 'ar';
  
  function applyLanguage(lang) {
    if (!window.translations) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Transition fade animation on language switch
    document.body.classList.add('translation-fade');
    setTimeout(() => {
      document.body.classList.remove('translation-fade');
    }, 450);

    // Query and update all localized elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (window.translations[lang] && window.translations[lang][key]) {
        const transVal = window.translations[lang][key];
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = transVal;
        } else if (el.tagName === 'SELECT') {
          // Update placeholder/disabled option
          const defaultOpt = el.querySelector('option[value=""]');
          if (defaultOpt) defaultOpt.textContent = transVal;
        } else {
          el.innerHTML = transVal;
        }
      }
    });

    // Update Browser Document Title depending on active page
    updatePageTitle(lang);

    // Cache the selected language
    localStorage.setItem('npg_lang', lang);
    currentLang = lang;

    // Toggle button text representation
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = lang === 'ar' ? 'English' : 'العربية';
    }
  }

  function updatePageTitle(lang) {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    let titleText = '';

    if (path.includes('index.html') || path === '') {
      titleText = lang === 'ar' 
        ? 'نيو باور جلوبال | حلول الطاقة والمناولة الصناعية المتكاملة' 
        : 'New Power Global | Smart Energy & Industrial Handling Solutions';
    } else if (path.includes('about.html')) {
      titleText = lang === 'ar' 
        ? 'من نحن | نيو باور جلوبال' 
        : 'About Us | New Power Global';
    } else if (path.includes('products.html')) {
      titleText = lang === 'ar' 
        ? 'معرض المنتجات والحلول | نيو باور جلوبال' 
        : 'Product Catalog & Solutions | New Power Global';
    } else if (path.includes('rentals.html')) {
      titleText = lang === 'ar' 
        ? 'خدمات التأجير المرنة | نيو باور جلوبال' 
        : 'Forklift Rentals | New Power Global';
    } else if (path.includes('maintenance.html')) {
      titleText = lang === 'ar' 
        ? 'الصيانة والدعم الفني | نيو باور جلوبال' 
        : 'Maintenance & Support | New Power Global';
    } else if (path.includes('contact.html')) {
      titleText = lang === 'ar' 
        ? 'اتصل بنا وتواصل معنا | نيو باور جلوبال' 
        : 'Connect With Us | New Power Global';
    }
    document.title = titleText;
  }

  // Setup Lang Toggle Click Event
  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'ar' ? 'en' : 'ar';
      applyLanguage(nextLang);
    });
  }

  // Initialize translations on page load
  applyLanguage(currentLang);


  // 2. Active Page Link Highlighting in Header Navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === '') || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  // 3. Mobile Hamburger Menu Drawer
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu drawer when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.open = false;
        navMenu.classList.remove('open');
      });
    });
  }


  // 4. Sticky Glassmorphic Navbar Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // 5. Scroll-Driven Entrance Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve to trigger animation once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-animate').forEach(element => {
    animationObserver.observe(element);
  });


  // 6. Dynamic Stats Counter (Odometer) Animation
  function initStatsOdometer() {
    const statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    const counters = document.querySelectorAll('.stat-number');

    const runCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        let count = 0;
        
        // Dynamic duration: higher targets count up with larger increments
        const step = Math.ceil(target / 50) || 1;
        const speed = 25; // millisecond delay

        const updateVal = () => {
          count += step;
          if (count >= target) {
            counter.textContent = target;
          } else {
            counter.textContent = count;
            setTimeout(updateVal, speed);
          }
        };

        updateVal();
      });
    };

    // Trigger odometer when scrolled into viewport
    const odometerObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    odometerObserver.observe(statsSection);
  }
  
  initStatsOdometer();


  // 7. Hero Background Slideshow Controller
  function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideDuration = 6000; // Rotates backgrounds every 6 seconds

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, slideDuration);
  }

  initHeroSlideshow();


  // 8. Dynamic Product Catalog Filters (in products.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    
    // Check for parameter redirects (e.g. index.html clicking a core service link)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      const activeBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
      if (activeBtn) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        filterProducts(categoryParam);
      }
    } else {
      // Run default 'all' filter on page load to initialize layout and show all products
      filterProducts('all');
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        filterProducts(filterVal);
      });
    });
  }

  function filterProducts(category) {
    // Filter category sections if they exist
    const categorySections = document.querySelectorAll('.category-section');
    if (categorySections.length > 0) {
      categorySections.forEach(section => {
        const secCategory = section.getAttribute('data-category');
        if (category === 'all' || secCategory === category) {
          section.classList.remove('hidden');
          setTimeout(() => {
            section.classList.add('visible');
          }, 50);
        } else {
          section.classList.add('hidden');
          section.classList.remove('visible');
        }
      });
    }

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
        // Smoothly fade-in filtered cards
        setTimeout(() => {
          card.classList.add('visible');
        }, 50);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  }


  // 9. Request Quote Modal Handlers (in products.html)
  const quoteModal = document.getElementById('quote-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const selectedProductLabel = document.getElementById('modal-selected-product');
  const hiddenProductInput = document.getElementById('form-product-name');
  const quoteRequestForm = document.getElementById('quote-request-form');
  const modalAlertBox = document.getElementById('modal-alert-box');

  if (quoteModal && quoteRequestForm) {
    document.querySelectorAll('.open-quote-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const productKey = btn.getAttribute('data-product');
        const translatedProductName = (window.translations[currentLang] && window.translations[currentLang][productKey]) 
          ? window.translations[currentLang][productKey] 
          : btn.innerText;

        selectedProductLabel.textContent = translatedProductName;
        hiddenProductInput.value = translatedProductName;
        
        // Reset and clear modal state
        modalAlertBox.style.display = 'none';
        modalAlertBox.className = 'form-alert';
        quoteRequestForm.reset();

        quoteModal.classList.add('open');
      });
    });

    closeModalBtn.addEventListener('click', () => {
      quoteModal.classList.remove('open');
    });

    // Close modal if clicked backdrop area
    window.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('open');
      }
    });

    // Quotation submission redirect to WhatsApp
    quoteRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const productName = document.getElementById('form-product-name').value;
      const clientName = document.getElementById('modal-name').value;
      const clientPhone = document.getElementById('modal-phone').value;
      const clientMessage = document.getElementById('modal-message').value;
      
      const messageText = `السلام عليكم، أود طلب عرض سعر ومواصفات:\n- المنتج: ${productName}\n- الاسم: ${clientName}\n- الهاتف: ${clientPhone}\n- التفاصيل: ${clientMessage}`;
      
      const encodedText = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/201061076998?text=${encodedText}`;
      
      modalAlertBox.style.display = 'block';
      modalAlertBox.className = 'form-alert success';
      modalAlertBox.textContent = currentLang === 'ar' ? "جاري تحويلك إلى واتساب لإرسال الطلب..." : "Redirecting to WhatsApp to send your request...";

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        quoteModal.classList.remove('open');
        quoteRequestForm.reset();
      }, 1500);
    });
  }

  // 9b. Request Rental Modal Handlers (in rentals.html)
  const rentalModal = document.getElementById('rental-modal');
  const closeRentalModalBtn = document.getElementById('rental-modal-close-btn');
  const rentalRequestForm = document.getElementById('rental-request-form');
  const rentalAlertBox = document.getElementById('rental-modal-alert-box');

  if (rentalModal && rentalRequestForm) {
    document.querySelectorAll('.open-rental-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset and clear modal state
        rentalAlertBox.style.display = 'none';
        rentalAlertBox.className = 'form-alert';
        rentalRequestForm.reset();

        rentalModal.classList.add('open');
      });
    });

    closeRentalModalBtn.addEventListener('click', () => {
      rentalModal.classList.remove('open');
    });

    // Close modal if clicked backdrop area
    window.addEventListener('click', (e) => {
      if (e.target === rentalModal) {
        rentalModal.classList.remove('open');
      }
    });

    // Rental quotation submission redirect to WhatsApp
    rentalRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('rental-name').value;
      const clientPhone = document.getElementById('rental-phone').value;
      const rentalPlan = document.getElementById('rental-plan').value;
      const clientMessage = document.getElementById('rental-message').value;
      
      const planText = rentalPlan === '6_months' ? '6 شهور (متوسط الأجل)' : 'سنة (طويل الأجل)';
      const messageText = `السلام عليكم، أود طلب عرض سعر إيجار أسطول:\n- الاسم: ${clientName}\n- الهاتف: ${clientPhone}\n- مدة الإيجار: ${planText}\n- التفاصيل: ${clientMessage}`;
      
      const encodedText = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/201061076998?text=${encodedText}`;
      
      rentalAlertBox.style.display = 'block';
      rentalAlertBox.className = 'form-alert success';
      rentalAlertBox.textContent = currentLang === 'ar' ? "جاري تحويلك إلى واتساب لإرسال الطلب..." : "Redirecting to WhatsApp to send your request...";

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        rentalModal.classList.remove('open');
        rentalRequestForm.reset();
      }, 1500);
    });
  }


  // 10. Contact Form Handler with URL params parser (in contact.html)
  const contactForm = document.getElementById('contact-us-form');
  const contactAlertBox = document.getElementById('form-alert-box');

  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    
    // Auto-select dropdown item based on navigation search params
    if (typeParam) {
      const selectElement = document.getElementById('contact-subject');
      if (selectElement) {
        selectElement.value = typeParam;
      }
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('contact-name').value;
      const clientPhone = document.getElementById('contact-phone').value;
      const subjectSelect = document.getElementById('contact-subject');
      const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
      const clientMessage = document.getElementById('contact-message').value;

      const messageText = `السلام عليكم، لدي استفسار بخصوص: ${subjectText}\n- الاسم: ${clientName}\n- الهاتف: ${clientPhone}\n- الرسالة: ${clientMessage}`;

      const encodedText = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/201061076998?text=${encodedText}`;

      // Show redirecting message
      contactAlertBox.style.display = 'block';
      contactAlertBox.className = 'form-alert success';
      contactAlertBox.textContent = currentLang === 'ar' ? "جاري تحويلك إلى واتساب لإرسال استفسارك..." : "Redirecting to WhatsApp to send your inquiry...";
      
      // Scroll to notification message smoothly
      contactAlertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
        contactAlertBox.style.display = 'none';
      }, 1500);
    });
  }

});
