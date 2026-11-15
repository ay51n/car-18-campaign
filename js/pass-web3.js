// ==========================================================================
// WEB3 DIGITAL STAMP ENGINE (Token-Gated Community & Proof of Attendance)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  init3DCardTilt();
  initPassMinting();
  initCommunityModal();
});

// 3D HOLOGRAPHIC TILT EFFECT
function init3DCardTilt() {
  const card = document.getElementById('nftPassCard');
  if (!card) return;

  const container = card.parentElement;

  container.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    // Move holographic sheen
    const sheen = card.querySelector('.hologram-sheen');
    if (sheen) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.4) 0%, rgba(255, 20, 147, 0.3) 30%, rgba(250, 204, 21, 0.35) 60%, transparent 80%)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// PASS & DIGITAL STAMP MINTING SIMULATION
function initPassMinting() {
  const mintBtn = document.getElementById('btnMintPass');
  const nameInput = document.getElementById('passUserName');

  if (mintBtn && nameInput) {
    mintBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const userName = nameInput.value.trim() || 'Alexandre D.';

      // Update Card
      const holderNameElem = document.getElementById('cardHolderName');
      const cardTokenElem = document.getElementById('cardTokenNumber');

      if (holderNameElem) holderNameElem.textContent = userName.toUpperCase();

      const randomToken = Math.floor(100 + Math.random() * 900);
      if (cardTokenElem) cardTokenElem.textContent = `#STAMP-018-${randomToken}`;

      // Change button state
      mintBtn.disabled = true;
      mintBtn.textContent = 'Digital Stamp Certifié !';
      mintBtn.style.background = '#10b981';

      // Confetti & Gleam trigger
      if (typeof window.triggerGleamTask === 'function') {
        window.triggerGleamTask('pass', 5);
      }

      // Show community unlock banner
      const unlockBanner = document.getElementById('communityUnlockBanner');
      if (unlockBanner) {
        unlockBanner.style.display = 'block';
        unlockBanner.scrollIntoView({ behavior: 'smooth' });
      }

      alert(`Félicitations ${userName} ! Ton Digital Stamp #STAMP-018-${randomToken} a été généré avec succès. L'accès à la communauté fermée des diplômés Car 18 est maintenant débloqué.`);
    });
  }
}

// COMMUNITY PORTAL PREVIEW MODAL
function initCommunityModal() {
  const openBtn = document.getElementById('btnOpenCommunity');
  const modal = document.getElementById('communityModal');
  const closeBtn = document.getElementById('btnCloseCommunity');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}
