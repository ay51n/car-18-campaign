// ==========================================================================
// SAFE DRIVING & ACCIDENT PREVENTION (Pages 4, 10, 11, 12 in PDF)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initReactionTest();
  initCodeQuiz();
});

// REACTION TIME TEST
function initReactionTest() {
  const box = document.getElementById('reactionBox');
  const instruction = document.getElementById('reactionInstruction');
  const resultDisplay = document.getElementById('reactionResult');
  const btnReset = document.getElementById('btnResetReaction');

  if (!box || !instruction) return;

  let state = 'idle'; // 'idle', 'waiting', 'ready', 'finished'
  let timerId = null;
  let startTime = 0;

  box.addEventListener('click', () => {
    if (state === 'idle') {
      // Start test
      state = 'waiting';
      box.className = 'reaction-box waiting';
      instruction.innerHTML = '🛑 <strong>ATTENTION...</strong> Attends que l\'écran devienne VERT pour freiner !';
      if (resultDisplay) resultDisplay.textContent = '';

      const delay = Math.random() * 2500 + 1500; // 1.5s - 4s
      timerId = setTimeout(() => {
        state = 'ready';
        box.className = 'reaction-box ready';
        instruction.innerHTML = '⚡ <strong>FREINE MAINTENANT ! CLIQUE VITE !</strong>';
        startTime = performance.now();
      }, delay);

    } else if (state === 'waiting') {
      // False start
      clearTimeout(timerId);
      state = 'idle';
      box.className = 'reaction-box';
      instruction.innerHTML = '⚠️ <strong>Faux départ !</strong> Tu as freiné avant le signal vert. Reclique pour réessayer.';
    } else if (state === 'ready') {
      // Clicked on green!
      const elapsed = Math.round(performance.now() - startTime);
      state = 'finished';
      box.className = 'reaction-box';

      let evaluation = '';
      if (elapsed < 250) {
        evaluation = '🏆 Réflexes de pilote ! Exceptionnel pour la conduite urbaine.';
      } else if (elapsed < 380) {
        evaluation = '✅ Excellent réflexe ! Très bonne maîtrise de l\'anticipation.';
      } else {
        evaluation = 'ℹ️ Réflexe normal. La vigilance constante dans Paris 18e est primordiale !';
      }

      instruction.innerHTML = `🏁 <strong>Temps de réaction : ${elapsed} ms</strong>`;
      if (resultDisplay) {
        resultDisplay.innerHTML = `${evaluation}<br><small style="color: #94a3b8">À 50 km/h, ton véhicule parcourt ${((50 / 3.6) * (elapsed / 1000)).toFixed(1)} mètres avant le premier coup de frein.</small>`;
      }

      // Gleam reward
      if (typeof window.triggerGleamTask === 'function') {
        window.triggerGleamTask('quiz', 3);
      }

      if (btnReset) btnReset.style.display = 'inline-block';
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.stopPropagation();
      state = 'idle';
      box.className = 'reaction-box';
      instruction.innerHTML = '🎯 <strong>Clique ici</strong> pour tester ton temps de réaction au freinage d\'urgence.';
      if (resultDisplay) resultDisplay.textContent = '';
      btnReset.style.display = 'none';
    });
  }
}

// QUICK CODE QUIZ
const QUIZ_QUESTIONS = [
  {
    q: "Dans une rue étroite du 18e sans marquage au sol, qui est prioritaire à une intersection ?",
    options: ["Le véhicule venant de droite (Priorité à droite)", "Le véhicule le plus rapide", "Celui qui klaxonne"],
    correct: 0,
    explanation: "En l'absence de signalisation, la priorité à droite s'applique toujours en agglomération !"
  },
  {
    q: "Quelle est l'obligation de la ceinture de sécurité pour les passagers à l'arrière ?",
    options: ["Facultative sur les trajets de moins de 1 km", "Obligatoire pour tous les occupants", "Uniquement pour les enfants"],
    correct: 1,
    explanation: "La ceinture est obligatoire à l'avant comme à l'arrière pour 100% des passagers (page 11 de notre campagne)."
  },
  {
    q: "Quel est le risque majeur avec les deux-roues et vélos en ville ?",
    options: ["L'angle mort lors d'un changement de direction", "Leur couleur de casque", "La pression de leurs pneus"],
    correct: 0,
    explanation: "Vérifier ses angles morts en tournant la tête est la règle d'or pour éviter tout accident avec les vélos et scooters."
  }
];

function initCodeQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  let currentIdx = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIdx >= QUIZ_QUESTIONS.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h4 style="font-size: 1.4rem; color: #10b981; margin-bottom: 10px;">🎉 Bravo ! Score : ${score} / ${QUIZ_QUESTIONS.length}</h4>
          <p style="color: #cbd5e1; margin-bottom: 16px;">Tu as l'œil aiguisé d'un futur titulaire du permis de conduire Car 18 !</p>
          <button class="btn-primary" onclick="initCodeQuiz()">Recommencer le test</button>
        </div>
      `;
      return;
    }

    const item = QUIZ_QUESTIONS[currentIdx];
    container.innerHTML = `
      <div style="background: rgba(15, 29, 54, 0.9); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="font-size: 0.8rem; color: #facc15; font-weight: 800; margin-bottom: 6px;">QUESTION ${currentIdx + 1} / ${QUIZ_QUESTIONS.length}</div>
        <h4 style="font-size: 1.1rem; color: #ffffff; margin-bottom: 16px;">${item.q}</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${item.options.map((opt, i) => `
            <button class="quiz-opt-btn" data-index="${i}" style="background: #1e293b; color: #ffffff; border: 1px solid #334155; padding: 10px 14px; border-radius: 8px; text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="quizFeedback" style="margin-top: 14px; font-size: 0.88rem; display: none;"></div>
      </div>
    `;

    const buttons = container.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.dataset.index, 10);
        const feedback = document.getElementById('quizFeedback');
        buttons.forEach(b => b.disabled = true);

        if (selected === item.correct) {
          btn.style.background = '#15803d';
          btn.style.borderColor = '#22c55e';
          score++;
          feedback.style.display = 'block';
          feedback.style.color = '#4ade80';
          feedback.innerHTML = `✅ Exact ! ${item.explanation}`;
        } else {
          btn.style.background = '#991b1b';
          btn.style.borderColor = '#ef4444';
          feedback.style.display = 'block';
          feedback.style.color = '#f87171';
          feedback.innerHTML = `❌ Erreur. La bonne réponse était : "${item.options[item.correct]}". ${item.explanation}`;
        }

        setTimeout(() => {
          currentIdx++;
          renderQuestion();
        }, 2200);
      });
    });
  }

  renderQuestion();
}
