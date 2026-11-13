/**
 * DentiArt Clinic - Interactive Core Script
 * Comprehensive UX, animations, before/after slider, appointment booking, quiz, and theme switcher.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initBeforeAfterSlider();
  initSmileQuiz();
  initAppointmentModal();
  initServiceModal();
  initFaqAccordion();
  initStatsCounter();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggleBtn = document.getElementById('theme-toggle-mobile');
  const html = document.documentElement;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('dentiart-theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  function toggleTheme() {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('dentiart-theme', isDark ? 'dark' : 'light');
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isDark = html.classList.contains('dark');
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  updateThemeIcons();
}

/* ==========================================================================
   2. Scroll Effects (Navbar, Progress Bar & Active Section)
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    // Update progress bar
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Sticky navbar backdrop state
    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add('shadow-lg', 'py-3');
        navbar.classList.remove('py-5');
      } else {
        navbar.classList.remove('shadow-lg', 'py-3');
        navbar.classList.add('py-5');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-menu');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    if (!drawer) return;
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!drawer) return;
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   4. Interactive Before & After Smile Slider
   ========================================================================== */
const transformationCases = [
  {
    id: 'blanqueamiento',
    title: 'Blanqueamiento Láser Express',
    subtitle: '6 tonos más blancos en 45 minutos sin dolor ni sensibilidad.',
    patient: 'Mariana R. - 28 años',
    duration: '1 Sesión (45 min)',
    beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'carillas',
    title: 'Diseño de Sonrisa con Carillas E-Max',
    subtitle: 'Corrección de forma, simetría y luminosidad dental ultra-natural.',
    patient: 'Roberto G. - 34 años',
    duration: '2 Citas (Digital Smile Design)',
    beforeImg: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ortodoncia',
    title: 'Ortodoncia Invisible (Alineadores 3D)',
    subtitle: 'Alineación perfecta y cierre de diastema sin brackets metálicos.',
    patient: 'Camila S. - 24 años',
    duration: '7 Meses con alineadores',
    beforeImg: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  }
];

function initBeforeAfterSlider() {
  const container = document.getElementById('ba-slider');
  if (!container) return;

  const afterWrapper = container.querySelector('.ba-after-wrapper');
  const handle = container.querySelector('.ba-slider-handle');
  const caseButtons = document.querySelectorAll('.case-tab-btn');
  const beforeImg = document.getElementById('ba-img-before');
  const afterImg = document.getElementById('ba-img-after');
  const caseTitle = document.getElementById('ba-case-title');
  const caseSubtitle = document.getElementById('ba-case-subtitle');
  const casePatient = document.getElementById('ba-case-patient');
  const caseDuration = document.getElementById('ba-case-duration');

  let isDragging = false;

  function setSliderPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    if (afterWrapper) {
      afterWrapper.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    }
    if (handle) {
      handle.style.left = `${clamped}%`;
    }
  }

  function handleMove(clientX) {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e.clientX);
  });
  window.addEventListener('mouseup', () => (isDragging = false));
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  // Touch Events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => (isDragging = false));
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  }, { passive: true });

  // Default slider center
  setSliderPosition(50);

  // Switch Transformation Case
  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      caseButtons.forEach(b => {
        b.classList.remove('bg-cyan-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
      });
      btn.classList.add('bg-cyan-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');

      const caseId = btn.dataset.case;
      const data = transformationCases.find(c => c.id === caseId);
      if (data) {
        if (beforeImg) beforeImg.src = data.beforeImg;
        if (afterImg) afterImg.src = data.afterImg;
        if (caseTitle) caseTitle.textContent = data.title;
        if (caseSubtitle) caseSubtitle.textContent = data.subtitle;
        if (casePatient) casePatient.textContent = data.patient;
        if (caseDuration) caseDuration.textContent = data.duration;
        setSliderPosition(50);
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Smile Diagnostic Quiz
   ========================================================================== */
function initSmileQuiz() {
  const quizForm = document.getElementById('smile-quiz-form');
  if (!quizForm) return;

  const steps = [
    document.getElementById('quiz-step-1'),
    document.getElementById('quiz-step-2'),
    document.getElementById('quiz-step-3'),
    document.getElementById('quiz-step-result')
  ];

  let currentStep = 0;
  const answers = {
    objective: '',
    urgency: '',
    priority: ''
  };

  // Option selection
  document.querySelectorAll('.quiz-opt').forEach(opt => {
    opt.addEventListener('click', function () {
      const stepIndex = parseInt(this.dataset.step, 10);
      const field = this.dataset.field;
      const val = this.dataset.value;

      // Unselect siblings
      const parent = this.parentElement;
      parent.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');

      answers[field] = val;

      // Auto advance to next step after brief delay
      setTimeout(() => {
        if (stepIndex < 3) {
          goToStep(stepIndex);
        } else {
          showResult();
        }
      }, 260);
    });
  });

  function goToStep(index) {
    steps.forEach((step, idx) => {
      if (step) {
        if (idx === index) {
          step.classList.remove('hidden');
        } else {
          step.classList.add('hidden');
        }
      }
    });
    currentStep = index;
  }

  function showResult() {
    goToStep(3);
    const resultTitle = document.getElementById('quiz-result-treatment');
    const resultDesc = document.getElementById('quiz-result-description');
    const resultDoctor = document.getElementById('quiz-result-doctor');
    const ctaBtn = document.getElementById('quiz-claim-btn');

    let treatment = 'Diseño Digital de Sonrisa (DSD) & Blanqueamiento';
    let desc = 'Tu objetivo principal es maximizar la estética de tu sonrisa con mínima invasión y resultados inmediatos.';
    let doctor = 'Dra. Sofía Valenzuela - Especialista en Estética';

    if (answers.objective === 'alinear') {
      treatment = 'Ortodoncia Invisible (Alineadores 3D)';
      desc = 'Ideal para corregir posición dental sin alambres metálicos, discreto y cómodo para tu estilo de vida.';
      doctor = 'Dr. Alejandro Morales - Ortodoncista Certificado';
    } else if (answers.objective === 'reemplazar') {
      treatment = 'Implante Dental Guiado 3D & Corona Circonio';
      desc = 'Solución fija de por vida con titanio biocompatible, preservando hueso y estética al 100%.';
      doctor = 'Dr. Carlos Méndez - Cirujano Maxilofacial';
    } else if (answers.objective === 'dolor') {
      treatment = 'Valoración de Urgencia & Diagnóstico Láser';
      desc = 'Atención prioritaria inmediata para aliviar molestia y salvar la pieza dental con tecnología sin dolor.';
      doctor = 'Equipo Clínico de Urgencias DentiArt';
    }

    if (resultTitle) resultTitle.textContent = treatment;
    if (resultDesc) resultDesc.textContent = desc;
    if (resultDoctor) resultDoctor.textContent = doctor;

    if (ctaBtn) {
      ctaBtn.onclick = () => {
        openBookingModalWithPreselection(treatment);
      };
    }
  }

  const restartBtn = document.getElementById('quiz-restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
      goToStep(0);
    });
  }
}

/* ==========================================================================
   6. Appointment Booking Modal & Instant WhatsApp Integration
   ========================================================================== */
function initAppointmentModal() {
  const modal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('.open-booking-btn');
  const closeBtn = document.getElementById('close-booking-modal');
  const form = document.getElementById('appointment-form');
  const successModal = document.getElementById('success-modal');
  const closeSuccessBtn = document.getElementById('close-success-modal');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const servicePreset = btn.dataset.service;
      if (servicePreset) {
        const select = document.getElementById('booking-service');
        if (select) select.value = servicePreset;
      }
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const service = document.getElementById('booking-service').value;
      const date = document.getElementById('book-date').value;
      const shift = document.getElementById('book-shift').value;
      const notes = document.getElementById('book-notes').value.trim();

      // Generate reference code
      const refCode = 'DEN-' + Math.floor(100000 + Math.random() * 900000);
      const codeSpan = document.getElementById('success-booking-code');
      if (codeSpan) codeSpan.textContent = refCode;

      // Build WhatsApp message
      const text = encodeURIComponent(
        `¡Hola DentiArt Clinic! 👋\n` +
        `Deseo agendar una cita de valoración:\n\n` +
        `👤 *Nombre:* ${name}\n` +
        `📱 *Teléfono:* ${phone}\n` +
        `🦷 *Tratamiento:* ${service}\n` +
        `📅 *Fecha deseada:* ${date || 'Lo más pronto posible'}\n` +
        `⏰ *Horario preferido:* ${shift}\n` +
        (notes ? `💬 *Nota:* ${notes}\n` : '') +
        `🏷️ *Código Ref:* ${refCode}`
      );

      closeModal();
      form.reset();

      // Show success modal
      if (successModal) {
        successModal.classList.add('active');
      }

      // Set direct WhatsApp button link
      const waBtn = document.getElementById('success-wa-send-btn');
      if (waBtn) {
        waBtn.href = `https://wa.me/5215512345678?text=${text}`;
      }
    });
  }

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
}

function openBookingModalWithPreselection(treatmentName) {
  const modal = document.getElementById('booking-modal');
  const select = document.getElementById('booking-service');
  if (select) {
    // Try matching
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(treatmentName.toLowerCase().slice(0, 8))) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   7. Service Details Modal
   ========================================================================== */
const serviceData = {
  dsd: {
    title: 'Diseño Digital de Sonrisa (DSD)',
    subtitle: 'Planificación 3D milimétrica y carillas de porcelana de alta estética.',
    description: 'A través de escáner intraoral 3D y software biomimético, diseñamos virtualmente cada pieza dental adaptada a tus facciones antes de realizar cualquier intervención. Podrás visualizar tu resultado final en una prueba estética (mock-up) sin compromiso.',
    benefits: ['Previsualización 3D en la 1era cita', 'Carillas ultrafinas sin desgastar diente sano', 'Color y brillo natural de porcelana E-Max', 'Durabilidad garantizada mayor a 15 años'],
    duration: '2 a 3 citas',
    warranty: '10 años en material cerámico'
  },
  ortodoncia: {
    title: 'Ortodoncia Invisible (Alineadores 3D)',
    subtitle: 'Dientes alineados sin dolor, alambres ni restricciones de comida.',
    description: 'La solución estética más avanzada para alinear tu sonrisa de manera discreta e higiénica. Los alineadores transparentes se cambian cada 10-14 días, aplicando fuerzas suaves y biomecánicamente óptimas.',
    benefits: ['100% transparentes e imperceptibles', 'Removibles para comer y cepillarte con facilidad', 'Revisiones rápidas cada 6 semanas', 'Sin heridas ni llagas en encías'],
    duration: '6 a 14 meses (según caso)',
    warranty: 'Seguimiento con retenedores post-tratamiento'
  },
  implantes: {
    title: 'Implantes Dentales Guiados en 3D',
    subtitle: 'Recupera piezas perdidas con titanio biocompatible de por vida.',
    description: 'Cirugía guiada por tomografía computarizada para colocar implantes de titanio grado médico con precisión microscópica. Permite función masticatoria y estética idéntica a un diente natural.',
    benefits: ['Cirugía mínimamente invasiva guiada por ordenador', 'Recuperación express sin inflamación severa', 'Preserva el hueso maxilar y previene envejecimiento facial', 'Sensación y fuerza masticatoria 100% natural'],
    duration: '1 sesión quirúrgica + cicatrización',
    warranty: 'Garantía de por vida en implante'
  },
  blanqueamiento: {
    title: 'Blanqueamiento Láser Clínico Express',
    subtitle: 'Sonrisa radiante hasta 6 tonos más blanca en 45 minutos.',
    description: 'Aplicación de gel bioactivado por luz LED/Láser de última generación que rompe pigmentaciones profundas de café, tabaco o vino sin dañar el esmalte ni deshidratar la dentina.',
    benefits: ['Resultados instantáneos en 45 minutos', 'Fórmula con nitrato de potasio para cero sensibilidad', 'Seguro para el esmalte dental', 'Incluye kit de mantenimiento en casa'],
    duration: '1 sesión (45 min)',
    warranty: 'Retoque anual sugerido'
  },
  endodoncia: {
    title: 'Endodoncia Microscópica sin Dolor',
    subtitle: 'Salva tu diente natural con tecnología de navegación digital.',
    description: 'Eliminamos la infección del nervio dental bajo microscopio quirúrgico y anestesia computarizada indolora. Salvamos piezas que en otros consultorios daban por perdidas.',
    benefits: ['100% indoloro gracias a anestesia The Wand', 'Alta magnificación que detecta conductos accesorios', 'Desinfección ultrasónica profunda', 'Evita la extracción de tu diente original'],
    duration: '1 sesión (60 min)',
    warranty: 'Tasa de éxito superior al 98%'
  },
  infantil: {
    title: 'Odontopediatría & Cuidado Infantil Amigable',
    subtitle: 'Cero traumas, diversión y salud bucal para los reyes del hogar.',
    description: 'Especialistas pediátricos capacitados en psicología infantil y técnicas libres de ansiedad. Monitoreo del recambio dental, selladores de fosas y educación preventiva lúdica.',
    benefits: ['Ambiente interactivo y sin estrés', 'Prevención de caries con flúor barniz suizo', 'Monitoreo temprano de mordida y maxilares', 'Premios y diploma de valentía'],
    duration: '30 a 45 min',
    warranty: 'Cuidado dental preventivo regular'
  }
};

function initServiceModal() {
  const modal = document.getElementById('service-modal');
  const closeBtn = document.getElementById('close-service-modal');
  const titleEl = document.getElementById('srv-modal-title');
  const subtitleEl = document.getElementById('srv-modal-sub');
  const descEl = document.getElementById('srv-modal-desc');
  const benefitsEl = document.getElementById('srv-modal-benefits');
  const durationEl = document.getElementById('srv-modal-duration');
  const warrantyEl = document.getElementById('srv-modal-warranty');
  const bookBtn = document.getElementById('srv-modal-book-btn');

  function openServiceModal(key) {
    const data = serviceData[key];
    if (!data || !modal) return;

    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (descEl) descEl.textContent = data.description;
    if (durationEl) durationEl.textContent = data.duration;
    if (warrantyEl) warrantyEl.textContent = data.warranty;

    if (benefitsEl) {
      benefitsEl.innerHTML = data.benefits
        .map(b => `<li class="flex items-start gap-2 text-slate-700 dark:text-slate-300">
          <i class="fa-solid fa-circle-check text-cyan-600 mt-1 flex-shrink-0"></i>
          <span>${b}</span>
        </li>`)
        .join('');
    }

    if (bookBtn) {
      bookBtn.onclick = () => {
        modal.classList.remove('active');
        openBookingModalWithPreselection(data.title);
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.open-service-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.serviceKey;
      openServiceModal(key);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. Animated Stats Counter (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      document.querySelectorAll('.counter-val').forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isDecimal = target % 1 !== 0;
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        let current = 0;
        const duration = 1800; // ms
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = `${prefix}${isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString()}${suffix}`;
            clearInterval(timer);
          } else {
            counter.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString()}${suffix}`;
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}
