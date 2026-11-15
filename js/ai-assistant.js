// ==========================================================================
// AI VOICE ASSISTANT LAYER (Page 2 & 11: Car 18 Voice Guidance Prototype)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initAiAssistant();
});

const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['cdi', 'finance', 'financer', 'cpf', 'aide', 'pole emploi', 'france travail', 'gratuit', 'payer', 'prix'],
    answer: "Excellente question ! Si tu n'as pas de CDI, tu as droit à plusieurs aides majeures : 1) Le Chèque Permis Région Île-de-France (jusqu'à 1300€ pour les 18-25 ans demandeurs d'emploi), 2) Le financement via ton solde CPF, 3) L'aide de 500€ pour les apprentis, et 4) Le Permis à 1€ par jour. Notre session Car 18 x Tasty Crousty t'explique comment monter ton dossier sans débourser un centime de ta poche !"
  },
  {
    keywords: ['tasty', 'crousty', 'repas', 'manger', 'poulet', 'nourriture', 'food'],
    answer: "Pendant notre session spéciale du drop, Tasty Crousty (la référence crispy chicken du 18e) régale tous les participants inscrits avec une box tenders croustillants, riz assaisonné et sauces signature offertes sur place ! C'est le moment d'allier permis et street food conviviale."
  },
  {
    keywords: ['pass', 'web3', 'badge', 'nft', 'communaute', 'reseau'],
    answer: "Le Pass Indépendance Car 18 est un badge numérique attestant ta participation à la session. Il te donne un accès exclusif à notre serveur privé Discord / Telegram où des anciens élèves devenus chauffeurs, techniciens, commerciaux ou entrepreneurs partagent leurs offres d'emploi et conseils."
  },
  {
    keywords: ['boite', 'automatique', 'manuelle', 'difference', 'choisir'],
    answer: "La boîte automatique est de plus en plus populaire chez les jeunes à Paris : seulement 13 heures de conduite obligatoires (contre 20h en manuelle), moins de stress dans les embouteillages parisiens, un taux de réussite plus élevé, et tu peux faire une passerelle de 7h plus tard pour conduire une manuelle !"
  },
  {
    keywords: ['adresse', 'ou', 'metro', 'contact', 'telephone', 'dijon'],
    answer: "L'Auto Moto École CAR 18 est située au 6 rue Joseph Dijon, 75018 Paris. On est idéalement desservis par les métros Simplon (Ligne 4) et Jules Joffrin (Ligne 12). Tu peux aussi nous joindre au 01 42 23 65 15."
  },
  {
    keywords: ['gleam', 'concours', 'gagner', 'tirage', 'lot'],
    answer: "Notre concours Gleam met en jeu un Permis B complet d'une valeur de 1200€, 10 menus XXL Tasty Crousty et 50 Pass Indépendance exclusifs ! Plus tu réalises de petites missions (suivre sur Insta/TikTok, parrainer tes amis), plus tu augmentes tes chances."
  }
];

function initAiAssistant() {
  const chatBox = document.getElementById('aiChatHistory');
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('btnAiSend');
  const voiceToggleBtn = document.getElementById('btnVoiceToggle');
  const chips = document.querySelectorAll('.suggestion-chip');

  let voiceEnabled = false;

  if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      voiceToggleBtn.classList.toggle('active', voiceEnabled);
      voiceToggleBtn.textContent = voiceEnabled ? '🔊 Voix Activée' : '🔇 Mode Muet';
      if (voiceEnabled) {
        speakText("Bonjour ! Je suis l'assistant vocal Car 18. Pose-moi tes questions sur le permis ou la session spéciale.");
      }
    });
  }

  function handleSend(text) {
    const query = text || (input ? input.value.trim() : '');
    if (!query) return;

    // Append user bubble
    appendBubble(query, 'user');
    if (input) input.value = '';

    // Generate response
    const answer = findAnswer(query);

    setTimeout(() => {
      appendBubble(answer, 'bot');
      if (voiceEnabled) {
        speakText(answer);
      }
      if (typeof window.triggerGleamTask === 'function') {
        window.triggerGleamTask('ai', 2);
      }
    }, 450);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSend());
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleSend(chip.textContent.replace(/[^\w\sÀ-ÿ\?]/gi, '').trim());
    });
  });
}

function findAnswer(query) {
  const qLower = query.toLowerCase();
  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => qLower.includes(k))) {
      return item.answer;
    }
  }
  return "Excellente question ! Chez Car 18, nous formons les conducteurs de demain dans le 18e arrondissement avec un taux de réussite d'excellence. Viens à notre événement drop Car 18 x Tasty Crousty pour poser toutes tes questions directement à nos moniteurs et déguster un repas offert !";
}

function appendBubble(text, sender) {
  const chatBox = document.getElementById('aiChatHistory');
  if (!chatBox) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 1.05;

  // Visualizer animation
  const waves = document.querySelectorAll('.wave-bar');
  waves.forEach(w => w.style.animationPlayState = 'running');

  utterance.onend = () => {
    waves.forEach(w => w.style.animationPlayState = 'paused');
  };

  window.speechSynthesis.speak(utterance);
}
