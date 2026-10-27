/* =========================================================
   FORMULA 1 THEME DASHBOARD - INTERACTIVE CONTROLLER
   Presentation Mode, Smart Interactive Filters & Audio Chimes
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // =========================================================
  // 2. WEB AUDIO SYNTHESIZER
  // =========================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPop() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  function playSuccess() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.04);
        osc.stop(audioCtx.currentTime + idx * 0.04 + 0.36);
      });
    } catch (e) {}
  }

  // Sound Toggle Control
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  soundToggleBtn?.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      soundIcon.setAttribute('data-lucide', 'volume-2');
      showToast('🔊 Bunyi ceria F1 diaktifkan!');
      playPop();
    } else {
      soundIcon.setAttribute('data-lucide', 'volume-x');
      showToast('🔇 Bunyi dimatikan.');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // =========================================================
  // 3. THEME TOGGLE
  // =========================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('canva_theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('canva_theme', theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
  }
  applyTheme(savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    playPop();
  });

  // Toast Helper
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
  // 4. AUDIENCE VIEW TOGGLE (EXECUTIVE VS STAFF)
  // =========================================================
  const btnViewExecutive = document.getElementById('btnViewExecutive');
  const btnViewStaff = document.getElementById('btnViewStaff');
  const executiveSection = document.getElementById('executiveViewZone');
  const staffSection = document.getElementById('staffViewZone');

  btnViewExecutive?.addEventListener('click', () => {
    btnViewExecutive.classList.add('active');
    btnViewStaff?.classList.remove('active');
    if (executiveSection) executiveSection.style.display = 'block';
    if (staffSection) staffSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    playPop();
    showToast('👔 Mod Paparan Pengurusan (Helicopter View) aktif!');
  });

  btnViewStaff?.addEventListener('click', () => {
    btnViewStaff.classList.add('active');
    btnViewExecutive?.classList.remove('active');
    if (staffSection) staffSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playPop();
    showToast('👥 Mod Perincian Kakitangan (Staff Drilldown) aktif!');
  });

  // =========================================================
  // 5. INTERACTIVE MULTI-LEVEL SMART FILTERS
  // =========================================================
  let currentDeptFilter = 'all';
  let currentQuarterFilter = 'all';
  let currentStatusFilter = 'all';

  const deptPills = document.querySelectorAll('[data-filter-dept]');
  const quarterPills = document.querySelectorAll('[data-filter-quarter]');
  const statusPills = document.querySelectorAll('[data-filter-status]');
  const tableRows = document.querySelectorAll('#f1StaffTableBody tr');
  const countDisplay = document.getElementById('filteredRowCount');

  function applyFilters() {
    let visibleCount = 0;

    tableRows.forEach(row => {
      const dept = row.getAttribute('data-dept') || 'all';
      const quarter = row.getAttribute('data-quarter') || 'all';
      const status = row.getAttribute('data-status') || 'all';

      const matchDept = currentDeptFilter === 'all' || dept === currentDeptFilter;
      const matchQuarter = currentQuarterFilter === 'all' || quarter === currentQuarterFilter;
      const matchStatus = currentStatusFilter === 'all' || status === currentStatusFilter;

      if (matchDept && matchQuarter && matchStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countDisplay) countDisplay.textContent = visibleCount;

    // Dynamically adjust KPI numbers based on active department
    updateDynamicKpis(currentDeptFilter, visibleCount);
  }

  function updateDynamicKpis(dept, count) {
    const kpiScore = document.getElementById('kpiSpeedScore');
    const kpiRev = document.getElementById('kpiRevenueVal');
    const kpiEff = document.getElementById('kpiEfficiencyVal');
    const kpiProj = document.getElementById('kpiProjectsDone');
    const gaugeText = document.getElementById('gaugeSpeedNum');

    if (dept === 'operasi') {
      if (kpiScore) kpiScore.textContent = '94.8%';
      if (gaugeText) gaugeText.textContent = '94.8%';
      if (kpiRev) kpiRev.textContent = 'RM 2.10M';
      if (kpiEff) kpiEff.textContent = '97.2%';
      if (kpiProj) kpiProj.textContent = '14 / 15';
    } else if (dept === 'it') {
      if (kpiScore) kpiScore.textContent = '91.2%';
      if (gaugeText) gaugeText.textContent = '91.2%';
      if (kpiRev) kpiRev.textContent = 'RM 1.45M';
      if (kpiEff) kpiEff.textContent = '93.5%';
      if (kpiProj) kpiProj.textContent = '10 / 12';
    } else if (dept === 'pemasaran') {
      if (kpiScore) kpiScore.textContent = '96.5%';
      if (gaugeText) gaugeText.textContent = '96.5%';
      if (kpiRev) kpiRev.textContent = 'RM 3.20M';
      if (kpiEff) kpiEff.textContent = '98.1%';
      if (kpiProj) kpiProj.textContent = '18 / 19';
    } else if (dept === 'hr') {
      if (kpiScore) kpiScore.textContent = '89.0%';
      if (gaugeText) gaugeText.textContent = '89.0%';
      if (kpiRev) kpiRev.textContent = 'RM 850K';
      if (kpiEff) kpiEff.textContent = '91.0%';
      if (kpiProj) kpiProj.textContent = '8 / 9';
    } else {
      // Default All
      if (kpiScore) kpiScore.textContent = '92.4%';
      if (gaugeText) gaugeText.textContent = '92.4%';
      if (kpiRev) kpiRev.textContent = 'RM 4.85M';
      if (kpiEff) kpiEff.textContent = '95.8%';
      if (kpiProj) kpiProj.textContent = '38 / 42';
    }
  }

  // Dept Pill clicks
  deptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      deptPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDeptFilter = pill.getAttribute('data-filter-dept');
      playPop();
      applyFilters();
    });
  });

  // Quarter Pill clicks
  quarterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      quarterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentQuarterFilter = pill.getAttribute('data-filter-quarter');
      playPop();
      applyFilters();
    });
  });

  // Status Pill clicks
  statusPills.forEach(pill => {
    pill.addEventListener('click', () => {
      statusPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentStatusFilter = pill.getAttribute('data-filter-status');
      playPop();
      applyFilters();
    });
  });

  // =========================================================
  // 6. COPY BUTTONS (MASTER PROMPT & SCENARIOS)
  // =========================================================
  document.querySelectorAll('.btn-copy-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      let copyText = '';
      if (btn.hasAttribute('data-copy')) {
        copyText = btn.getAttribute('data-copy');
      } else if (btn.hasAttribute('data-copy-target')) {
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) copyText = targetEl.textContent.trim();
      }

      if (copyText) {
        navigator.clipboard.writeText(copyText);
        playSuccess();
        if (window.confetti) {
          window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
        }
        showToast('📋 Arahan Formula 1 Dashboard disalin! Sedia untuk Canva AI.', 'check');
      }
    });
  });

  // Fullscreen Presentation Mode Toggle
  document.getElementById('btnToggleFullscreen')?.addEventListener('click', () => {
    const frame = document.getElementById('f1LiveDashboardFrame');
    if (!document.fullscreenElement) {
      if (frame?.requestFullscreen) {
        frame.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      showToast('🖥️ Mod Skrin Penuh Aktif untuk Pembentangan!');
      playSuccess();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Export Table to CSV
  document.getElementById('btnExportF1Csv')?.addEventListener('click', () => {
    playSuccess();
    const rows = document.querySelectorAll('.f1-data-table tr');
    let csv = [];
    rows.forEach(row => {
      if (row.style.display === 'none') return; // only export visible
      let rowData = [];
      const cols = row.querySelectorAll('th, td');
      cols.forEach(col => {
        let text = col.innerText.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
        rowData.push(`"${text.trim()}"`);
      });
      csv.push(rowData.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'f1_dashboard_presentation_data.csv';
    link.click();
    showToast('💾 Fail data pembentangan berjaya dieksport ke CSV!');
  });

  // UI/UX & Motion Polish for F1 Dashboard
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) scrollProgressBar.style.width = `${scrollPercent}%`;
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 30);
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollTop > 320);
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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
});
