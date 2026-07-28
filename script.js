// CONFIG
window.PASSWORD = "04082008"; // Set her password here

// ---------- CORE FUNCTIONS ----------
function spawnParticles(containerId, count){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = "";
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    const size = 2 + Math.random()*4;
    p.style.width = size+'px'; p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = (8+Math.random()*10)+'s';
    p.style.animationDelay = (Math.random()*10)+'s';
    el.appendChild(p);
  }
}

function goTo(id){
  const target = document.getElementById(id);
  if(!target) return;
  document.querySelectorAll('.stage').forEach(s=>s.classList.remove('active'));
  target.classList.add('active');
}

// ---------- APP INITIALIZATION (DATE LOGIC) ----------
function initApp() {
  const now = new Date();
  const year = now.getFullYear();
  
  // Month 7 = August (0-indexed months)
  window.ANNIVERSARY = new Date(year, 7, 3, 0, 0, 0); 
  window.BIRTHDAY = new Date(year, 7, 4, 0, 0, 0);    
  
  const aug3 = new Date(year, 7, 3);
  const aug4 = new Date(year, 7, 4);
  
  if (now >= aug4) {
    goTo('menu');
    initMenuButtons();
  } else if (now >= aug3 && now < aug4) {
    goTo('anniversary');
    initAnniversaryButton();
    initScratchCard();
  } else {
    goTo('anni-countdown');
    startAnniCountdown();
  }
}

function initMenuButtons() {
  document.getElementById('menuAnniBtn').addEventListener('click', () => {
    goTo('anniversary');
    initAnniversaryButton();
    initScratchCard();
  });
  document.getElementById('menuBdayBtn').addEventListener('click', () => {
    goTo('countdown');
    startBirthdayCountdown();
  });
}

function initAnniversaryButton() {
  const btn = document.getElementById('goToBirthdayBtn');
  if(!btn) return;
  btn.onclick = () => {
    goTo('countdown');
    startBirthdayCountdown();
  };
}

// ---------- ANNIVERSARY COUNTDOWN ----------
function tickAnniCountdown(){
  const days = document.getElementById('ac-d');
  const hours = document.getElementById('ac-h');
  const minutes = document.getElementById('ac-m');
  const seconds = document.getElementById('ac-s');
  if(!days || !hours || !minutes || !seconds) return;

  const now = new Date();
  let diff = window.ANNIVERSARY - now;
  if(diff <= 0){
    days.textContent='00'; hours.textContent='00';
    minutes.textContent='00'; seconds.textContent='00';
    
    const anniCountdown = document.getElementById('anni-countdown');
    if(anniCountdown && anniCountdown.classList.contains('active')){
      setTimeout(()=>{
        goTo('anniversary');
        initAnniversaryButton();
        initScratchCard();
      }, 1400);
    }
    return;
  }
  const d = Math.floor(diff/86400000); diff -= d*86400000;
  const h = Math.floor(diff/3600000); diff -= h*3600000;
  const m = Math.floor(diff/60000); diff -= m*60000;
  const s = Math.floor(diff/1000);
  days.textContent = String(d).padStart(2,'0');
  hours.textContent = String(h).padStart(2,'0');
  minutes.textContent = String(m).padStart(2,'0');
  seconds.textContent = String(s).padStart(2,'0');
}

function startAnniCountdown() {
  if(!document.getElementById('anni-countdown')) return;
  tickAnniCountdown();
  setInterval(tickAnniCountdown, 1000);
}

// ---------- BIRTHDAY COUNTDOWN ----------
function tickBirthdayCountdown(){
  const days = document.getElementById('cd-d');
  const hours = document.getElementById('cd-h');
  const minutes = document.getElementById('cd-m');
  const seconds = document.getElementById('cd-s');
  if(!days || !hours || !minutes || !seconds) return;

  const now = new Date();
  let diff = window.BIRTHDAY - now;
  if(diff <= 0){
    days.textContent='00'; hours.textContent='00';
    minutes.textContent='00'; seconds.textContent='00';
    const gateHint = document.getElementById('gateHint');
    if(gateHint) gateHint.innerHTML = "It's her birthday. Enter the password below.";
    
    const countdown = document.getElementById('countdown');
    if(countdown && countdown.classList.contains('active')){
      setTimeout(()=>{
        goTo('gate');
        const input = document.getElementById('pwInput');
        if(input) input.focus();
      }, 1400);
    }
    return;
  }
  const d = Math.floor(diff/86400000); diff -= d*86400000;
  const h = Math.floor(diff/3600000); diff -= h*3600000;
  const m = Math.floor(diff/60000); diff -= m*60000;
  const s = Math.floor(diff/1000);
  days.textContent = String(d).padStart(2,'0');
  hours.textContent = String(h).padStart(2,'0');
  minutes.textContent = String(m).padStart(2,'0');
  seconds.textContent = String(s).padStart(2,'0');
}

function startBirthdayCountdown() {
  if(!document.getElementById('countdown')) return;
  tickBirthdayCountdown();
  setInterval(tickBirthdayCountdown, 1000);
}

// ---------- GATE (LOCKSCREEN) ----------
function initGate(){
  const unlockBtn = document.getElementById('unlockBtn');
  const pwInput = document.getElementById('pwInput');
  if(!unlockBtn || !pwInput) return;
  unlockBtn.addEventListener('click', tryUnlock);
  pwInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryUnlock(); });
}

function tryUnlock(){
  const input = document.getElementById('pwInput');
  const msg = document.getElementById('gateMsg');
  const card = document.querySelector('#gate .card');
  if(!input || !msg) return;
  const val = input.value.trim();
  
  if(val === window.PASSWORD){
    msg.style.color = 'var(--orange)';
    msg.textContent = 'Hehehe...';
    setTimeout(()=>{ 
      goTo('opening'); 
      startOpeningSequence();
    }, 800);
  } else {
    msg.style.color = 'var(--pink)';
    msg.textContent = "TF,how did you get that wrong!! 😭";
    input.value='';
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
  }
}

// ---------- OPENING ----------
function startOpeningSequence(){
  const ln1 = document.getElementById('ln1');
  const ln2 = document.getElementById('ln2');
  setTimeout(()=> ln1.classList.add('show'), 1000);
  setTimeout(()=> ln1.classList.remove('show'), 4000);
  setTimeout(()=> ln2.classList.add('show'), 4700);
  setTimeout(()=> ln2.classList.remove('show'), 7400);
  setTimeout(()=> goTo('unlocked'), 8100);
}

// ---------- SCRATCH CARD ----------
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('scratchContainer');
  
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#FF5EA8');
  grad.addColorStop(0.5, '#B47CFF');
  grad.addColorStop(1, '#FFB454');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 24px 'Caveat', cursive";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("Scratch to reveal! ✨", canvas.width / 2, canvas.height / 2);

  let isDrawing = false;
  let revealed = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    ctx.globalCompositeOperation = 'destination-out';
    draw(e);
  }

  function draw(e) {
    if (!isDrawing || revealed) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  function stopDraw() {
    if (!isDrawing) return;
    isDrawing = false;
    checkReveal();
  }

  function checkReveal() {
    if (revealed) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    const totalPixels = canvas.width * canvas.height;
    
    for (let i = 3; i < imageData.data.length; i += 4 * 4) {
      if (imageData.data[i] === 0) transparentPixels += 4;
    }
    
    const percent = (transparentPixels / totalPixels) * 100;
    if (percent > 35) {
      revealed = true;
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.pointerEvents = 'none';
      }, 600);
    }
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDraw);
}

// ---------- REASONS SPAM BUTTON ----------
const reasons = [
  "Because you mock my laugh 🤭",
  "Because you steal my hoodies 👕",
  "Because you're my wifeyyy 💍",
  "Even though you're far away 🥺",
  "Because you're turning into an unc 👴",
  "Because you put up with my cringe 😶‍🌫️",
  "Because you're my pookie wifey BBG ✨",
  "Because your laugh is contagious 😂",
  "Because you make me smile even when I'm sad",
  "Because you're literally perfect 😍",
  "Because you're my favorite person to talk to",
  "Because you're my gaming partner 🎮",
  "Because you send me cute selfies 📸",
  "Because you call me baby 🥰",
  "Because you make me want to be better",
  "Because you're my future 🌟",
  "Because you're my best friend 👯‍♀️",
  "Because you support my dreams 💭",
  "Because you laugh at my dumb jokes 😅",
  "Because you're beautiful inside and out 💖",
  "Because you're my forever and always 🔄",
  "Because you're the Léa to my Jaya 🤍",
  "Because you're my home 🏠",
  "Because I just do, okay?! 😤"
];

function initReasons() {
  const btn = document.getElementById('reasonBtn');
  const bubble = document.getElementById('reasonBubble');
  if(!btn || !bubble) return;
  
  let idx = 0;
  
  btn.addEventListener('click', () => {
    if (idx < reasons.length) {
      bubble.classList.remove('show');
      
      // Timeout to allow the bubble to pop out and in smoothly
      setTimeout(() => {
        bubble.textContent = reasons[idx];
        idx++;
        bubble.classList.add('show');
        
        if (idx === reasons.length) {
          btn.textContent = "That's all of them! 🥰";
          btn.classList.add('done');
          btn.disabled = true;
        }
      }, 150);
    }
  });
}

// ---------- BOOK GALLERY ----------
const galleryImages = [
  "<div class='ph'><img src='photos/photo1.jpg' alt='Photo 1'></div>",
  "<div class='ph'><img src='photos/photo2.jpg' alt='Photo 2'></div>",
  "<div class='ph'><img src='photos/photo3.jpg' alt='Photo 3'></div>",
  "<div class='ph'><img src='photos/photo4.jpg' alt='Photo 4'></div>",
  "<div class='ph'><img src='photos/photo5.jpg' alt='Photo 5'></div>",
  "<div class='ph'><img src='photos/photo6.jpg' alt='Photo 6'></div>",
  "<div class='ph'><img src='photos/photo7.jpg' alt='Photo 7'></div>",
  "<div class='ph'><img src='photos/photo8.jpg' alt='Photo 8'></div>"
];

function initBook(){
  const book = document.getElementById('photoBook');
  if(!book) return;

  const staticPage = document.createElement('div');
  staticPage.className = 'book-page page-static';
  staticPage.innerHTML = `<div class="page-side page-front">${galleryImages[0]}</div>`;
  book.appendChild(staticPage);

  const flippablePages = [];
  
  for(let i=1; i<galleryImages.length; i+=2) {
    const frontContent = galleryImages[i];
    const backContent = galleryImages[i+1] || "The End ♥"; 

    const page = document.createElement('div');
    page.className = 'book-page';
    page.innerHTML = `
      <div class="page-side page-front">${frontContent}</div>
      <div class="page-side page-back">${backContent}</div>
    `;
    
    page.addEventListener('click', (e) => {
      e.stopPropagation();
      flipPage(page, flippablePages);
    });

    book.appendChild(page);
    flippablePages.push(page);
  }

  updateBookZIndexes(flippablePages);

  document.getElementById('nextPageBtn').addEventListener('click', () => {
    const nextUnflipped = flippablePages.find(p => !p.classList.contains('flipped'));
    if(nextUnflipped) flipPage(nextUnflipped, flippablePages);
  });

  document.getElementById('prevPageBtn').addEventListener('click', () => {
    const flippedPages = flippablePages.filter(p => p.classList.contains('flipped'));
    const lastFlipped = flippedPages[flippedPages.length - 1];
    if(lastFlipped) flipPage(lastFlipped, flippablePages);
  });
}

function flipPage(page, allPages) {
  page.classList.toggle('flipped');
  updateBookZIndexes(allPages);
}

function updateBookZIndexes(pages) {
  let topUnflippedIdx = -1;
  let topFlippedIdx = -1;

  for(let i=0; i<pages.length; i++) {
    if(pages[i].classList.contains('flipped')) {
      topFlippedIdx = i;
    } else {
      if(topUnflippedIdx === -1) topUnflippedIdx = i;
    }
  }

  pages.forEach((p, i) => {
    if (p.classList.contains('flipped')) {
      p.style.zIndex = i + 1; 
    } else {
      p.style.zIndex = pages.length - i; 
    }
    
    if (i === topUnflippedIdx || i === topFlippedIdx) {
      p.classList.remove('blurred');
    } else {
      p.classList.add('blurred');
    }
  });
}

// ---------- START ----------
function initPage(){
  spawnParticles('p-menu', 16);
  spawnParticles('p-anni-count', 24);
  spawnParticles('p-anni', 16);
  spawnParticles('p-count', 24);
  spawnParticles('p-gate', 16);
  spawnParticles('p-open', 18);
  
  initApp();
  initGate();
  initReasons();
  initBook();
}

document.addEventListener('DOMContentLoaded', initPage);