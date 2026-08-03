// CONFIG
window.PASSWORD = "04082008"; 
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1532775806290624693/bscV6VQBBpUmVKmzyWEQYJxzkjejiCe1WGYTlfTmIylrtcHA1xRE7KeNMo3CP_dkOLK-"; // <-- PASTE IT HERE

// ---------- DISCORD NOTIFICATION ----------
async function notifyVisit() {
  // Removed the sessionStorage check so it notifies EVERY TIME (including refreshes)

  const userAgent = navigator.userAgent;
  let os = "Unknown OS";
  if (userAgent.match(/Win/i)) os = "Windows";
  if (userAgent.match(/Mac/i)) os = "MacOS";
  if (userAgent.match(/iPhone/i)) os = "iPhone";
  if (userAgent.match(/Android/i)) os = "Android";

  let browser = "Unknown Browser";
  if (userAgent.match(/chrome|chromium|crios/i)) browser = "Chrome";
  if (userAgent.match(/firefox|fxios/i)) browser = "Firefox";
  if (userAgent.match(/safari/i) && !userAgent.match(/chrome|chromium|crios/i)) browser = "Safari";

  const language = navigator.language || "Unknown";
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const referrer = document.referrer || "Direct/Typed in URL";
  const time = new Date().toLocaleString();

  let locationInfo = "Location unavailable";
  
  // Fetch her approximate location using a free IP API
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    if (data && data.city) {
      locationInfo = `${data.city}, ${data.country_name} (${data.region})`;
    }
  } catch (e) {
    console.log("Geolocation fetch failed");
  }

  // Build the fancy Discord message
  const message = `🔔 **ALERT! Someone just opened or refreshed the website!**\n` +
                  `🕒 **Time:** ${time}\n` +
                  `🌍 **Location:** ${locationInfo}\n` +
                  `💻 **Device:** ${os} (${browser})\n` +
                  `📱 **Screen:** ${screenWidth}x${screenHeight}\n` +
                  `🗣️ **Language:** ${language}\n` +
                  `🔗 **Came from:** ${referrer}`;

  const payload = {
    content: message
  };

  // Send the data to Discord
  fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error("Discord webhook error:", err));
}

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
  
  window.GF_DAY = new Date(year, 7, 1, 0, 0, 0);     
  window.ANNIVERSARY = new Date(year, 7, 3, 0, 0, 0); 
  window.BIRTHDAY = new Date(year, 7, 4, 0, 0, 0);    
  
  const aug1 = new Date(year, 7, 1);
  const aug3 = new Date(year, 7, 3);
  const aug4 = new Date(year, 7, 4);
  
  if (now > aug4) {
    goTo('menu');
    initMenuButtons();
  } else if (now >= aug3 && now < aug4) {
    goTo('anniversary');
    initAnniversaryButton();
    initScratchCard();
    initAnniversaryExtras();
  } else if (now >= aug1 && now < aug3) {
    goTo('girlfriend-day');
    initGfButton();
    initMultiScratch();
  } else {
    goTo('gf-countdown');
    startGfCountdown();
  }
}

function initMenuButtons() {
  document.getElementById('menuGfBtn').addEventListener('click', () => {
    goTo('girlfriend-day');
    initGfButton();
    initMultiScratch();
  });
  document.getElementById('menuAnniBtn').addEventListener('click', () => {
    goTo('anniversary');
    initAnniversaryButton();
    initScratchCard();
    initAnniversaryExtras();
  });
  document.getElementById('menuBdayBtn').addEventListener('click', () => {
    goTo('countdown');
    startBirthdayCountdown();
  });
}

function initGfButton() {
  const btn = document.getElementById('goToAnniBtn');
  if(!btn) return;
  btn.onclick = () => {
    goTo('anni-countdown');
    startAnniCountdown();
  };
}

function initAnniversaryButton() {
  const btn = document.getElementById('goToBirthdayBtn');
  if(!btn) return;
  btn.onclick = () => {
    goTo('countdown');
    startBirthdayCountdown();
  };
}

// ---------- GF DAY COUNTDOWN ----------
function tickGfCountdown(){
  const days = document.getElementById('gfc-d');
  const hours = document.getElementById('gfc-h');
  const minutes = document.getElementById('gfc-m');
  const seconds = document.getElementById('gfc-s');
  if(!days || !hours || !minutes || !seconds) return;

  const now = new Date();
  let diff = window.GF_DAY - now;
  if(diff <= 0){
    days.textContent='00'; hours.textContent='00';
    minutes.textContent='00'; seconds.textContent='00';
    
    const gfCountdown = document.getElementById('gf-countdown');
    if(gfCountdown && gfCountdown.classList.contains('active')){
      setTimeout(()=>{
        goTo('girlfriend-day');
        initGfButton();
        initMultiScratch();
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

function startGfCountdown() {
  if(!document.getElementById('gf-countdown')) return;
  tickGfCountdown();
  setInterval(tickGfCountdown, 1000);
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
    
    const aniCountdown = document.getElementById('anni-countdown');
    if(aniCountdown && aniCountdown.classList.contains('active')){
      setTimeout(()=>{
        goTo('anniversary');
        initAnniversaryButton();
        initScratchCard();
        initAnniversaryExtras();
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

// ---------- MULTI SCRATCH CARDS (GF Day) ----------
function initMultiScratch() {
  const canvases = document.querySelectorAll('.multi-scratch .scratch-canvas');
  canvases.forEach(canvas => {
    if(canvas.dataset.init === 'true') return;
    canvas.dataset.init = 'true';
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#FF5EA8');
    grad.addColorStop(0.5, '#B47CFF');
    grad.addColorStop(1, '#FFB454');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 20px 'Caveat', cursive";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Scratch!", canvas.width / 2, canvas.height / 2);

    let isDrawing = false;
    let revealed = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      return { x, y };
    }
    function startDraw(e) { e.preventDefault(); isDrawing = true; ctx.globalCompositeOperation = 'destination-out'; draw(e); }
    function draw(e) {
      if (!isDrawing || revealed) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    function stopDraw() { if (!isDrawing) return; isDrawing = false; checkReveal(); }
    function checkReveal() {
      if (revealed) return;
      const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      let t = 0;
      for (let i = 3; i < imageData.data.length; i += 16) { if (imageData.data[i] === 0) t += 4; }
      if ((t / (canvas.width * canvas.height)) * 100 > 40) {
        revealed = true;
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.pointerEvents = 'none'; }, 600);
      }
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDraw);
  });
}

// ---------- ANNIVERSARY EXTRAS ----------
function initAnniversaryExtras() {
  initEnvelopes();
  initLoveSlider();
  initConnectHearts();
}

function updateClocks() {
  const india = document.getElementById('indiaTime');
  const france = document.getElementById('franceTime');
  if(!india || !france) return;
  const now = new Date();
  try {
    india.textContent = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    france.textContent = now.toLocaleTimeString('en-US', { timeZone: 'Europe/Paris', hour12: false });
  } catch(e) {
    india.textContent = "00:00:00";
    france.textContent = "00:00:00";
  }
}

function updateCounter() {
  const start = new Date('2026-03-03T00:00:00');
  const now = new Date();
  let diff = now - start;
  if(diff < 0) diff = 0;
  
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  
  const dEl = document.getElementById('c-days');
  if(dEl) {
    document.getElementById('c-days').textContent = d;
    document.getElementById('c-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('c-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('c-secs').textContent = String(s).padStart(2,'0');
  }
}

function initEnvelopes() {
  document.querySelectorAll('.envelope').forEach(env => {
    env.onclick = () => {
      document.querySelectorAll('.envelope').forEach(e => e.classList.remove('opened'));
      env.classList.add('opened');
      document.getElementById('envMessage').textContent = env.getAttribute('data-msg');
    };
  });
}

function initLoveSlider() {
  const slider = document.getElementById('loveSlider');
  const reveal = document.getElementById('loveReveal');
  if(!slider || !reveal) return;
  slider.oninput = () => {
    const v = slider.value;
    if(v == 0) reveal.textContent = "Slide me!";
    else if(v < 25) reveal.textContent = "Ewww,not so little 🤏";
    else if(v < 50) reveal.textContent = "You dont love me?? 😳";
    else if(v < 75) reveal.textContent = "I hate youuuuu 🔥";
    else if(v < 100) reveal.textContent = "OMGGG,you do really love meeee 😭";
    else reveal.textContent = "I love you 3000!!!!!!!🤍";
  };
}

function initConnectHearts() {
  const drag = document.getElementById('dragHeart');
  const target = document.getElementById('targetHeart');
  const wrap = document.getElementById('connectWrap');
  if(!drag || !target || !wrap || drag.dataset.init === 'true') return;
  drag.dataset.init = 'true';

  let isDragging = false;
  let startX, startY;

  function start(e) {
    isDragging = true;
    drag.style.cursor = 'grabbing';
    const rect = drag.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX - rect.left;
    startY = point.clientY - rect.top;
    e.preventDefault();
  }
  function move(e) {
    if(!isDragging) return;
    const point = e.touches ? e.touches[0] : e;
    const wrapRect = wrap.getBoundingClientRect();
    let x = point.clientX - wrapRect.left - startX;
    let y = point.clientY - wrapRect.top - startY;
    
    x = Math.max(0, Math.min(x, wrapRect.width - drag.offsetWidth));
    y = Math.max(0, Math.min(y, wrapRect.height - drag.offsetHeight));
    
    drag.style.position = 'absolute';
    drag.style.left = x + 'px';
    drag.style.top = y + 'px';
    
    const dragRect = drag.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const dist = Math.hypot(
      (dragRect.left + dragRect.width/2) - (targetRect.left + targetRect.width/2),
      (dragRect.top + dragRect.height/2) - (targetRect.top + targetRect.height/2)
    );
    
    if(dist < 50) {
      isDragging = false;
      drag.style.opacity = '0';
      target.innerHTML = '❤️';
      target.style.transform = 'scale(1.5)';
      target.style.background = 'var(--grad)';
      burstHearts(wrap);
    }
    e.preventDefault();
  }
  function end() { isDragging = false; drag.style.cursor = 'grab'; }

  drag.addEventListener('mousedown', start);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);
  drag.addEventListener('touchstart', start);
  document.addEventListener('touchmove', move, {passive: false});
  document.addEventListener('touchend', end);
  
  function burstHearts(container) {
    for(let i=0; i<20; i++) {
      const h = document.createElement('div');
      h.textContent = '❤️';
      h.style.position = 'absolute';
      h.style.left = '50%';
      h.style.top = '50%';
      h.style.fontSize = '24px';
      h.style.pointerEvents = 'none';
      h.style.zIndex = '10';
      container.appendChild(h);
      
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120 + 50;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      
      h.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 500,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      });
      
      setTimeout(() => h.remove(), 1700);
    }
  }
}

// ---------- ORIGINAL SCRATCH CARD (Anniversary) ----------
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas || canvas.dataset.init === 'true') return;
  canvas.dataset.init = 'true';
  
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
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
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

// ---------- CASSETTE PLAYER ----------
function initCassette() {
  const tape = document.getElementById('cassetteTape');
  const audio = document.getElementById('ourSong');
  const status = document.getElementById('tapeStatus');
  
  if(!tape || !audio) return;
  
  audio.volume = 0.05; // <--- ADD THIS LINE! (0.05 is 5% volume)
  
  tape.addEventListener('click', () => {
    if(audio.paused) {
      audio.play().catch(e => console.log("Audio play blocked"));
      tape.classList.add('playing');
      status.textContent = "Now Playing... 🎵";
    } else {
      audio.pause();
      tape.classList.remove('playing');
      status.textContent = "Press Play 🎧";
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
  notifyVisit();
  spawnParticles('p-menu', 16);
  spawnParticles('p-gf-count', 24);
  spawnParticles('p-gf', 16);
  spawnParticles('p-anni-count', 24);
  spawnParticles('p-anni', 16);
  spawnParticles('p-count', 24);
  spawnParticles('p-gate', 16);
  spawnParticles('p-open', 18);
  
  initApp();
  initGate();
  initBook();
  initCassette(); // Start the cassette player logic
  
  // Start global clocks and counters
  updateClocks();
  setInterval(updateClocks, 1000);
  updateCounter();
  setInterval(updateCounter, 1000);
}

document.addEventListener('DOMContentLoaded', initPage);
