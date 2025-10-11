// script.js

// المان‌ها
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

const userDisplay = document.getElementById('user-display');
const ceuDisplay = document.getElementById('ceu-display');
const logoutBtn = document.getElementById('logout-btn');
const viewFinalBtn = document.getElementById('view-final');

const pdfArea = document.getElementById('pdf-area');
const pdfFrame = document.getElementById('pdf-frame');
const downloadPass = document.getElementById('download-pass');
const downloadBtn = document.getElementById('download-btn');
const downloadMsg = document.getElementById('download-msg');

let currentUser = null;

// کمک: مقایسه نام کاربری case-insensitive
function findUserByUsername(name) {
  const trimmed = String(name || '').trim().toLowerCase();
  return userData.find(u => String(u.username || '').trim().toLowerCase() === trimmed);
}

// اگر سشن قبلی وجود دارد، بازسازی کن
function tryRestoreSession(){
  const saved = sessionStorage.getItem('loggedUser');
  if (saved) {
    try {
      const obj = JSON.parse(saved);
      const u = findUserByUsername(obj.username);
      if(u && u.password === obj.password){
        setCurrentUser(u);
      } else {
        sessionStorage.removeItem('loggedUser');
      }
    } catch(e){ sessionStorage.removeItem('loggedUser'); }
  }
}

// ست کردن کاربر حاضر و نمایش داشبورد
function setCurrentUser(user){
  currentUser = user;
  userDisplay.textContent = `${user.name} ${user.lastname}`;
  ceuDisplay.textContent = `CEU: ${user.ceuNumber || ''}`;
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  pdfArea.classList.add('hidden');
  loginError.textContent = '';
  // ذخیره در سشن
  sessionStorage.setItem('loggedUser', JSON.stringify({username: user.username, password: user.password}));
}

// خروج
logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('loggedUser');
  currentUser = null;
  dashboardView.classList.add('hidden');
  loginView.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
});

// رویداد لاگین
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const name = usernameInput.value.trim();
  const pass = passwordInput.value;

  if(!name || !pass){ loginError.textContent = 'لطفاً نام کاربری و رمز را وارد کنید.'; return; }

  const user = findUserByUsername(name);
  if(!user){ loginError.textContent = 'نام کاربری یافت نشد.'; return; }

  if(user.password !== pass){
    loginError.textContent = 'رمز عبور نادرست است.';
    return;
  }

  setCurrentUser(user);
});

// کلیک روی "نتیجه نهایی" — نمایش PDF داخل iframe
viewFinalBtn.addEventListener('click', () => {
  if(!currentUser){ alert('ابتدا وارد شوید'); return; }
  const pdfUrl = currentUser.links && currentUser.links.finalResult;
  if(!pdfUrl){ alert('فایل نتیجه برای این کاربر موجود نیست.'); return; }

  // نمایش iframe
  pdfFrame.src = pdfUrl;
  pdfArea.classList.remove('hidden');

  // خالی کردن ورودی دانلود
  downloadPass.value = '';
  downloadMsg.textContent = '';
});

// دانلود با چک رمز (استفاده از همان رمز لاگین)
downloadBtn.addEventListener('click', () => {
  if(!currentUser){ downloadMsg.textContent = 'ابتدا وارد شوید.'; return; }
  const entered = downloadPass.value;
  if(!entered){ downloadMsg.textContent = 'رمز دانلود را وارد کنید.'; return; }

  if(entered !== currentUser.password){
    downloadMsg.textContent = 'رمز دانلود نادرست است.';
    return;
  }

  // شروع دانلود: ایجاد لینک موقت و کلیک
  const pdfUrl = currentUser.links && currentUser.links.finalResult;
  if(!pdfUrl){ downloadMsg.textContent = 'فایل موجود نیست.'; return; }

  // ایجاد لینک دانلود
  const a = document.createElement('a');
  a.href = pdfUrl;
  // پیشنهاد نام فایل: ترکیب نام و ceu
  const safeName = `${(currentUser.name||'result')}_${(currentUser.ceuNumber||'file')}.pdf`;
  a.setAttribute('download', safeName);
  document.body.appendChild(a);
  a.click();
  a.remove();
  downloadMsg.style.color = 'green';
  downloadMsg.textContent = 'دانلود شروع شد.';
});

// اجرا در بارگذاری صفحه
tryRestoreSession();
