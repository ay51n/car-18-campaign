// ==========================================================================
// CAR 18 CAMPAIGN MAIN CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initMainRegistrationForm();
  initFaqAccordion();
  initMobileMenu();
});

// EVENT DROP COUNTDOWN TIMER
function initCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + ((6 - targetDate.getDay() + 7) % 7 || 7));
  targetDate.setHours(14, 0, 0, 0);

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      const display = document.getElementById('dropTimer');
      if (display) display.textContent = 'SESSION OUVERTE !';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    const dElem = document.getElementById('countDays');
    const hElem = document.getElementById('countHours');
    const mElem = document.getElementById('countMins');
    const sElem = document.getElementById('countSecs');

    if (dElem) dElem.textContent = pad(days);
    if (hElem) hElem.textContent = pad(hours);
    if (mElem) mElem.textContent = pad(mins);
    if (sElem) sElem.textContent = pad(secs);
  }

  update();
  setInterval(update, 1000);
}

// MAIN REGISTRATION FORM
function initMainRegistrationForm() {
  const form = document.getElementById('mainBookingForm');
  const successView = document.getElementById('mainBookingSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const slot = document.getElementById('regSlot').value;
      const meal = document.getElementById('regMeal').value;

      form.style.display = 'none';
      if (successView) {
        successView.style.display = 'block';
        const holder = document.getElementById('mainTicketHolder');
        const slotEl = document.getElementById('mainTicketSlot');
        const mealEl = document.getElementById('mainTicketMeal');
        if (holder) holder.textContent = name;
        if (slotEl) slotEl.textContent = slot;
        if (mealEl) mealEl.textContent = meal;
      }

      // Decrement spots remaining
      const spotsElem = document.getElementById('spotsRemaining');
      if (spotsElem) {
        const cur = parseInt(spotsElem.textContent, 10) || 14;
        spotsElem.textContent = Math.max(1, cur - 1);
      }

      // Also set the name on the digital stamp card
      const cardHolder = document.getElementById('cardHolderName');
      if (cardHolder) cardHolder.textContent = name.toUpperCase();

      // Gleam reward for reservation!
      if (typeof window.triggerGleamTask === 'function') {
        window.triggerGleamTask('email', 1);
      }
    });
  }
}

// FAQ ACCORDION
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => other.classList.remove('active'));
        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

// MOBILE MENU
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#0a192f';
      navLinks.style.padding = '20px';
      navLinks.style.borderBottom = '1px solid #1e3a8a';
    });
  }
}
