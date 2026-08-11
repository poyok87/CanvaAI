(() => {
  'use strict';
  const KEY = 'classroomLearningProgressV1';
  const answers = { q1: 'b', q2: 'a', q3: 'c' };
  const tasks = [...document.querySelectorAll('[data-task]')];
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const quizForm = document.getElementById('quizForm');

  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { tasks: [], answers: {}, quizScore: 0 }; }
    catch (_) { return { tasks: [], answers: {}, quizScore: 0 }; }
  };
  let state = load();
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const updateProgress = () => {
    const lessonCount = 6;
    const quizPoints = state.quizScore || 0;
    const done = lessonCount + state.tasks.length + quizPoints;
    const total = 14;
    const percent = Math.round(done / total * 100);
    document.getElementById('progressText').textContent = `${percent}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressDetail').textContent = `${done} daripada ${total} aktiviti selesai`;
  };
  tasks.forEach(input => {
    input.checked = state.tasks.includes(input.dataset.task);
    input.addEventListener('change', () => {
      state.tasks = tasks.filter(item => item.checked).map(item => item.dataset.task);
      save(); updateProgress();
    });
  });
  Object.entries(state.answers || {}).forEach(([name, value]) => {
    const input = quizForm.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  });
  quizForm.addEventListener('submit', event => {
    event.preventDefault();
    let score = 0;
    const selected = {};
    Object.entries(answers).forEach(([name, answer]) => {
      const choice = quizForm.querySelector(`input[name="${name}"]:checked`);
      const fieldset = quizForm.querySelector(`[data-question="${name}"]`);
      fieldset.classList.remove('correct', 'incorrect');
      if (choice) selected[name] = choice.value;
      if (choice && choice.value === answer) { score++; fieldset.classList.add('correct'); }
      else fieldset.classList.add('incorrect');
    });
    state.answers = selected; state.quizScore = score; save(); updateProgress();
    const result = document.getElementById('quizResult');
    result.textContent = score === 3 ? 'Hebat! Anda mendapat 3/3. Semua jawapan betul.' : `Skor anda: ${score}/3. Semak soalan bertanda merah dan cuba lagi.`;
    result.classList.add('show');
  });
  const closeMenu = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open'); overlay.classList.toggle('show', open); menuBtn.setAttribute('aria-expanded', String(open));
  });
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', closeMenu));
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-30% 0px -60%' });
    sections.forEach(section => observer.observe(section));
  }
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Tetapkan semula semua checklist dan jawapan kuiz?')) return;
    localStorage.removeItem(KEY); location.reload();
  });
  updateProgress();
})();
