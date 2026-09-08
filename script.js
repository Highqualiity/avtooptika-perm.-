// =========================================================
// АВТООПТИКА ПЕРМЬ — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initHeaderScroll();
  initFixedMobileCta();
  initBeforeAfterSlider();
  initPortfolioFilter();
  initCtaForm();
  initFooterYear();
});

/* ---------------------------------------------------------
   1. Появление элементов при скролле (.reveal)
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
        // небольшая ступенчатая задержка для элементов, появляющихся в одной группе
        const delay = Math.min(index * 40, 200);
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   2. Фон шапки при скролле
--------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------
   3. Fixed mobile CTA — появляется после скролла за Hero
--------------------------------------------------------- */
function initFixedMobileCta() {
  const bar = document.getElementById('fixedMobileCta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const toggle = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    bar.classList.toggle('is-visible', heroBottom < 0);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------
   4. Слайдер "До / После"
--------------------------------------------------------- */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('[data-before-after]');

  sliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.ba-slider__before-wrap');
    const beforeImg = slider.querySelector('.ba-slider__before');
    const handle = slider.querySelector('.ba-slider__handle');
    const input = slider.querySelector('.ba-slider__input');
    if (!beforeWrap || !handle || !input) return;

    const setPosition = (percent) => {
      const clamped = Math.max(0, Math.min(100, percent));
      beforeWrap.style.width = clamped + '%';
      handle.style.left = clamped + '%';

      // ширина изображения "до" должна оставаться равной ширине всего слайдера,
      // а не сжиматься вместе с обёрткой
      const sliderWidth = slider.getBoundingClientRect().width;
      if (beforeImg) beforeImg.style.width = sliderWidth + 'px';
    };

    input.addEventListener('input', (e) => setPosition(Number(e.target.value)));
    window.addEventListener('resize', () => setPosition(Number(input.value)));

    setPosition(Number(input.value));
  });
}

/* ---------------------------------------------------------
   5. Фильтр портфолио по маркам
--------------------------------------------------------- */
function initPortfolioFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.portfolio-card');
  if (chips.length === 0) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filter = chip.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.brand === filter;
        card.hidden = !match;
      });
    });
  });
}

/* ---------------------------------------------------------
   6. Форма финального CTA
   TODO: подключить реальную отправку данных —
   например, на ваш email через сервис форм (Formspree, Getform)
   или на серверный обработчик / CRM-вебхук.
   Сейчас форма только показывает сообщение об успехе локально.
--------------------------------------------------------- */
function initCtaForm() {
  const form = document.getElementById('ctaForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const carModel = form.querySelector('#carModel');
    const phone = form.querySelector('#phone');
    let valid = true;

    [carModel, phone].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#C6FF3B';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // TODO: заменить на реальную отправку (fetch на ваш обработчик формы)
    console.log('Заявка (заглушка, подключите реальную отправку):', {
      carModel: carModel.value,
      phone: phone.value,
      comment: form.querySelector('#comment')?.value || ''
    });

    form.reset();
    if (success) {
      success.hidden = false;
      setTimeout(() => { success.hidden = true; }, 6000);
    }
  });
}

/* ---------------------------------------------------------
   7. Год в подвале
--------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
