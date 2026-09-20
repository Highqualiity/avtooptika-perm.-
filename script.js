// =========================================================
// AUTO OPTIC — script.js (DARK OPTICS)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initHeaderScroll();
  initBurgerMenu();
  initFixedMobileCta();
  initBeforeAfterSlider();
  initProjectModal();
  initPrivacyModal();
  initCtaForm();
  initFooterYear();
});

/* ---------------------------------------------------------
   1. Появление элементов при скролле
--------------------------------------------------------- */
function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = Math.min(index * 50, 250);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   2. Sticky header
--------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const toggle = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------
   3. Бургер-меню (мобильное)
--------------------------------------------------------- */
function initBurgerMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const open = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') close();
  });
}

/* ---------------------------------------------------------
   4. Fixed mobile CTA — после скролла за Hero
--------------------------------------------------------- */
function initFixedMobileCta() {
  const bar = document.getElementById('fixedMobileCta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;
  const toggle = () => bar.classList.toggle('is-visible', hero.getBoundingClientRect().bottom < 0);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------
   5. Слайдер "До / После" с авто-демо при первом появлении
--------------------------------------------------------- */
function initBeforeAfterSlider() {
  const slider = document.getElementById('baSlider');
  if (!slider) return;

  const beforePanel = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  const input = document.getElementById('baInput');
  const beforeSvg = beforePanel.querySelector('.ba__svg');

  const setPosition = (percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    beforePanel.style.width = clamped + '%';
    handle.style.left = clamped + '%';
    const sliderWidth = slider.getBoundingClientRect().width;
    if (beforeSvg) beforeSvg.style.width = sliderWidth + 'px';
    input.value = clamped;
  };

  input.addEventListener('input', (e) => setPosition(Number(e.target.value)));
  window.addEventListener('resize', () => setPosition(Number(input.value)));
  setPosition(50);

  // Короткая автодемонстрация при первом появлении блока в вьюпорте
  let demoPlayed = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const playDemo = () => {
    if (demoPlayed || reduceMotion) return;
    demoPlayed = true;
    const sequence = [20, 80, 50];
    let i = 0;
    const step = () => {
      if (i >= sequence.length) return;
      setPosition(sequence[i]);
      i++;
      setTimeout(step, 650);
    };
    setTimeout(step, 300);
  };

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { playDemo(); o.disconnect(); }
      });
    }, { threshold: 0.4 });
    obs.observe(slider);
  } else {
    playDemo();
  }
}

/* ---------------------------------------------------------
   6. Модалка проекта портфолио
--------------------------------------------------------- */
const PROJECTS = {
  bmw: {
    title: 'BMW X4 F26',
    task: 'Слабый штатный свет, потерявшая прозрачность оптика.',
    work: 'Установка Bi-LED линз, восстановление прозрачности стёкол фар.',
    result: 'Ровная светотеневая граница, сохранён штатный функционал.'
  },
  kia: {
    title: 'Kia Sportage',
    task: 'Недостаточная дальность и равномерность света.',
    work: 'Установка Bi-LED с сохранением адаптивного света.',
    result: 'Точно настроенный пучок, полностью рабочий адаптивный свет.'
  },
  rav4: {
    title: 'Toyota RAV4',
    task: 'Устаревшие галогенные лампы, слабый свет ночью.',
    work: 'Замена на Bi-LED-модуль, герметизация фары.',
    result: 'Современный ровный свет, полная герметичность корпуса.'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const titleEl = document.getElementById('modalTitle');
  const taskEl = document.getElementById('modalTask');
  const workEl = document.getElementById('modalWork');
  const resultEl = document.getElementById('modalResult');

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = PROJECTS[btn.dataset.openModal];
      if (!data) return;
      titleEl.textContent = data.title;
      taskEl.textContent = data.task;
      workEl.textContent = data.work;
      resultEl.textContent = data.result;
      openModal(modal);
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => closeModal(modal));
  });
}

function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (!modal) return;

  document.querySelectorAll('[data-open-privacy]').forEach(btn => {
    btn.addEventListener('click', () => openModal(modal));
  });
  modal.querySelectorAll('[data-close-privacy]').forEach(el => {
    el.addEventListener('click', () => closeModal(modal));
  });
}

let activeModal = null;

function openModal(modal) {
  if (!modal) return;

  modal.hidden = false;
  activeModal = modal;
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;

  modal.hidden = true;

  if (activeModal === modal) {
    activeModal = null;
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeModal) {
    closeModal(activeModal);
  }
});

/* ---------------------------------------------------------
   7. Форма финального CTA
   TODO: подключить реальную отправку (email/CRM-вебхук),
   сейчас форма только показывает сообщение об успехе локально.
--------------------------------------------------------- */
function initCtaForm() {
  const form = document.getElementById('ctaForm');
  const success = document.getElementById('formSuccess');
  const photoInput = document.getElementById('photo');
  const photoLabel = document.getElementById('photoLabel');
  if (!form) return;

  if (photoInput && photoLabel) {
    photoInput.addEventListener('change', () => {
      photoLabel.textContent = photoInput.files.length
        ? `Файл выбран: ${photoInput.files[0].name}`
        : 'Фото фар (необязательно)';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const carModel = form.querySelector('#carModel');
    const phone = form.querySelector('#phone');
    const consent = form.querySelector('#consent');
    let valid = true;

    [carModel, phone].forEach(field => {
      if (!field.value.trim()) { field.style.borderColor = '#C8FF38'; valid = false; }
      else { field.style.borderColor = ''; }
    });
    if (!consent.checked) valid = false;

    if (!valid) return;

    console.log('Заявка (заглушка, подключите реальную отправку):', {
      carModel: carModel.value,
      phone: phone.value,
      hasPhoto: !!(photoInput && photoInput.files.length)
    });

    form.reset();
    if (photoLabel) photoLabel.textContent = 'Фото фар (необязательно)';
    if (success) {
      success.hidden = false;
      setTimeout(() => { success.hidden = true; }, 6000);
    }
  });
}

/* ---------------------------------------------------------
   8. Год в подвале
--------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
