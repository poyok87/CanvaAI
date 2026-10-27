/* =========================================================
   CANVA AI MAGIC STUDIO - APPLICATION LOGIC
   Rich Interactivity, Web Audio Synth, Interactive Playground,
   Canvas Poster Generator with PNG Export & Confetti
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================
  // 2. WEB AUDIO SYNTHESIZER (Joyful & Cheerful Sound Effects)
  // =========================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cheerful Pop Sound
  function playPopSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio fallback
    }
  }

  // Magic Sparkle / Chime Sound
  function playSparkleSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.05);
        osc.stop(audioCtx.currentTime + idx * 0.05 + 0.26);
      });
    } catch (e) {}
  }

  // Success Fanfare Sound
  function playSuccessSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.52);
      });
    } catch (e) {}
  }

  // Sound Toggle Control
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const soundStatusText = document.getElementById('soundStatusText');

  soundToggleBtn?.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundIcon.setAttribute('data-lucide', 'volume-2');
      if (soundStatusText) soundStatusText.textContent = 'Aktif 🔊';
      showToast('🔊 Bunyi ceria diaktifkan!');
      playPopSound();
    } else {
      soundIcon.setAttribute('data-lucide', 'volume-x');
      if (soundStatusText) soundStatusText.textContent = 'Bisu 🔇';
      showToast('🔇 Bunyi dimatikan.');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // =========================================================
  // 3. THEME TOGGLE (Dark Mode / Light Mode)
  // =========================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = localStorage.getItem('canva_theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('canva_theme', theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  applyTheme(currentTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    playPopSound();
    showToast(newTheme === 'dark' ? '🌙 Mod Gelap Ceria diaktifkan' : '☀️ Mod Terang Ceria diaktifkan');
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  mobileMenuBtn?.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    playPopSound();
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });

  // Close announcement bar
  const closeAnnouncementBtn = document.getElementById('closeAnnouncement');
  const announcementBar = document.getElementById('announcementBar');
  closeAnnouncementBtn?.addEventListener('click', () => {
    announcementBar.style.display = 'none';
    playPopSound();
  });

  // =========================================================
  // 4. TOAST NOTIFICATION SYSTEM
  // =========================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = 'sparkles') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // =========================================================
  // 5. HERO INTERACTIVE PROMPTS & ROTATING TYPING EFFECT
  // =========================================================
  const heroPromptInput = document.getElementById('heroPromptInput');
  const heroPromptSubmit = document.getElementById('heroPromptSubmit');
  const suggestionChips = document.getElementById('suggestionChips');

  const heroPlaceholderPrompts = [
    "Seekor anak naga 3D comel melukis bintang bercahaya warna pastel...",
    "Poster promosi kafe boba strawberry ais segar diskaun 50%...",
    "Pulau terapung gaya anime Studio Ghibli dengan air terjun pelangi...",
    "Bilik gamer isometrik 3D lampu neon cyberpunk pastel...",
    "Slaid pitching startup AI moden dengan infografik bersih..."
  ];

  let promptIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 50;

  function typeHeroPlaceholder() {
    if (!heroPromptInput) return;
    const currentText = heroPlaceholderPrompts[promptIndex];

    if (isDeleting) {
      heroPromptInput.placeholder = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      heroPromptInput.placeholder = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at full sentence
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      promptIndex = (promptIndex + 1) % heroPlaceholderPrompts.length;
      typingSpeed = 400;
    }

    setTimeout(typeHeroPlaceholder, typingSpeed);
  }

  typeHeroPlaceholder();

  // Clicking suggestion chips
  suggestionChips?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const prompt = chip.getAttribute('data-prompt');
    playPopSound();

    // Scroll smoothly to playground
    const playgroundSec = document.getElementById('playground');
    playgroundSec?.scrollIntoView({ behavior: 'smooth' });

    // Switch to tab 1
    switchPlaygroundTab('tab-media');

    // Update prompt
    const mediaPromptInput = document.getElementById('mediaPromptInput');
    if (mediaPromptInput) {
      mediaPromptInput.value = prompt;
      mediaPromptInput.focus();
    }

    // Automatically trigger generation
    setTimeout(() => {
      triggerMediaGeneration();
    }, 400);
  });

  // Hero prompt submit button
  heroPromptSubmit?.addEventListener('click', () => {
    playSparkleSound();
    const playgroundSec = document.getElementById('playground');
    playgroundSec?.scrollIntoView({ behavior: 'smooth' });
    switchPlaygroundTab('tab-media');
    setTimeout(() => {
      triggerMediaGeneration();
    }, 400);
  });

  // 3D Tilt effect on Hero Card
  const hero3dCard = document.getElementById('hero3dCard');
  if (hero3dCard) {
    hero3dCard.addEventListener('mousemove', (e) => {
      const rect = hero3dCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -y / 15;
      const rotateY = x / 15;
      hero3dCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    hero3dCard.addEventListener('mouseleave', () => {
      hero3dCard.style.transform = `rotateY(-6deg) rotateX(4deg) scale(1)`;
    });
  }

  // =========================================================
  // 6. METRICS NUMBER COUNTER ANIMATION
  // =========================================================
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        metricNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-count'), 10);
          const isPercent = el.textContent.includes('%');
          const isPlus = el.textContent.includes('+');
          const isMillion = el.textContent.includes('M+');
          let current = 0;
          const duration = 1600;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            if (isPercent) el.textContent = `${current}%`;
            else if (isMillion) el.textContent = `${current}M+`;
            else if (isPlus) el.textContent = `${current}+`;
            else el.textContent = `${current}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) metricsObserver.observe(metricsSection);

  // =========================================================
  // 7. PLAYGROUND TABS LOGIC
  // =========================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.playground-panel');

  function switchPlaygroundTab(targetTabId) {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    panels.forEach(panel => {
      if (panel.id === targetTabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchPlaygroundTab(tabId);
      playPopSound();
    });
  });

  // =========================================================
  // 8. TAB 1: MAGIC MEDIA GENERATOR
  // =========================================================
  const styleCards = document.querySelectorAll('.style-card');
  const mediaPromptInput = document.getElementById('mediaPromptInput');
  const activePromptDisplay = document.getElementById('activePromptDisplay');
  const btnGenerateMedia = document.getElementById('btnGenerateMedia');
  const mediaGeneratingOverlay = document.getElementById('mediaGeneratingOverlay');
  const mediaProgressBar = document.getElementById('mediaProgressBar');
  const generatingStatusText = document.getElementById('generatingStatusText');
  const currentGeneratedImg = document.getElementById('currentGeneratedImg');
  const previewCanvasWrapper = document.getElementById('mediaPreviewWrapper');
  const aspectButtons = document.querySelectorAll('.aspect-btn');

  const styleImages = {
    '3d': 'assets/images/mascot.jpg',
    'anime': 'assets/images/anime_landscape.jpg',
    'product': 'assets/images/product_boba.jpg',
    'isometric': 'assets/images/isometric_room.jpg'
  };

  let currentSelectedStyle = '3d';

  styleCards.forEach(card => {
    card.addEventListener('click', () => {
      styleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentSelectedStyle = card.getAttribute('data-style');
      const prompt = card.getAttribute('data-prompt');
      if (mediaPromptInput) mediaPromptInput.value = prompt;
      if (activePromptDisplay) activePromptDisplay.textContent = prompt;
      playPopSound();
    });
  });

  // Aspect ratio switcher
  aspectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      aspectButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const aspect = btn.getAttribute('data-aspect');
      playPopSound();

      if (aspect === '1:1') {
        previewCanvasWrapper.style.aspectRatio = '1 / 1';
      } else if (aspect === '9:16') {
        previewCanvasWrapper.style.aspectRatio = '9 / 16';
      } else if (aspect === '16:9') {
        previewCanvasWrapper.style.aspectRatio = '16 / 9';
      }
    });
  });

  function triggerMediaGeneration() {
    if (!mediaGeneratingOverlay) return;
    playSparkleSound();
    mediaGeneratingOverlay.classList.remove('hidden');
    mediaProgressBar.style.width = '0%';

    const statusSteps = [
      "Menganalisis konsep visual & komposisi warna...",
      "Menjana rendering gaya Canva AI 4.0...",
      "Menggilap perincian pencahayaan dan zarah magis...",
      "Siap! Menghasilkan karya 4K resolusi tinggi!"
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      mediaProgressBar.style.width = `${progress}%`;

      if (progress === 25) generatingStatusText.textContent = statusSteps[0];
      if (progress === 50) generatingStatusText.textContent = statusSteps[1];
      if (progress === 75) generatingStatusText.textContent = statusSteps[2];
      if (progress === 95) generatingStatusText.textContent = statusSteps[3];

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          mediaGeneratingOverlay.classList.add('hidden');
          const targetSrc = styleImages[currentSelectedStyle] || 'assets/images/mascot.jpg';
          currentGeneratedImg.src = targetSrc;
          if (activePromptDisplay && mediaPromptInput) {
            activePromptDisplay.textContent = mediaPromptInput.value;
          }

          playSuccessSound();
          if (window.confetti) {
            window.confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          }
          showToast('✨ Visual ajaib berjaya dijana!', 'check');
        }, 300);
      }
    }, 60);
  }

  btnGenerateMedia?.addEventListener('click', triggerMediaGeneration);

  // Copy Prompt Meta
  const btnCopyPrompt = document.getElementById('btnCopyPrompt');
  btnCopyPrompt?.addEventListener('click', () => {
    const text = activePromptDisplay?.textContent || '';
    navigator.clipboard.writeText(text.trim());
    playPopSound();
    showToast('📋 Prompt disalin ke papan klip!', 'copy');
  });

  // Action buttons: Download, Remix, Share
  document.getElementById('btnDownloadMedia')?.addEventListener('click', () => {
    playSuccessSound();
    const link = document.createElement('a');
    link.href = currentGeneratedImg.src;
    link.download = `canva-ai-${currentSelectedStyle}.jpg`;
    link.click();
    showToast('💾 Imej sedang dimuat turun...');
  });

  document.getElementById('btnRemixMedia')?.addEventListener('click', () => {
    playSparkleSound();
    showToast('🪄 Menjana variasi gaya baru...');
    triggerMediaGeneration();
  });

  document.getElementById('btnShareMedia')?.addEventListener('click', () => {
    playPopSound();
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Pautan projek disalin untuk dikongsi!');
  });

  // =========================================================
  // 9. TAB 2: MAGIC ERASER & BACKGROUND REMOVER
  // =========================================================
  const modeBgRemover = document.getElementById('modeBgRemover');
  const modeMagicEraser = document.getElementById('modeMagicEraser');
  const splitSliderContainer = document.getElementById('splitSliderContainer');
  const brushCanvasContainer = document.getElementById('brushCanvasContainer');
  const brushControls = document.getElementById('brushControls');
  const eraserModeTitle = document.getElementById('eraserModeTitle');
  const eraserModeDesc = document.getElementById('eraserModeDesc');
  const eraserActionBtnText = document.getElementById('eraserActionBtnText');
  const btnExecuteEraser = document.getElementById('btnExecuteEraser');

  // Slider Elements
  const layerBefore = document.getElementById('layerBefore');
  const sliderHandle = document.getElementById('sliderHandle');
  let isDraggingSlider = false;

  function updateSliderPosition(clientX) {
    if (!splitSliderContainer) return;
    const rect = splitSliderContainer.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    const percentage = (offsetX / rect.width) * 100;

    layerBefore.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  }

  splitSliderContainer?.addEventListener('mousedown', (e) => {
    isDraggingSlider = true;
    updateSliderPosition(e.clientX);
    playPopSound();
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingSlider) {
      updateSliderPosition(e.clientX);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingSlider) {
      isDraggingSlider = false;
    }
  });

  // Touch support for slider
  splitSliderContainer?.addEventListener('touchstart', (e) => {
    isDraggingSlider = true;
    updateSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (isDraggingSlider && e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  });

  window.addEventListener('touchend', () => {
    isDraggingSlider = false;
  });

  // Mode Switching (Background Remover vs Magic Eraser)
  modeBgRemover?.addEventListener('click', () => {
    modeBgRemover.classList.add('active');
    modeMagicEraser.classList.remove('active');
    splitSliderContainer.classList.remove('hidden');
    brushCanvasContainer.classList.add('hidden');
    brushControls.classList.add('hidden');
    eraserModeTitle.textContent = '🪄 Gelongsor Sebelum / Selepas';
    eraserModeDesc.textContent = 'Tarik garis pemisah di bahagian kanan ke kiri dan ke kanan untuk melihat bagaimana Canva AI membuang latar belakang secara terperinci sehingga helaian daun pudina dan embun ais!';
    eraserActionBtnText.textContent = '✨ Lihat Hasil Magic Remover';
    playPopSound();
  });

  modeMagicEraser?.addEventListener('click', () => {
    modeMagicEraser.classList.add('active');
    modeBgRemover.classList.remove('active');
    splitSliderContainer.classList.add('hidden');
    brushCanvasContainer.classList.remove('hidden');
    brushControls.classList.remove('hidden');
    eraserModeTitle.textContent = '🖌️ Mod Berus Magic Eraser';
    eraserModeDesc.textContent = 'Gunakan tetikus anda untuk menyapu objek yang ingin dipadamkan (contohnya strawberi atau ais). AI akan menganalisis dan memadam objek tersebut serta mengisi latar belakang semula secara ajaib!';
    eraserActionBtnText.textContent = '🪄 Padam Pilihan Bersapukan Berus';
    initEraserCanvas();
    playPopSound();
  });

  // Sample thumbs switch in Eraser
  const sampleThumbs = document.querySelectorAll('.sample-thumb');
  const imgLayerAfter = document.getElementById('imgLayerAfter');
  const imgLayerBefore = document.getElementById('imgLayerBefore');
  const brushBackgroundImg = document.getElementById('brushBackgroundImg');

  const sampleImageMap = {
    'boba': 'assets/images/product_boba.jpg',
    'dragon': 'assets/images/mascot.jpg',
    'room': 'assets/images/isometric_room.jpg'
  };

  sampleThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      sampleThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const imgKey = thumb.getAttribute('data-img');
      const src = sampleImageMap[imgKey] || sampleImageMap.boba;
      if (imgLayerAfter) imgLayerAfter.src = src;
      if (imgLayerBefore) imgLayerBefore.src = src;
      if (brushBackgroundImg) brushBackgroundImg.src = src;
      playPopSound();
      showToast('🖼️ Foto sampel ditukar!');
    });
  });

  // HTML5 Interactive Eraser Canvas Drawing
  const eraserCanvas = document.getElementById('eraserDrawCanvas');
  let eraserCtx = null;
  let isDrawingBrush = false;
  let brushSize = 30;

  function initEraserCanvas() {
    if (!eraserCanvas) return;
    const rect = brushCanvasContainer.getBoundingClientRect();
    eraserCanvas.width = rect.width || 450;
    eraserCanvas.height = rect.height || 450;
    eraserCtx = eraserCanvas.getContext('2d');
    clearEraserCanvas();
  }

  function clearEraserCanvas() {
    if (!eraserCtx || !eraserCanvas) return;
    eraserCtx.clearRect(0, 0, eraserCanvas.width, eraserCanvas.height);
  }

  document.getElementById('btnClearCanvas')?.addEventListener('click', () => {
    clearEraserCanvas();
    playPopSound();
    showToast('🔄 Sapuan berus telah direset.');
  });

  document.getElementById('brushSizeSlider')?.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value, 10);
  });

  if (eraserCanvas) {
    eraserCanvas.addEventListener('mousedown', (e) => {
      isDrawingBrush = true;
      drawBrushStroke(e);
    });

    window.addEventListener('mouseup', () => {
      if (isDrawingBrush) {
        isDrawingBrush = false;
      }
    });

    eraserCanvas.addEventListener('mousemove', (e) => {
      if (isDrawingBrush) drawBrushStroke(e);
    });

    // Touch support for canvas
    eraserCanvas.addEventListener('touchstart', (e) => {
      isDrawingBrush = true;
      const touch = e.touches[0];
      drawBrushStroke(touch);
    });

    window.addEventListener('touchend', () => {
      isDrawingBrush = false;
    });

    eraserCanvas.addEventListener('touchmove', (e) => {
      if (isDrawingBrush && e.touches.length > 0) {
        drawBrushStroke(e.touches[0]);
      }
    });
  }

  function drawBrushStroke(e) {
    if (!eraserCtx || !eraserCanvas) return;
    const rect = eraserCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    eraserCtx.beginPath();
    eraserCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    eraserCtx.fillStyle = 'rgba(255, 46, 147, 0.55)'; // glowing pink highlighter
    eraserCtx.shadowColor = '#FF2E93';
    eraserCtx.shadowBlur = 10;
    eraserCtx.fill();
  }

  btnExecuteEraser?.addEventListener('click', () => {
    playSparkleSound();
    if (modeMagicEraser.classList.contains('active')) {
      showToast('🪄 Sedang memadam objek yang dipilih...', 'wand-2');
      setTimeout(() => {
        clearEraserCanvas();
        playSuccessSound();
        if (window.confetti) {
          window.confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        }
        showToast('✨ Objek berjaya dipadam dengan sempurna!', 'check');
      }, 900);
    } else {
      // Background remover celebration
      layerBefore.style.width = '0%';
      sliderHandle.style.left = '0%';
      playSuccessSound();
      showToast('✨ Latar belakang dibuang 100%!', 'check');
    }
  });

  // =========================================================
  // 10. TAB 3: MAGIC WRITE (COPYWRITING)
  // =========================================================
  const writeTopicInput = document.getElementById('writeTopicInput');
  const writeTypeSelect = document.getElementById('writeTypeSelect');
  const toneChips = document.querySelectorAll('.tone-chip');
  const btnGenerateCopy = document.getElementById('btnGenerateCopy');
  const magicWriteOutput = document.getElementById('magicWriteOutput');
  const btnCopyGeneratedText = document.getElementById('btnCopyGeneratedText');

  let selectedTone = 'ceria';

  toneChips.forEach(chip => {
    chip.addEventListener('click', () => {
      toneChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedTone = chip.getAttribute('data-tone');
      playPopSound();
    });
  });

  const copyTemplates = {
    ceria: {
      ig: `🍓✨ HARI YANG MANIS BERMULA DENGAN SATU HIRUPAN! ✨🍓\n\nPenat buat kerja seharian? Jom rehatkan minda dengan Boba Strawberry kami yang super berkrim dan manis buah asli! Gigitan mutiara boba yang lembut + strawberi segar memang bikin mood anda kembali ceria 100%! 🥰\n\nTag kawan anda yang wajib belanja anda harini! Siapa lambat kena bayar! 😜👇\n\n#SweetSipCafe #BobaStrawberry #MinumanViral #MoodBooster #CeriaSelalu #KakiMakan`,
      tiktok: `[HOOK]: "Korang pernah tak rasa boba strawberry yang sedap sampai teringat waktu tidur?! 😱🍓"\n\n[BODY]: Ha tengok ni guys, susu strawberi lemak manis, ditambah boba kenyal yang dimasak setiap pagi. Sekali sedut, terus hilang semua stres assignment / kerja korang!\n\n[CTA]: Ada diskaun 50% untuk korang yang datang harini! Jangan tunggu lagi, ajak bestie korang serbu sekarang jugak! 🔥🏃‍♂️💨`,
      promo: `ASSALAMUALAIKUM & SALAM CERIA! 🌸✨\n\nBerita gembira khas untuk peminat minuman manis! Hari ini kami nak bagi SPECIAL PROMO diskaun 50% untuk cawan kedua Boba Strawberry. Tekan link WhatsApp di bawah sekarang untuk tempah sebelum sold out! 👇📲`,
      quotes: `"Setiap hari adalah peluang baru untuk mencipta kenangan manis. Nikmati detik kecil yang membahagiakan, seperti secawan minuman kegemaran anda." 🌸✨`
    },
    hype: {
      ig: `🔥 GILAAA WEH! BOBA STRAWBERRY PALING VIRAL DAH KEMBALI! 🔥\n\nTak payah tunggu beratur panjang, harini stock baru drop panas-panas! Siapa yang belum cuba memang auto rugi teruk. Rasa strawberry dia padu beb, tak manis leting langsung!\n\nDrop emoji '🍓' kalau korang nak voucher RM10 sekarang! Terhad 50 orang terawal je! 🚀⚡\n\n#ViralMalaysia #BobaLover #TrendingNow #TikTokMadeMeBuyIt #HypeSquad`,
      tiktok: `[SCENE 1 - ZOOM CEPAT KE GELAS BOBA]: "STOP SCROLLING! Kalau korang tengah craving benda manis, video ni jawapan dia!"\n\n[SCENE 2]: "Ini bukan boba biasa-biasa, ini Boba Strawberry paling padu 2026!"\n\n[SCENE 3]: "Tengok link kat bio sekarang sebelum habis licin!" 🔥`,
      promo: `🚨 ALERT! OFFER GILA JIMAT 24 JAM SAHAJA! 🚨\n\nBeli 1 PERCUMA 1 Boba Strawberry hari ini! Jangan lepaskan peluang emas ni guys. Klik link sekarang sebelum promo tamat malam ni! 🏃‍♂️💨`,
      quotes: `"Jangan biar impian anda sekadar angan-angan. Bangkit, bertindak, dan cipta kejayaan luar biasa hari ini!" 🚀🔥`
    },
    pro: {
      ig: `Menyajikan Keseimbangan Rasa Sempurna Untuk Hari Anda.\n\nDi Sweet Sip Cafe, kami komited menggunakan buah strawberi segar tempatan yang dipadankan dengan susu berkualiti tinggi bagi memastikan setiap tegukan memberikan pengalaman rasa premium.\n\nKunjungi cawangan terdekat kami atau buat pesanan terus melalui aplikasi rasmi kami hari ini.\n\n#SweetSip #ArtisanBeverage #QualityFirst #RefreshingTaste #PremiumIngredients`,
      tiktok: `[PANDANGAN PROFESIONAL]: Mengapa bancuhan minuman artisan kami menjadi pilihan eksekutif muda di Kuala Lumpur?\n\nKualiti bahan segar, ketepatan formula rasa, dan keselesaan suasana. Cuba pengalaman hidangan istimewa ini hari ini.`,
      promo: `Salam sejahtera. Nikmati promosi korporat eksklusif daripada kami. Dapatkan tawaran istimewa untuk pesanan katering dan majlis pejabat anda. Hubungi pasukan kami untuk sebut harga rasmi.`,
      quotes: `"Kecemerlangan bukan sekadar tindakan, tetapi satu amalan yang berterusan. Fokus kepada kualiti, dan kejayaan akan menyusul." 💼`
    },
    santai: {
      ig: `Petang-petang redup macam ni, sedap layan boba strawberry sambil dengar lagu santai kan? 🎧🍓\n\nTakde apa yang lebih menenangkan selain angin sepoi-sepoi bahasa dan segelas ais sejuk. Jom lepak santai kat cafe harini, borak-borak kosong dengan geng korang. Santai je hidup ni. 😊\n\n#ChillVibes #PetangSantai #LepakCafe #BobaLife #RehatSebentar`,
      tiktok: `Aesthetic vlog petang santai: Bunyi ais berlagu, susu strawberi dituang perlahan... Tenang sangat rasa. Korang dah minum air manis harini belum? Jom lepak sekali! 🍃✨`,
      promo: `Hai korang! Kalau rasa nak minum santai petang ni, singgah la cafe kitorang. Ada diskaun santai untuk korang yang datang rileks-rileks. Jumpa kat sana! ☕🍰`,
      quotes: `"Tarik nafas dalam-dalam, lepaskan kepenatan. Hari esok pasti lebih baik dan cerah." 🍃`
    }
  };

  function typeWriterEffect(text, container, callback) {
    container.textContent = '';
    let i = 0;
    const speed = 12; // Fast & crisp typing
    function type() {
      if (i < text.length) {
        container.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  function generateMagicCopy() {
    playSparkleSound();
    const type = writeTypeSelect ? writeTypeSelect.value : 'ig';
    const toneSet = copyTemplates[selectedTone] || copyTemplates.ceria;
    const rawCopy = toneSet[type] || toneSet.ig;

    magicWriteOutput.innerHTML = '<span style="color: var(--canva-cyan)">🪄 Canva AI Magic Write sedang mengarang...</span>';

    setTimeout(() => {
      typeWriterEffect(rawCopy, magicWriteOutput, () => {
        playSuccessSound();
      });
    }, 300);
  }

  btnGenerateCopy?.addEventListener('click', generateMagicCopy);

  // Initial trigger for write tab
  generateMagicCopy();

  btnCopyGeneratedText?.addEventListener('click', () => {
    const text = magicWriteOutput.textContent || '';
    navigator.clipboard.writeText(text);
    playPopSound();
    showToast('📋 Kapsyen berjaya disalin!', 'check');
  });

  // =========================================================
  // 11. TAB 4: MAGIC SWITCH (MULTI-FORMAT & TRANSLATE)
  // =========================================================
  const formatCards = document.querySelectorAll('.format-card');
  const switchCanvasFrame = document.getElementById('switchCanvasFrame');
  const switchLangSelect = document.getElementById('switchLangSelect');
  const switchHeadline = document.getElementById('switchHeadline');
  const switchSub = document.getElementById('switchSub');
  const switchCtaBtn = document.getElementById('switchCtaBtn');

  formatCards.forEach(card => {
    card.addEventListener('click', () => {
      formatCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const format = card.getAttribute('data-format');
      playPopSound();

      // Reset classes
      switchCanvasFrame.className = 'switch-live-canvas';
      switchCanvasFrame.classList.add(format);
      showToast(`📐 Format ditukar kepada ${card.querySelector('strong').textContent}!`);
    });
  });

  const translations = {
    ms: {
      title: "Kenikmatan Strawberry Boba Paling Ceria!",
      sub: "Dapatkan sekarang dengan diskaun istimewa 50% di cawangan berhampiran.",
      cta: "Beli Sekarang 🍓"
    },
    en: {
      title: "The Most Joyful Strawberry Boba Experience!",
      sub: "Get yours now with an exclusive 50% discount at your nearest store.",
      cta: "Order Now 🍓"
    },
    ja: {
      title: "一番ハッピーなストロベリーボバ体験！",
      sub: "最寄りの店舗で限定50%オフで今すぐ手に入れよう。",
      cta: "今すぐ注文 🍓"
    },
    ar: {
      title: "تجربة بوبا الفراولة الأكثر بهجة وانتعاشاً!",
      sub: "احصل عليها الآن بخصم حصري 50% في أقرب فرع إليك.",
      cta: "اطلب الآن 🍓"
    }
  };

  switchLangSelect?.addEventListener('change', (e) => {
    const lang = e.target.value;
    const data = translations[lang] || translations.ms;
    playSparkleSound();
    if (switchHeadline) switchHeadline.textContent = data.title;
    if (switchSub) switchSub.textContent = data.sub;
    if (switchCtaBtn) switchCtaBtn.textContent = data.cta;
    showToast(`🌍 Magic Translate aktif: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // =========================================================
  // 12. MINI CANVA STUDIO POSTER CREATOR & EXPORT PNG
  // =========================================================
  const posterHeadlineInput = document.getElementById('posterHeadlineInput');
  const posterSubInput = document.getElementById('posterSubInput');
  const posterBadgeInput = document.getElementById('posterBadgeInput');
  const posterTitleDisplay = document.getElementById('posterTitleDisplay');
  const posterSubDisplay = document.getElementById('posterSubDisplay');
  const posterBadgeDisplay = document.getElementById('posterBadgeDisplay');
  const posterArtboard = document.getElementById('posterArtboard');
  const paletteCircles = document.querySelectorAll('.palette-circle');
  const stickersContainer = document.getElementById('stickersContainer');
  const btnExportPoster = document.getElementById('btnExportPoster');
  const btnResetPoster = document.getElementById('btnResetPoster');

  // Sync inputs to poster artboard
  posterHeadlineInput?.addEventListener('input', (e) => {
    posterTitleDisplay.textContent = e.target.value || 'TAJUK POSTER';
  });

  posterSubInput?.addEventListener('input', (e) => {
    posterSubDisplay.textContent = e.target.value || 'Subtajuk penerangan poster anda.';
  });

  posterBadgeInput?.addEventListener('input', (e) => {
    posterBadgeDisplay.textContent = e.target.value || 'PROMOSI';
  });

  // Color Palette switcher
  paletteCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      paletteCircles.forEach(c => c.classList.remove('active'));
      circle.classList.add('active');
      const gradKey = circle.getAttribute('data-grad');
      playPopSound();

      posterArtboard.className = 'poster-artboard';
      posterArtboard.classList.add(`${gradKey}-theme`);
    });
  });

  // Sticker Placement
  document.querySelectorAll('.btn-sticker').forEach(btn => {
    btn.addEventListener('click', () => {
      const stickerEmoji = btn.getAttribute('data-sticker');
      playPopSound();

      // Random position inside poster
      const top = Math.floor(Math.random() * 60) + 15;
      const left = Math.floor(Math.random() * 70) + 10;
      const rotate = Math.floor(Math.random() * 40) - 20;

      const stickerEl = document.createElement('span');
      stickerEl.className = 'placed-sticker';
      stickerEl.textContent = stickerEmoji;
      stickerEl.style.top = `${top}%`;
      stickerEl.style.left = `${left}%`;
      stickerEl.style.transform = `rotate(${rotate}deg)`;

      stickersContainer.appendChild(stickerEl);
      showToast(`Stiker ${stickerEmoji} ditampal!`);
    });
  });

  // Reset Poster
  btnResetPoster?.addEventListener('click', () => {
    playPopSound();
    posterHeadlineInput.value = 'JOM MINUM BOBA! 🎉';
    posterSubInput.value = 'Manis, Lemak, Segar & Penuh Magis Ceria!';
    posterBadgeInput.value = 'PROMOSI 50% HARI INI';
    posterTitleDisplay.textContent = 'JOM MINUM BOBA! 🎉';
    posterSubDisplay.textContent = 'Manis, Lemak, Segar & Penuh Magis Ceria!';
    posterBadgeDisplay.textContent = 'PROMOSI 50% HARI INI';

    stickersContainer.innerHTML = `
      <span class="placed-sticker" style="top: 15%; left: 10%;">✨</span>
      <span class="placed-sticker" style="top: 25%; right: 12%;">🍓</span>
      <span class="placed-sticker" style="bottom: 20%; left: 14%;">⭐</span>
    `;

    paletteCircles[0].click();
    showToast('🔄 Poster dikembalikan ke asal.');
  });

  // EXPORT POSTER TO PNG USING HTML5 CANVAS
  btnExportPoster?.addEventListener('click', () => {
    playSuccessSound();
    showToast('🎨 Canva AI sedang mengeksport poster resolusi tinggi...', 'download');

    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 1050;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background Gradient
    let grad;
    if (posterArtboard.classList.contains('cyber-theme')) {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#00C4CC');
      grad.addColorStop(1, '#7D2AE8');
    } else if (posterArtboard.classList.contains('berry-theme')) {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#8B3DFF');
      grad.addColorStop(1, '#FF2E93');
    } else if (posterArtboard.classList.contains('mint-theme')) {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#00F5A0');
      grad.addColorStop(1, '#00D9F5');
    } else if (posterArtboard.classList.contains('darkneon-theme')) {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#181926');
      grad.addColorStop(1, '#36174D');
    } else {
      // Sunset default
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#FF5E7E');
      grad.addColorStop(1, '#FFA03A');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Decorative ambient circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(100, 100, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - 80, height - 100, 240, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Badge
    const badgeText = posterBadgeDisplay.textContent || 'PROMOSI';
    ctx.font = 'bold 24px "Outfit", sans-serif';
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeWidth = badgeMetrics.width + 50;
    const badgeHeight = 46;
    const badgeX = (width - badgeWidth) / 2;
    const badgeY = 70;

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#0A0D17';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, width / 2, badgeY + 32);

    // 4. Draw Center Image
    const posterImg = document.getElementById('posterCenterImg');
    const imgSize = 360;
    const imgX = (width - imgSize) / 2;
    const imgY = 160;

    if (posterImg && posterImg.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(posterImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();

      // Border circle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 5. Draw Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 52px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 10;
    ctx.fillText(posterTitleDisplay.textContent || '', width / 2, 600);

    // 6. Draw Subtitle
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(posterSubDisplay.textContent || '', width / 2, 660);

    // 7. Draw Watermark
    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText('🪄 Dijana dengan Canva AI Magic Studio', width / 2, height - 40);

    // Trigger download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const dlLink = document.createElement('a');
      dlLink.href = dataUrl;
      dlLink.download = 'canva-ai-poster-ceria.png';
      dlLink.click();

      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });
      }
      showToast('🎉 Poster berjaya dimuat turun dalam format PNG!', 'check');
    }, 400);
  });

  // =========================================================
  // 13. FAQ ACCORDION LOGIC
  // =========================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      playPopSound();

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // =========================================================
  // 14. PROMPT VAULT COPY BUTTONS
  // =========================================================
  document.querySelectorAll('.btn-copy-vault').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyText = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(copyText);
      playPopSound();
      showToast('📋 Prompt disalin ke papan klip!', 'check');
    });
  });

  // =========================================================
  // 15. ADVANCED UI/UX & MOTION CONTROLLER
  // =========================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-links .nav-item[href^="#"]');
  const observedSections = [];

  navItems.forEach(item => {
    const targetId = item.getAttribute('href').substring(1);
    const section = document.getElementById(targetId);
    if (section) observedSections.push({ item, section });
  });

  // Handle Scroll Progress, Navbar Blur, Back to Top & ScrollSpy
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // 1. Reading Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Navbar Scrolled Glass State
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 30);
    }

    // 3. Back-to-Top Floating Button
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollTop > 320);
    }

    // 4. ScrollSpy Active Nav Item
    let currentActiveId = '';
    observedSections.forEach(({ section }) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentActiveId = section.id;
      }
    });

    if (currentActiveId) {
      navItems.forEach(item => {
        const href = item.getAttribute('href').substring(1);
        item.classList.toggle('active', href === currentActiveId);
      });
    }
  }, { passive: true });

  // Back to Top Action
  backToTopBtn?.addEventListener('click', () => {
    playPopSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll-Driven Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Dynamic Card Spotlight Mouse Tracker
  const spotlightCards = document.querySelectorAll('.card-spotlight');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // =========================================================
  // 16. 5 HASIL PEMBELAJARAN INTERACTIVE PROGRESS TRACKER
  // =========================================================
  const learningCards = document.querySelectorAll('.learning-card');
  const trackerFill = document.getElementById('learningTrackerFill');
  const trackerStatus = document.getElementById('learningTrackerStatus');
  const savedProgress = JSON.parse(localStorage.getItem('canva_learning_progress') || '{}');

  function updateLearningProgress(triggerCelebration = false) {
    let completedCount = 0;
    learningCards.forEach((card, idx) => {
      const moduleId = card.getAttribute('data-module') || `mod-${idx + 1}`;
      const isDone = !!savedProgress[moduleId];
      const toggleBtn = card.querySelector('.btn-toggle-complete');
      const toggleText = toggleBtn?.querySelector('span');
      const toggleIcon = toggleBtn?.querySelector('i');

      if (isDone) {
        card.classList.add('completed');
        completedCount++;
        if (toggleText) toggleText.textContent = 'Dikuasai ✅';
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'check-circle-2');
      } else {
        card.classList.remove('completed');
        if (toggleText) toggleText.textContent = 'Tandakan Selesai ⚪';
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'circle');
      }
    });

    const percent = Math.round((completedCount / learningCards.length) * 100) || 0;
    if (trackerFill) trackerFill.style.width = `${percent}%`;
    if (trackerStatus) {
      if (completedCount === learningCards.length && learningCards.length > 0) {
        trackerStatus.textContent = `🎉 5/5 Lengkap (100%) - Tahniah!`;
        trackerStatus.style.borderColor = '#00F5A0';
        trackerStatus.style.background = 'rgba(0, 245, 160, 0.2)';
      } else {
        trackerStatus.textContent = `${completedCount} / ${learningCards.length} Selesai (${percent}%)`;
      }
    }

    if (window.lucide) window.lucide.createIcons();

    if (triggerCelebration && completedCount === learningCards.length && learningCards.length > 0) {
      playSuccessSound();
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      showToast('🏆 Tahniah! Semua 5 Hasil Pembelajaran telah berjaya anda kuasai!', 'check-circle-2');
    }
  }

  // Bind checkbox buttons
  learningCards.forEach((card, idx) => {
    const moduleId = card.getAttribute('data-module') || `mod-${idx + 1}`;
    const toggleBtn = card.querySelector('.btn-toggle-complete');

    toggleBtn?.addEventListener('click', () => {
      savedProgress[moduleId] = !savedProgress[moduleId];
      localStorage.setItem('canva_learning_progress', JSON.stringify(savedProgress));
      playPopSound();
      updateLearningProgress(savedProgress[moduleId]);
      if (savedProgress[moduleId]) {
        showToast(`✨ Modul ${idx + 1} ditandakan sebagai dikuasai!`, 'check');
      }
    });
  });

  // Copy LLM Prompt button
  document.querySelectorAll('.btn-copy-llm').forEach(btn => {
    btn.addEventListener('click', () => {
      const promptEl = btn.parentElement.querySelector('.llm-prompt-text');
      const textToCopy = promptEl?.getAttribute('data-prompt') || promptEl?.textContent || '';
      navigator.clipboard.writeText(textToCopy.trim());
      playSparkleSound();
      showToast('🤖 Prompt LLM disalin! Tampal terus dalam ChatGPT / Gemini.', 'sparkles');
    });
  });

  // Initialize progress state
  updateLearningProgress(false);

  // Audio start listener for modern browser autoplay policies
  window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
  }, { once: true });
});
