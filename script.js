document.addEventListener('DOMContentLoaded', function() {
  console.log('EL LEARN - COMPLETE WITH HINT SYSTEM');
  
  // Elements
  function getEl(id) {
    return document.getElementById(id);
  }
  
  const els = {
    loginPage: getEl('login-page'),
    dashboardPage: getEl('dashboard-page'),
    loginForm: getEl('login-form'),
    usernameInput: getEl('username-input'),
    userProfile: getEl('user-profile') || document.querySelector('.user-profile'),
    userName: getEl('user-name'),
    dashboardUser: getEl('dashboard-user'),
    sideUserName: getEl('side-user-name'),
    logoutBtn: getEl('logout-btn') || document.querySelector('.logout-btn'),
    sideLogout: getEl('side-logout'),
    hamburgerBtn: getEl('hamburger-menu'),
    sideDashboard: getEl('side-dashboard'),
    closeMenu: getEl('close-menu'),
    themeToggle: getEl('theme-toggle'),
    progressFill: getEl('progress-fill'),
    progressText: getEl('progress-text'),
    xpCurrent: getEl('xp-current'),
    xpFill: getEl('xp-fill'),
    streakCount: getEl('streak-count'),
    jenjangText: getEl('jenjang-text'),
    kelasText: getEl('kelas-text'),
    stageText: getEl('stage-text'),
    sideXp: getEl('side-xp'),
    sideJenjang: getEl('side-jenjang'),
    materiJudul: getEl('materi-judul'),
    materiIsi: getEl('materi-isi'),
    materiLogika: getEl('materi-logika'),
    materiHint: getEl('materi-hint'),
    materiBingung: getEl('materi-bingung'),
    pahamBtn: getEl('paham-btn'),
    // hintBtn: getEl('hint-btn'), // moved to ujian
    // xpLock: getEl('xp-lock'), // moved to ujian
    body: document.body
  };

  // Storage
  const STORAGE = {
    USERNAME: 'ellearn_username',
    PROGRESS: 'ellearn_progress',
    XP: 'ellearn_xp',
    STREAK: 'ellearn_streak',
    LAST_LOGIN: 'ellearn_last_login'
  };
  const MATERI_KEY = 'MATERI_EL_LEARN';
  
  let materiData = [];

  // ===== DASHBOARD =====
  function showDashboard(username) {
    console.log('✅ DASHBOARD:', username);
    els.loginPage.style.display = 'none';
    els.dashboardPage.style.display = 'block';
    els.userProfile.style.display = 'flex';
    els.userName.textContent = username;
    els.dashboardUser.textContent = username;
    els.sideUserName.textContent = username;
    
    localStorage.setItem(STORAGE.USERNAME, username);
    loadMateri();
    updateStats();
    updateHintLock();
  }

  function showLogin() {
    els.loginPage.style.display = 'flex';
    els.dashboardPage.style.display = 'none';
    els.userProfile.style.display = 'none';
  }

  // Login
  els.loginForm.onsubmit = function(e) {
    e.preventDefault();
    const name = els.usernameInput.value.trim();
    if (name.length >= 2) {
      localStorage.setItem(STORAGE.USERNAME, name);
      
      // New user? Give 75 XP bonus
      const existingXP = localStorage.getItem(STORAGE.XP);
      if (!existingXP || parseInt(existingXP) === 0) {
        localStorage.setItem(STORAGE.XP, '75');
        console.log('🎁 New user bonus: 75 XP!');
      }
      
      showDashboard(name);
      els.usernameInput.value = '';
    } else {
      alert('Nama minimal 2 huruf');
    }
  };

  // Auto login
  if (localStorage.getItem(STORAGE.USERNAME)) {
    showDashboard(localStorage.getItem(STORAGE.USERNAME));
  }

  // Logout - Full reset for new account
  function logout() {
    // Clear all user data for fresh start
    localStorage.removeItem(STORAGE.USERNAME);
    localStorage.removeItem(STORAGE.PROGRESS);
    localStorage.removeItem(STORAGE.XP);
    localStorage.removeItem(STORAGE.STREAK);
    localStorage.removeItem(STORAGE.LAST_LOGIN);
    localStorage.removeItem('ellearn_scores'); // ujian scores
    showLogin();
    console.log('🔄 Full reset - ready for new account');
  }
  if (els.logoutBtn) els.logoutBtn.onclick = logout;
  els.sideLogout.onclick = logout;

  // Menu toggle
  function toggleSide() {
    els.sideDashboard.classList.toggle('active');
    document.querySelector('.side-overlay')?.classList.toggle('active');
    els.hamburgerBtn.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }
  els.hamburgerBtn.onclick = toggleSide;
  els.closeMenu.onclick = toggleSide;

  // Theme
  els.themeToggle.onclick = () => {
    document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  };

  // ===== STATS =====
  function updateStats() {
    const progress = parseInt(localStorage.getItem(STORAGE.PROGRESS) || '0');
    const xp = parseInt(localStorage.getItem(STORAGE.XP) || '0');
    
    const jenjang = ['SD', 'SMP', 'SMA'][Math.floor(progress / 60)] || 'SD';
    const kelas = Math.floor((progress % 60) / 5) + 1;
    const stage = (progress % 5) + 1;
    
    els.jenjangText.textContent = jenjang;
    els.kelasText.textContent = kelas;
    els.stageText.textContent = stage;
    els.progressFill.style.width = `${Math.min(progress / 180 * 100, 100)}%`;
    els.progressText.textContent = `${Math.round(progress / 180 * 100)}%`;
    els.xpCurrent.textContent = xp;
    els.xpFill.style.width = `${Math.min((xp % 300) / 300 * 100, 100)}%`;
    els.sideXp.textContent = xp;
    els.sideJenjang.textContent = jenjang;
  }

  // ===== HINT SYSTEM =====
  window.showHint = function() {
    const xp = parseInt(localStorage.getItem(STORAGE.XP) || '0');
    if (xp < 25) {
      els.xpLock.style.display = 'inline';
      alert('XP kurang! Butuh 25 XP untuk petunjuk 💰');
      return;
    }
    
    const progress = parseInt(localStorage.getItem(STORAGE.PROGRESS) || '0');
    const id = window.getCurrentStage();
    const current = materiData.materi?.find(m => m.id === id);
    
    if (current && current.hint_soal) {
      localStorage.setItem(STORAGE.XP, (xp - 25).toString());
      alert('💡 PETUNJUK:\n\n' + current.hint_soal);
      updateStats();
      updateHintLock();
    } else {
      alert('Petunjuk belum tersedia di materi ini.');
    }
  };

  function updateHintLock() {
    const xp = parseInt(localStorage.getItem(STORAGE.XP) || '0');
    if (els.xpLock) {
      els.xpLock.style.display = xp < 25 ? 'inline' : 'none';
    }
  }

  // ===== MATERI LOAD =====
  async function loadMateri() {
    console.log('📚 Loading materi...');
    
    let data = localStorage.getItem(MATERI_KEY);
    if (data) {
      try {
        materiData = JSON.parse(data);
        console.log('✅ Admin data:', materiData.materi?.length);
      } catch (e) {
        console.error('Admin data error:', e);
      }
    }
    
    if (!materiData.materi || materiData.materi.length === 0) {
      try {
        const res = await fetch('data.json');
        materiData = await res.json();
        localStorage.setItem(MATERI_KEY, JSON.stringify(materiData));
      } catch (e) {
        console.error('Data.json error:', e);
        materiData = {materi: []};
      }
    }
    
    renderMateri();
  }

  window.getCurrentStage = function() {
    const progress = parseInt(localStorage.getItem(STORAGE.PROGRESS) || '0');
    return `sd-k${Math.floor((progress % 60) / 5) + 1}-s${(progress % 5) + 1}`;
  };

  function renderMateri() {
    const progress = parseInt(localStorage.getItem(STORAGE.PROGRESS) || '0');
    const id = getCurrentStage();
    
    const current = materiData.materi?.find(m => m.id === id);
    if (current) {
      els.materiJudul.textContent = current.judul;
      els.materiIsi.innerHTML = current.isi_materi || 'Loading...';
      
      els.materiLogika.textContent = current.penjelasan_logika || '';
      els.materiHint.textContent = current.hint_soal || 'Tidak ada petunjuk';
      els.materiBingung.textContent = current.bingung_dimana || '';
      
      // KaTeX render
      if (typeof katex !== 'undefined') {
        katex.renderMathInElement(els.materiIsi);
        katex.renderMathInElement(els.materiLogika);
      }
    } else {
      els.materiJudul.textContent = 'Materi belum tersedia';
      els.materiIsi.textContent = 'Tambahkan dari Admin Panel';
    }
  }

  // ===== PAHAM UJIAN =====
  window.startUjian = function() {
    console.log('PAHAM → UJIAN');
    const id = getCurrentStage();
    window.location.href = `ujian.html?stage=${id}`;
  };

  // PAHAM listener
  setInterval(() => {
    const btn = getEl('paham-btn');
    if (btn && !btn.onclick && typeof window.startUjian === 'function') {
      btn.onclick = startUjian;
      console.log('PAHAM ready');
    }
  }, 500);

  // ===== INIT =====
  updateStreak();
  updateStats();
  loadMateri();
  
  function updateStreak() {
    const today = new Date().toDateString();
    let streak = parseInt(localStorage.getItem(STORAGE.STREAK)) || 0;
    if (localStorage.getItem(STORAGE.LAST_LOGIN) !== today) {
      streak = 1;
      localStorage.setItem(STORAGE.STREAK, '1');
      localStorage.setItem(STORAGE.LAST_LOGIN, today);
    }
    els.streakCount.textContent = streak;
  }

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
});
