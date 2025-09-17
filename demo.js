/* Demo-specific JavaScript for PaperCSS showcase */

// Funkcja pomocnicza do wyświetlania alertów w kontenerze
function showDynamicAlert(message, type, dismissible = true) {
  const container = document.getElementById('dynamic-alerts-container');
  if (!container) return;
  
  // Utwórz alert
  const alert = PaperAlert.create(message, type, dismissible);
  alert.style.marginBottom = '1rem';
  
  // Dodaj do kontenera zamiast body
  container.appendChild(alert);
  
  // Auto-remove po 5 sekundach jeśli dismissible
  if (dismissible) {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(-100%)';
        setTimeout(() => alert.remove(), 300);
      }
    }, 5000);
  }
}

// Funkcje dla progress barów
function animateAllProgress() {
  PaperProgress.animate('#progress1', 75, 2000);
  PaperProgress.animate('#progress2', 50, 2200);
  PaperProgress.animate('#progress3', 90, 1800);
  PaperProgress.animate('#progress4', 60, 1500);
  PaperProgress.animate('#progress5', 30, 1000);
  
  // Progress bary z etykietami
  animateProgressWithLabel('#progress6', '#progress6-label', 85, 2500);
  animateProgressWithLabel('#progress7', '#progress7-label', 67, 3000);
  
  // Cienkie progress bary
  PaperProgress.animate('#progress8', 40, 1200);
  PaperProgress.animate('#progress9', 70, 1600);
}

function resetAllProgress() {
  for(let i = 1; i <= 9; i++) {
    const el = document.getElementById(`progress${i}`);
    if(el) el.style.width = '0%';
  }
  
  // Reset etykiet
  const label6 = document.getElementById('progress6-label');
  const label7 = document.getElementById('progress7-label');
  if(label6) label6.textContent = '0%';
  if(label7) label7.textContent = '0%';
}

function animateProgressWithLabel(selector, labelSelector, target, duration) {
  const el = document.querySelector(selector);
  const label = document.querySelector(labelSelector);
  if(!el || !label) return;
  
  el.style.width = '0%';
  label.textContent = '0%';
  
  let start = null;
  function step(timestamp) {
    if(!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const current = Math.round(progress * target);
    
    el.style.width = current + '%';
    label.textContent = current + '%';
    
    if(progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

// System podpowiedzi kodu
function toggleCodeHint(button) {
  const container = button.closest('.demo-component');
  if(!container) return;
  const codeHint = container.querySelector('.code-hint');
  if(!codeHint) return;
  const isVisible = codeHint.classList.contains('show');

  const openLabelDefault = '{ } Pokaż kod';
  const closeLabelDefault = '✕ Ukryj kod';
  const openLabel = button.getAttribute('data-open-label') || openLabelDefault;
  const closeLabel = button.getAttribute('data-close-label') || closeLabelDefault;

  // Close all others
  document.querySelectorAll('.code-hint.show').forEach(hint => hint.classList.remove('show'));
  document.querySelectorAll('.code-hint-btn').forEach(btn => {
    const lbl = btn.getAttribute('data-open-label') || openLabelDefault;
    btn.textContent = lbl;
    btn.style.background = 'var(--paper-highlight)';
    btn.style.color = 'var(--paper-ink)';
  });

  if(!isVisible) {
    codeHint.classList.add('show');
    button.textContent = closeLabel;
    button.style.background = 'var(--paper-accent)';
    button.style.color = 'white';
    setTimeout(() => {
      codeHint.scrollIntoView({behavior:'smooth', block:'nearest'});
    }, 80);
  }
}

// Inicjalizacja - dodaj event listenery do wszystkich przycisków kodu
document.addEventListener('DOMContentLoaded', function() {
  // Klonuj wszystkie przyciski kodu aby działały
  document.querySelectorAll('.code-hint-btn').forEach(btn => {
    btn.onclick = function() { toggleCodeHint(this); };
  });
});