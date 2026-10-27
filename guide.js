/* =========================================================
   CANVA SHEET PRO - APPLICATION LOGIC
   Native Canva Sheet Management, 10-System Interactive Filter,
   Clipboard Copier & Live Canva Tables Simulator
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
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, audioCtx.currentTime + 0.08);
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
      showToast('🔊 Bunyi ceria diaktifkan!');
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
  // 4. 10 SYSTEMS CATEGORY FILTER
  // =========================================================
  const filterChips = document.querySelectorAll('.filter-chip');
  const systemCards = document.querySelectorAll('.system-item-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      playPop();

      systemCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================
  // 5. COPY BUTTONS (CHIPS & PROMPTS)
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
          window.confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
        }
        showToast('📋 Berjaya disalin! Sedia untuk ditampal ke Canva Sheet.', 'check');
      }
    });
  });

  // Step 1 Values Prompt Copy
  document.getElementById('btnCopyStep1ValuesPrompt')?.addEventListener('click', () => {
    const textEl = document.getElementById('step1ValuesPromptText');
    if (textEl) {
      navigator.clipboard.writeText(textEl.textContent.trim());
      playSuccess();
      showToast('📋 Nilai Langkah 1 berjaya disalin!', 'check');
    }
  });

  // =========================================================
  // 6. LIVE CANVA SHEET SIMULATOR
  // =========================================================
  const attendanceDemoForm = document.getElementById('attendanceDemoForm');
  const inputStudentId = document.getElementById('inputStudentId');
  const inputStudentName = document.getElementById('inputStudentName');
  const inputClass = document.getElementById('inputClass');
  const inputDate = document.getElementById('inputDate');
  const inputTime = document.getElementById('inputTime');
  const inputNotes = document.getElementById('inputNotes');
  const simSheetBody = document.getElementById('simSheetBody');
  const statHadirCount = document.getElementById('statHadirCount');
  const statusButtons = document.querySelectorAll('.sim-status-btn');

  let selectedStatus = 'Hadir / Selesai';

  // Set today's date & time
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  if (inputDate) inputDate.value = todayStr;

  function updateTime() {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    if (inputTime) inputTime.value = timeStr;
  }
  updateTime();

  // Status button selection
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStatus = btn.getAttribute('data-status');
      playPop();
    });
  });

  function updateSheetCount() {
    if (!simSheetBody) return;
    const rows = simSheetBody.querySelectorAll('tr').length;
    if (statHadirCount) statHadirCount.textContent = rows;
  }

  // Handle Form Submission into Canva Sheet
  attendanceDemoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    playSuccess();

    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hr = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    const sec = d.getSeconds().toString().padStart(2, '0');
    const timestampStr = `${day}/${month}/${year} ${hr}:${min}:${sec}`;

    const refId = inputStudentId?.value.trim() || 'ENT-001';
    const name = inputStudentName?.value.trim() || 'Pengguna Baru';
    const cat = inputClass?.value || 'Umum';
    const recDate = inputDate?.value || todayStr;
    const recTime = inputTime?.value || '07:30 AM';
    const notes = inputNotes?.value.trim() || '-';

    let statusPillClass = 'hadir';
    if (selectedStatus.includes('Tindakan') || selectedStatus.includes('Lewat')) statusPillClass = 'lewat';
    else if (selectedStatus.includes('Batal') || selectedStatus.includes('Tidak')) statusPillClass = 'tidak';
    else if (selectedStatus.includes('Khas') || selectedStatus.includes('Bersebab')) statusPillClass = 'sebab';

    const rowCount = simSheetBody.querySelectorAll('tr').length + 1;

    const newTr = document.createElement('tr');
    newTr.className = 'sheet-row newly-added-row';
    newTr.innerHTML = `
      <td class="row-index">${rowCount}</td>
      <td>${timestampStr}</td>
      <td>${refId}</td>
      <td><strong>${name}</strong></td>
      <td>${cat}</td>
      <td>${recDate}</td>
      <td>${recTime}</td>
      <td><span class="pill-status ${statusPillClass}">${selectedStatus}</span></td>
      <td>${notes}</td>
      <td>Canva Form</td>
    `;

    simSheetBody.appendChild(newTr);
    updateSheetCount();

    // Scroll sheet to bottom
    const scrollContainer = document.querySelector('.sheet-grid-scroll');
    if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;

    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }

    showToast(`✨ Rekod ${name} berjaya disimpan ke Canva Sheet!`, 'check');

    // Reset input for next test
    const numPart = parseInt(refId.replace(/\D/g, ''), 10) || 28;
    inputStudentId.value = `PEL-5C-0${numPart + 1}`;
    inputStudentName.value = '';
    inputNotes.value = '';
    inputStudentName.focus();
  });

  // Export Canva Sheet to CSV
  document.getElementById('btnSimDownloadCsv')?.addEventListener('click', () => {
    playSuccess();
    const rows = document.querySelectorAll('#simSheetTable tr');
    let csv = [];
    rows.forEach(row => {
      let rowData = [];
      const cols = row.querySelectorAll('th, td');
      cols.forEach((col, idx) => {
        if (idx === 0) return; // skip row number
        let text = col.innerText.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
        rowData.push(`"${text.trim()}"`);
      });
      csv.push(rowData.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'canva_sheet_database_records.csv';
    link.click();
    showToast('💾 Fail Canva Sheet berjaya dieksport ke CSV!');
  });

  // Reset Canva Sheet
  document.getElementById('btnSimResetSheet')?.addEventListener('click', () => {
    playPop();
    simSheetBody.innerHTML = `
      <tr class="sheet-row">
        <td class="row-index">1</td>
        <td>26/10/2026 07:15:10</td>
        <td>PEL-5C-001</td>
        <td>Aisyah Binti Razali</td>
        <td>5 Cemerlang</td>
        <td>2026-10-26</td>
        <td>07:15 AM</td>
        <td><span class="pill-status hadir">Hadir</span></td>
        <td>-</td>
        <td>Cikgu Roslan</td>
      </tr>
      <tr class="sheet-row">
        <td class="row-index">2</td>
        <td>26/10/2026 07:18:45</td>
        <td>PEL-5C-005</td>
        <td>Wei Liong Chan</td>
        <td>5 Cemerlang</td>
        <td>2026-10-26</td>
        <td>07:18 AM</td>
        <td><span class="pill-status hadir">Hadir</span></td>
        <td>-</td>
        <td>Cikgu Roslan</td>
      </tr>
      <tr class="sheet-row">
        <td class="row-index">3</td>
        <td>26/10/2026 07:21:02</td>
        <td>PEL-5C-012</td>
        <td>Kavin Murugan</td>
        <td>5 Cemerlang</td>
        <td>2026-10-26</td>
        <td>07:21 AM</td>
        <td><span class="pill-status hadir">Hadir</span></td>
        <td>-</td>
        <td>Cikgu Roslan</td>
      </tr>
    `;
    updateSheetCount();
    showToast('🔄 Canva Sheet dikembalikan ke rekod asal.');
  });

  // UI/UX & Motion Polish for Canva Sheet Pro
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
