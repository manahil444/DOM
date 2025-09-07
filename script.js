/* --------- Data (sample packages) --------- */
const packagesData = [
  { id: 1, title: "Maldives Escape", days: 5, price: 899, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400", desc: "Beach villa, snorkeling & spa", popularity: 95 },
  { id: 2, title: "Istanbul Highlights", days: 4, price: 499, img: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1400", desc: "Historic sites & culinary tour", popularity: 88 },
  { id: 3, title: "Swiss Alps Retreat", days: 7, price: 1299, img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400", desc: "Hiking, scenic trains & chalets", popularity: 78 },
  { id: 4, title: "Tokyo Urban Pulse", days: 5, price: 999, img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1400", desc: "Culture, food & neon nights", popularity: 82 },
  { id: 5, title: "Safari — Kenya", days: 6, price: 1499, img: "https://images.unsplash.com/photo-1518684079-2ca0f1d9d6b9?q=80&w=1400", desc: "Game drives & luxury camps", popularity: 91 },
  { id: 6, title: "Lisbon & Algarve", days: 8, price: 799, img: "https://images.unsplash.com/photo-1533682103819-4cf3b6e1b03e?q=80&w=1400", desc: "Coasts, tiles & sunsets", popularity: 70 }
];

/* --------- Helpers & DOM nodes --------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const packagesGrid = $('#packagesGrid');
const sortBy = $('#sortBy');
const searchForm = $('#searchForm');
const searchInput = $('#searchInput');
const durationEl = $('#duration');
const bookingModal = $('#bookingModal');
const modalClose = $('#modalClose');
const bookingForm = $('#bookingForm');
const modalPkg = $('#modalPkg');
const modalTravellers = $('#modalTravellers');
const modalDate = $('#modalDate');
const modalNotes = $('#modalNotes');
const statTrips = $('#statTrips');
const statCountries = $('#statCountries');
const statClients = $('#statClients');
const navToggle = $('#navToggle');
const mainNav = $('#mainNav');
const themeToggle = $('#themeToggle');
const bookTopBtn = $('#bookTopBtn');
const startBooking = $('#startBooking');
const yearEl = $('#year');
const contactForm = $('#contactForm');

/* --------- Init ---------- */
let state = { items: packagesData.slice() };
yearEl && (yearEl.textContent = new Date().getFullYear());

/* Render packages */
function renderPackages(items = []) {
  packagesGrid.innerHTML = '';
  items.forEach(p => {
    const el = document.createElement('article');
    el.className = 'package';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="meta">${p.desc} • <strong>${p.days} days</strong></div>
      <div class="card-foot">
        <div>
          <div class="price">$${p.price}</div>
          <div class="meta">Popularity: ${p.popularity}</div>
        </div>
        <div style="text-align:right">
          <div class="badge">${p.days}d</div>
          <button class="btn open-book" data-id="${p.id}">Book</button>
        </div>
      </div>
    `;
    packagesGrid.appendChild(el);
  });

  // attach book listeners
  $$('.open-book').forEach(b => b.addEventListener('click', (e) => {
    openBooking(+e.currentTarget.dataset.id);
  }));
}

/* Filters & sort */
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const dur = durationEl.value;
  let items = packagesData.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  if (dur) {
    if (dur === '3') items = items.filter(i => i.days <= 3);
    if (dur === '5') items = items.filter(i => i.days <= 5);
    if (dur === '7') items = items.filter(i => i.days >= 7);
  }
  const s = sortBy.value;
  if (s === 'priceAsc') items.sort((a,b)=>a.price-b.price);
  if (s === 'priceDesc') items.sort((a,b)=>b.price-a.price);
  if (s === 'popular') items.sort((a,b)=>b.popularity-a.popularity);
  renderPackages(items);
}

/* Booking modal */
function openBooking(id) {
  const p = packagesData.find(x => x.id === id);
  if (!p) return;
  modalPkg.value = p.title;
  modalTravellers.value = 1;
  modalDate.value = '';
  modalNotes.value = '';
  bookingModal.setAttribute('aria-hidden','false');
  // animate modal
  if (window.gsap) gsap.fromTo('.modal-panel', {y:30,opacity:0},{y:0,opacity:1,duration:.45});
}
function closeBooking() {
  bookingModal.setAttribute('aria-hidden','true');
}

/* Save booking to localStorage */
function saveBooking(b) {
  const list = JSON.parse(localStorage.getItem('voyagepro_bookings') || '[]');
  list.push(b);
  localStorage.setItem('voyagepro_bookings', JSON.stringify(list));
  console.log('Booking saved', b);
}

/* Contact send (demo) */
function sendContact(payload) {
  const list = JSON.parse(localStorage.getItem('voyagepro_contacts') || '[]');
  list.push({ ...payload, ts: Date.now() });
  localStorage.setItem('voyagepro_contacts', JSON.stringify(list));
  console.log('Contact saved', payload);
}

/* Stats animation */
function animateStats() {
  if (!window.gsap) return;
  gsap.fromTo('#statTrips', {innerText:0}, {innerText: packagesData.length, duration:1.2, snap:{innerText:1}, ease:'power1.inOut'});
  gsap.fromTo('#statCountries', {innerText:0}, {innerText: 34, duration:1.2, snap:{innerText:1}, ease:'power1.inOut'});
  gsap.fromTo('#statClients', {innerText:0}, {innerText: 1248, duration:1.6, snap:{innerText:1}, ease:'power1.inOut'});
}

/* UI wiring */
document.addEventListener('DOMContentLoaded', () => {
  renderPackages(state.items);
  animateStats();
});

/* Events */
sortBy && sortBy.addEventListener('change', applyFilters);
searchForm && searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });

modalClose && modalClose.addEventListener('click', closeBooking);
bookingModal && bookingModal.addEventListener('click', (e) => { if (e.target === bookingModal) closeBooking(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBooking(); });

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bk = {
      id: Date.now(),
      title: modalPkg.value,
      travellers: Number(modalTravellers.value),
      start: modalDate.value,
      notes: modalNotes.value
    };
    saveBooking(bk);
    closeBooking();
    if (window.gsap) gsap.fromTo('.brand', {scale:1}, {scale:1.06, duration:.12, yoyo:true, repeat:1});
    alert('Booking confirmed (demo). Check console or LocalStorage for saved bookings.');
  });
}

// top Book buttons
bookTopBtn && bookTopBtn.addEventListener('click', ()=> openBooking(packagesData[0].id));
startBooking && startBooking.addEventListener('click', ()=> openBooking(packagesData[0].id));

// Nav toggle mobile
navToggle && navToggle.addEventListener('click', ()=> {
  mainNav.classList.toggle('open');
});

// Theme toggle
themeToggle && themeToggle.addEventListener('click', ()=> {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? '': 'dark');
  themeToggle.setAttribute('aria-pressed', String(!isDark));
  // change icon
  themeToggle.innerHTML = isDark ? '<i class=\"fa-solid fa-moon\"></i>' : '<i class=\"fa-solid fa-sun\"></i>';
});

// Contact form
contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = { name: $('#contactName').value, email: $('#contactEmail').value, message: $('#contactMessage').value };
  sendContact(payload);
  alert('Thanks — we will get back to you! (demo)');
  contactForm.reset();
});

// Small GSAP entrance animations & ScrollTrigger
window.addEventListener('load', ()=> {
  if (!window.gsap) return;
  gsap.from('.hero h1', {y:28, opacity:0, duration:.75, ease:'power2.out'});
  gsap.from('.lead', {y:18,opacity:0,delay:.1,duration:.6});
  gsap.from('.media-card', {x:40,rotation:-5,opacity:0,duration:.9,delay:.2});
  gsap.utils.toArray('.package, .tile').forEach((el, i)=>{
    gsap.from(el, {y:24,opacity:0,delay:0.18 + i*0.06, duration:0.6, ease:'power2.out'});
  });
  // reveal sections on scroll
  if (window.ScrollTrigger) {
    gsap.utils.toArray('section').forEach(sec => {
      gsap.from(sec, {y:30, opacity:0, duration:.6, scrollTrigger:{trigger:sec, start:'top 85%'}});
    });
  }
});
