/* ===== Header shrink ===== */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ===== Mobile menu ===== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') nav.classList.remove('open'); });

/* ===== House catalog data (order: одноэтажные → двухэтажные) =====
   gallery = рендеры (project{f}-1..4) + планировки (plan{f}-*) */
const houses = [
  {
    name: 'U90', type: 'Одноэтажный дом', floors: '1 этаж',
    price: 'от 15 000 000 ₽', area: 90, beds: 2, baths: 1, folder: 4,
    gallery: ['project4-1','project4-2','project4-3','project4-4','plan4-1'],
    specs: [
      ['Площадь дома', '90 м²'], ['Кухня-гостиная', '31,9 м²'],
      ['Спальни', '2'], ['Санузлы', '1'], ['Терраса', '25,8 + 14,3 м²'],
      ['Фундамент', 'монолитная плита'], ['Стены', 'газобетон 400 мм + утепление 100 мм'],
      ['Фасады', 'камень, планкен, фактурная штукатурка'], ['Крыша', 'плоская, утеплённая, наплавляемая'],
    ],
  },
  {
    name: 'U120', type: 'Одноэтажный дом', floors: '1 этаж',
    price: 'от 17 900 000 ₽', area: 120, beds: 2, baths: 2, folder: 3,
    gallery: ['project3-1','project3-2','project3-3','project3-4','plan3-1'],
    specs: [
      ['Площадь дома', '120 м²'], ['Кухня-гостиная', '31,3 м²'],
      ['Спальни', '2'], ['Санузлы', '2'], ['Терраса', '14,4 + 20,0 м²'],
      ['Фундамент', 'монолитная плита'], ['Стены', 'газобетон 400 мм + утепление 100 мм'],
      ['Фасады', 'камень, планкен, фактурная штукатурка'], ['Крыша', 'плоская, утеплённая, наплавляемая'],
    ],
  },
  {
    name: 'U150', type: 'Двухэтажный дом', floors: '2 этажа',
    price: 'от 20 900 000 ₽', area: 150, beds: 3, baths: 2, folder: 2,
    gallery: ['project2-1','project2-2','project2-3','project2-4','plan2-1','plan2-2'],
    specs: [
      ['Площадь дома', '150 м²'], ['Этажей', '2'],
      ['Спальни', '3'], ['Санузлы', '2'],
      ['Фундамент', 'монолитная плита'], ['Стены', 'газобетон 400 мм + утепление 100 мм'],
      ['Фасады', 'камень, планкен, фактурная штукатурка'], ['Крыша', 'плоская, утеплённая, наплавляемая'],
    ],
  },
  {
    name: 'U170', type: 'Двухэтажный дом', floors: '2 этажа',
    price: 'от 23 900 000 ₽', area: 170, beds: 3, baths: 3, folder: 1,
    gallery: ['project1-1','project1-2','project1-3','project1-4','plan1-1','plan1-2'],
    specs: [
      ['Площадь дома', '170 м²'], ['Кухня-гостиная', '56,3 м²'],
      ['Спальни', '3'], ['Санузлы', '3'], ['Навес для авто', '35,8 м²'],
      ['Фундамент', 'монолитная плита'], ['Стены', 'газобетон 400 мм + утепление 100 мм'],
      ['Фасады', 'камень, планкен, фактурная штукатурка'], ['Крыша', 'плоская, утеплённая, наплавляемая'],
    ],
  },
];

/* ===== Render house cards ===== */
const grid = document.getElementById('housesGrid');
houses.forEach((h, idx) => {
  const card = document.createElement('article');
  card.className = 'house';
  card.innerHTML = `
    <div class="house__img">
      <img src="images/project${h.folder}-1.jpg" alt="${h.name}" loading="lazy">
      <span class="house__floors">${h.floors}</span>
      <span class="house__price">${h.price}</span>
    </div>
    <div class="house__body">
      <h3>${h.name}</h3>
      <p class="house__area">${h.area} м² · ${h.type.toLowerCase()}</p>
      <div class="house__meta">
        <span>🛏 ${h.beds} ${plural(h.beds, 'спальня','спальни','спален')}</span>
        <span>🚿 ${h.baths} ${plural(h.baths,'санузел','санузла','санузлов')}</span>
      </div>
      <span class="house__more">Смотреть проект →</span>
    </div>`;
  card.addEventListener('click', () => openHouse(idx));
  grid.appendChild(card);
});

function plural(n, one, few, many){
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

/* ===== House modal ===== */
const modal = document.getElementById('houseModal');
const mMain = document.getElementById('mGalleryMain');
const mThumbs = document.getElementById('mThumbs');

function openHouse(idx){
  const h = houses[idx];
  document.getElementById('mTitle').textContent = h.name;
  document.getElementById('mType').textContent = `${h.type} · ${h.floors}`;
  document.getElementById('mPrice').textContent = h.price;
  document.getElementById('mSpecs').innerHTML = h.specs
    .map(([k,v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  mThumbs.innerHTML = '';
  h.gallery.forEach((nm, i) => {
    const src = `images/${nm}.jpg`;
    if (i === 0) mMain.src = src;
    const t = document.createElement('img');
    t.src = src; t.alt = `${h.name} — ${i + 1}`;
    if (i === 0) t.classList.add('active');
    t.addEventListener('click', () => {
      mMain.src = src;
      mThumbs.querySelectorAll('img').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
    mThumbs.appendChild(t);
  });
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal(){ modal.hidden = true; document.body.style.overflow = ''; }
modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===== Master plan: 25 plots ===== */
const SVG_NS = 'http://www.w3.org/2000/svg';
const statusMeta = {
  free:   { label: 'Свободен', cls: 'plot--free' },
  booked: { label: 'Бронь',    cls: 'plot--booked' },
  sold:   { label: 'Продан',   cls: 'plot--sold' },
};
const soldSet = new Set([2,5,9,12,14,18,21,24]);   // проданные
const bookedSet = new Set([7,16,23]);              // в брони
const plotsLayer = document.querySelector('.plots');
const info = document.getElementById('plotInfo');
const setProp = (k,v) => info.querySelector(`[data-prop="${k}"]`).textContent = v;
let activeEl = null;

// Раскладка повторяет генплан: верхний ряд (№1–8) вдоль верхней дороги,
// и нижний блок из двух рядов (№9–17 сверху и №18–25 снизу)
const rows = [
  { count: 7, x0: 110, pitch: 121, y: 40,  w: 108, h: 98 }, // верхний ряд (№1–7)
  { count: 9, x0: 48,  pitch: 102, y: 176, w: 92,  h: 92 }, // нижний блок — верхний ряд (№8–16)
  { count: 9, x0: 72,  pitch: 100, y: 280, w: 90,  h: 92 }, // нижний блок — нижний ряд (№17–25)
];
let n = 0;
rows.forEach(r => {
  for (let c = 0; c < r.count; c++){
    const i = ++n;
    const x = r.x0 + c * r.pitch, y = r.y, W = r.w, H = r.h;
    const status = soldSet.has(i) ? 'sold' : bookedSet.has(i) ? 'booked' : 'free';
    const price = 14.9 + ((i * 37) % 80) / 10;        // 14.9..22.8 млн, детерминированно

    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', W); rect.setAttribute('height', H);
    rect.setAttribute('rx', 6);
    rect.setAttribute('class', `plot ${statusMeta[status].cls}`);

    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', x + W/2); text.setAttribute('y', y + H/2 + 4);
    text.setAttribute('text-anchor', 'middle'); text.setAttribute('class', 'plot__num');
    text.textContent = i;

    const select = () => {
      if (status === 'sold') return;
      if (activeEl) activeEl.classList.remove('is-active');
      rect.classList.add('is-active'); activeEl = rect;
      info.querySelector('.plan__info-title').textContent = `Участок №${i}`;
      info.querySelector('.plan__info-hint').textContent =
        status === 'booked' ? 'Участок в брони — уточните актуальность у менеджера.' : 'Закрепим участок за вами на 3 дня.';
      setProp('id', `№${i}`);
      setProp('area', '10 соток');
      setProp('status', statusMeta[status].label);
      setProp('price', `от ${price.toFixed(1)} млн ₽`);
    };
    rect.addEventListener('click', select);
    text.addEventListener('click', select);
    plotsLayer.appendChild(rect);
    plotsLayer.appendChild(text);
  }
});

/* ===== Quiz ===== */
const quizData = [
  { q: 'Какой формат дома рассматриваете?', opts: ['Одноэтажный','Двухэтажный','Не определился'] },
  { q: 'Сколько спален нужно?', opts: ['2 спальни','3 спальни','4 и более'] },
  { q: 'Комфортный бюджет?', opts: ['до 15 млн ₽','15–20 млн ₽','от 20 млн ₽'] },
  { q: 'Когда планируете покупку?', opts: ['В ближайший месяц','В течение 3 месяцев','Просто изучаю'] },
  { q: 'Куда отправить подборку?', contact: true },
];
const quizSteps = document.getElementById('quizSteps');
const quizBar = document.getElementById('quizBar');
const answers = [];
let step = 0;

function renderQuiz(){
  const d = quizData[step];
  quizBar.style.width = `${((step) / quizData.length) * 100 + 20}%`;
  if (d.contact){
    quizSteps.innerHTML = `
      <p class="quiz__q">${d.q}</p>
      <input class="quiz__field" id="qName" placeholder="Ваше имя">
      <input class="quiz__field" id="qPhone" placeholder="+7 (___) ___-__-__">
      <div class="quiz__nav">
        <button class="quiz__back" id="qBack">← Назад</button>
        <button class="btn btn--primary" id="qSubmit">Получить подборку</button>
      </div>`;
    maskPhone(document.getElementById('qPhone'));
    document.getElementById('qBack').onclick = () => { step--; renderQuiz(); };
    document.getElementById('qSubmit').onclick = finishQuiz;
    return;
  }
  quizSteps.innerHTML = `
    <p class="quiz__q">${d.q}</p>
    <div class="quiz__options">
      ${d.opts.map((o,i)=>`<div class="quiz__opt${answers[step]===i?' sel':''}" data-i="${i}">${o}</div>`).join('')}
    </div>
    <div class="quiz__nav">
      ${step>0?'<button class="quiz__back" id="qBack">← Назад</button>':'<span></span>'}
    </div>`;
  quizSteps.querySelectorAll('.quiz__opt').forEach(opt => {
    opt.onclick = () => { answers[step] = +opt.dataset.i; step++; renderQuiz(); };
  });
  const back = document.getElementById('qBack');
  if (back) back.onclick = () => { step--; renderQuiz(); };
}
function finishQuiz(){
  quizBar.style.width = '100%';
  quizSteps.innerHTML = `
    <div class="quiz__done">
      <h4>Спасибо!</h4>
      <p>Подобрали проекты под ваши параметры. Менеджер свяжется с вами в течение 15 минут и пришлёт планировки и цены.</p>
    </div>`;
}
renderQuiz();

/* ===== Phone mask ===== */
function maskPhone(input){
  if (!input) return;
  input.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v.startsWith('7')) v = '7' + v;
    v = v.slice(0,11);
    let out = '+7';
    if (v.length>1) out += ' (' + v.slice(1,4);
    if (v.length>=4) out += ') ' + v.slice(4,7);
    if (v.length>=7) out += '-' + v.slice(7,9);
    if (v.length>=9) out += '-' + v.slice(9,11);
    e.target.value = out;
  });
}
maskPhone(document.querySelector('#callbackForm input[name="phone"]'));

/* ===== Callback form ===== */
const form = document.getElementById('callbackForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()){ form.reportValidity(); return; }
  const note = document.getElementById('formNote');
  note.hidden = false;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Заявка отправлена ✓';
  // отправка на сервер: fetch('/api/lead', { method:'POST', body:new FormData(form) })
  setTimeout(() => { form.reset(); note.hidden = true; btn.textContent = 'Отправить заявку'; }, 5000);
});

/* ===== Reveal on scroll ===== */
document.querySelectorAll('.section, .feature, .house, .qcard, .adv, .poi li').forEach(el => el.classList.add('reveal'));
const revObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
