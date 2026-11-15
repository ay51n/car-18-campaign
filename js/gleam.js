// ==========================================================================
// GLEAM.IO VIRAL CAMPAIGN ENGINE (Page 9: Gleam Execution & Organic Reach)
// ==========================================================================

const GLEAM_STORAGE_KEY = 'car18_gleam_state';

// Initial state
const defaultGleamState = {
  userEntries: 0,
  completedTasks: [],
  userEmail: '',
  referralCount: 0,
  refCode: 'C18-' + Math.floor(1000 + Math.random() * 9000)
};

function getGleamState() {
  try {
    const saved = localStorage.getItem(GLEAM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultGleamState;
  } catch (e) {
    return defaultGleamState;
  }
}

function saveGleamState(state) {
  try {
    localStorage.setItem(GLEAM_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// Confetti burst generator
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#facc15', '#ff1493', '#3b82f6', '#10b981', '#ffffff'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let startTime = Date.now();
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, 1 - elapsed / 1800);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    });

    if (elapsed < 1800) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(animate);
}

// Audio ping using Web Audio API
function playSoundPing(frequency = 587.33, type = 'sine') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (e) {}
}

// Initialize Gleam Widget UI
function initGleamWidget() {
  const state = getGleamState();
  updateGleamUI(state);

  // Bind Task clicks
  const taskItems = document.querySelectorAll('.gleam-task-item');
  taskItems.forEach(item => {
    const taskId = item.dataset.task;
    const points = parseInt(item.dataset.points, 10);

    if (state.completedTasks.includes(taskId)) {
      item.classList.add('completed');
      const badge = item.querySelector('.gleam-points-badge');
      if (badge) badge.innerHTML = '✓ Validé';
    }

    item.addEventListener('click', () => {
      handleTaskClick(taskId, points, item);
    });
  });

  // Referral link copy
  const copyBtn = document.getElementById('btnCopyRefLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const input = document.getElementById('refLinkInput');
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
          copyBtn.textContent = 'Copié !';
          setTimeout(() => (copyBtn.textContent = 'Copier mon lien'), 2000);
          // Reward user for generating link if not already done
          triggerGleamTask('share_ref', 5);
        });
      }
    });
  }

  // Populate referral link
  const refLinkInput = document.getElementById('refLinkInput');
  if (refLinkInput) {
    refLinkInput.value = `https://car-18.fr/drop?ref=${state.refCode}`;
  }
}

function handleTaskClick(taskId, points, element) {
  const state = getGleamState();

  if (state.completedTasks.includes(taskId)) {
    alert('Vous avez déjà validé cette entrée pour le tirage au sort !');
    return;
  }

  // Action based on task
  if (taskId === 'email') {
    promptForEmail(points, element);
  } else if (taskId === 'instagram') {
    window.open('https://instagram.com/car18_autoecole', '_blank');
    confirmTaskAfterDelay(taskId, points, element, 'Abonnement Instagram vérifié ! (+3 Entrées)');
  } else if (taskId === 'tiktok') {
    window.open('https://tiktok.com/@car18_paris', '_blank');
    confirmTaskAfterDelay(taskId, points, element, 'Abonnement TikTok vérifié ! (+3 Entrées)');
  } else if (taskId === 'tasty') {
    window.open('https://www.google.com/maps/search/Tasty+Crousty+Paris+18', '_blank');
    confirmTaskAfterDelay(taskId, points, element, 'Visite Tasty Crousty validée ! (+2 Entrées)');
  } else if (taskId === 'whatsapp') {
    const shareText = encodeURIComponent("🚨 Bon plan permis ! CAR 18 x TASTY CROUSTY font gagner un Permis B complet (1200€) et des menus poulet offerts ! Inscris-toi ici : " + `https://car-18.fr/drop?ref=${state.refCode}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    confirmTaskAfterDelay(taskId, points, element, 'Partage WhatsApp validé ! (+3 Entrées)');
  } else if (taskId === 'pass') {
    // Scroll to pass section
    const passSec = document.getElementById('pass-section');
    if (passSec) passSec.scrollIntoView({ behavior: 'smooth' });
    confirmTaskAfterDelay(taskId, points, element, 'Pass Indépendance découvert ! (+5 Entrées)');
  } else if (taskId === 'quiz') {
    const quizSec = document.getElementById('securite-section');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
  } else if (taskId === 'ai') {
    const aiSec = document.getElementById('ai-assistant-section');
    if (aiSec) aiSec.scrollIntoView({ behavior: 'smooth' });
    confirmTaskAfterDelay(taskId, points, element, 'Interaction IA validée ! (+2 Entrées)');
  }
}

function promptForEmail(points, element) {
  const email = prompt('Entre ton adresse e-mail pour enregistrer tes participations :');
  if (email && email.includes('@')) {
    const state = getGleamState();
    state.userEmail = email;
    state.userEntries += points;
    state.completedTasks.push('email');
    saveGleamState(state);
    updateGleamUI(state);

    element.classList.add('completed');
    element.querySelector('.gleam-points-badge').innerHTML = '✓ Validé';
    playSoundPing(659.25);
    launchConfetti();
  }
}

function confirmTaskAfterDelay(taskId, points, element, successMsg) {
  setTimeout(() => {
    const state = getGleamState();
    if (!state.completedTasks.includes(taskId)) {
      state.userEntries += points;
      state.completedTasks.push(taskId);
      saveGleamState(state);
      updateGleamUI(state);

      element.classList.add('completed');
      const badge = element.querySelector('.gleam-points-badge');
      if (badge) badge.innerHTML = '✓ Validé';

      playSoundPing(783.99);
      launchConfetti();

      // Notification toast
      showToast(successMsg);
    }
  }, 1200);
}

// Global trigger callable from other modules (Pass minting, Quiz completion)
window.triggerGleamTask = function(taskId, points) {
  const state = getGleamState();
  if (!state.completedTasks.includes(taskId)) {
    state.userEntries += points;
    state.completedTasks.push(taskId);
    saveGleamState(state);
    updateGleamUI(state);

    const elem = document.querySelector(`.gleam-task-item[data-task="${taskId}"]`);
    if (elem) {
      elem.classList.add('completed');
      const badge = elem.querySelector('.gleam-points-badge');
      if (badge) badge.innerHTML = '✓ Validé';
    }

    playSoundPing(880);
    launchConfetti();
    showToast(`Mission accomplie ! +${points} entrées ajoutées au tirage au sort.`);
  }
};

function updateGleamUI(state) {
  const userEntriesElem = document.getElementById('userGleamEntries');
  if (userEntriesElem) {
    userEntriesElem.textContent = state.userEntries;
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#10b981';
  toast.style.color = '#ffffff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '9999px';
  toast.style.fontWeight = '700';
  toast.style.fontSize = '0.92rem';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
  toast.style.zIndex = '10000';
  toast.style.transition = 'all 0.3s ease';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

document.addEventListener('DOMContentLoaded', initGleamWidget);
