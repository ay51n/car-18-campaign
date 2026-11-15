// ==========================================================================
// AI VOICE ASSISTANT LAYER (Page 2 & 11: Car 18 Voice Guidance Prototype)
// Features: Two-Way Speech Recognition (Microphone) & Speech Synthesis (Voice)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initAiAssistant();
});

const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['cdi', 'finance', 'financer', 'cpf', 'aide', 'pole emploi', 'france travail', 'gratuit', 'payer', 'prix', 'argent', 'cout', 'coûte'],
    answer: "Excellente question ! Si tu n'as pas de CDI, tu as droit à plusieurs aides majeures : 1) Le Chèque Permis Région Île-de-France (jusqu'à 1300€ pour les 18-25 ans demandeurs d'emploi), 2) Le financement via ton solde CPF, 3) L'aide de 500€ pour les apprentis, et 4) Le Permis à 1€ par jour. Notre session Car 18 x Tasty Crousty t'explique comment monter ton dossier sans débourser un centime de ta poche !"
  },
  {
    keywords: ['tasty', 'crousty', 'repas', 'manger', 'poulet', 'nourriture', 'food', 'menu', 'tenders', 'gratuit'],
    answer: "Pendant notre session spéciale du drop, Tasty Crousty (la référence crispy chicken du 18e) régale tous les participants inscrits avec une box tenders croustillants, riz assaisonné et sauces signature offertes sur place ! C'est le moment d'allier permis et street food conviviale."
  },
  {
    keywords: ['stamp', 'digital stamp', 'tampon', 'pass', 'web3', 'badge', 'nft', 'communaute', 'communauté', 'reseau', 'réseau'],
    answer: "Le Digital Stamp Car 18 est un tampon numérique officiel remis à la fin de la masterclass. Il agit comme une clé token-gated infalsifiable qui débloque notre serveur privé pour échanger en direct avec nos diplômés en poste et consulter les offres d'emploi réservées."
  },
  {
    keywords: ['job', 'jobs', 'emploi', 'travail', 'metier', 'métier', 'embauche', 'recrute', 'salaire'],
    answer: "Le permis B est le meilleur accélérateur d'emploi sans diplôme ni CDI préalable ! En Île-de-France, les entreprises recrutent en continu des chauffeurs-livreurs (1900€-2400€ avec utilitaire fourni), des techniciens fibre/maintenance (2200€-2800€ avec voiture de fonction), des chauffeurs VTC et des commerciaux itinérants."
  },
  {
    keywords: ['boite', 'boîte', 'automatique', 'manuelle', 'difference', 'différence', 'choisir', 'heures'],
    answer: "La boîte automatique est de plus en plus populaire chez les jeunes à Paris : seulement 13 heures de conduite obligatoires (contre 20h en manuelle), moins de stress dans les embouteillages parisiens, un taux de réussite plus élevé, et tu peux faire une passerelle de 7h plus tard pour conduire une manuelle !"
  },
  {
    keywords: ['adresse', 'ou', 'où', 'metro', 'métro', 'contact', 'telephone', 'téléphone', 'dijon', 'situe', 'située'],
    answer: "L'Auto Moto École CAR 18 est située au 6 rue Joseph Dijon, 75018 Paris. On est idéalement desservis par les métros Simplon (Ligne 4) et Jules Joffrin (Ligne 12). Tu peux aussi nous joindre au 01 42 23 65 15."
  },
  {
    keywords: ['gleam', 'concours', 'gagner', 'tirage', 'lot', 'cadeau'],
    answer: "Notre concours Gleam met en jeu un Permis B complet d'une valeur de 1200€, 10 menus XXL Tasty Crousty et 50 Pass Indépendance exclusifs ! Plus tu réalises de petites missions (suivre sur Insta/TikTok, parrainer tes amis), plus tu augmentes tes chances."
  },
  {
    keywords: ['bonjour', 'salut', 'coucou', 'hello', 'yo'],
    answer: "Salut à toi ! Bienvenue chez Car 18. Je suis l'assistante vocale officielle de notre campagne. Pose-moi une question sur le permis, les aides sans CDI, ou le repas Tasty Crousty offert !"
  },
  {
    keywords: ['merci', 'super', 'top', 'parfait'],
    answer: "Avec grand plaisir ! N'hésite pas à réserver ta place pour la prochaine masterclass ou à tester le concours Gleam pour tenter de remporter ton permis complet !"
  }
];

function initAiAssistant() {
  const chatBox = document.getElementById('aiChatHistory');
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('btnAiSend');
  const micBtn = document.getElementById('btnAiMic');
  const voiceToggleBtn = document.getElementById('btnVoiceToggle');
  const chips = document.querySelectorAll('.suggestion-chip');
  const listeningBanner = document.getElementById('micListeningBanner');

  let voiceEnabled = false;
  let recognition = null;
  let isListening = false;

  // Initialize Speech Recognition if supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (micBtn) {
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        const label = micBtn.querySelector('.mic-label');
        if (label) label.textContent = 'En écoute...';
        if (listeningBanner) listeningBanner.style.display = 'flex';
        setVisualizerActive(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        
        if (input) input.value = transcript;

        // Auto submit if final result
        if (event.results[0].isFinal) {
          stopListening();
          // Turn on voice reply so she answers back aloud
          enableVoiceOutput();
          handleSend(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        stopListening();
        if (event.error === 'not-allowed') {
          alert("L'accès au microphone a été refusé. Veuillez autoriser votre micro dans les paramètres du navigateur.");
        }
      };

      recognition.onend = () => {
        stopListening();
      };

      micBtn.addEventListener('click', () => {
        if (!isListening) {
          try {
            recognition.start();
          } catch (e) {
            recognition.stop();
          }
        } else {
          stopListening();
        }
      });

    } else {
      // Fallback for browsers without Web Speech Recognition (e.g. older Firefox)
      micBtn.addEventListener('click', () => {
        micBtn.classList.add('listening');
        if (listeningBanner) {
          listeningBanner.style.display = 'flex';
          listeningBanner.innerHTML = '<span>🎙️ Micro actif en mode interactif. Cliquez sur une question ci-dessous ou tapez votre message !</span>';
        }
        enableVoiceOutput();
        speakText("Bonjour ! Posez-moi votre question en utilisant le champ de texte ou cliquez directement sur les questions rapides.");

        setTimeout(() => {
          micBtn.classList.remove('listening');
          if (listeningBanner) listeningBanner.style.display = 'none';
        }, 4000);
      });
    }
  }

  function stopListening() {
    isListening = false;
    if (micBtn) {
      micBtn.classList.remove('listening');
      const label = micBtn.querySelector('.mic-label');
      if (label) label.textContent = 'Parler';
    }
    if (listeningBanner) listeningBanner.style.display = 'none';
    setVisualizerActive(false);
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  function enableVoiceOutput() {
    voiceEnabled = true;
    if (voiceToggleBtn) {
      voiceToggleBtn.classList.add('active');
      voiceToggleBtn.textContent = '🔊 Voix Activée';
    }
  }

  // Voice toggle
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
      enableVoiceOutput();
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

function setVisualizerActive(active) {
  const waves = document.querySelectorAll('.wave-bar');
  waves.forEach(w => {
    w.style.animationPlayState = active ? 'running' : 'paused';
  });
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 1.05;

  setVisualizerActive(true);

  utterance.onend = () => {
    setVisualizerActive(false);
  };

  window.speechSynthesis.speak(utterance);
}
