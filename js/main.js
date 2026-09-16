/* ==========================================================================
   Evandro & Vitória — Template de Convite de Casamento
   Todo o conteúdo dinâmico (contagem regressiva e links de agenda) é
   derivado do objeto CONFIG abaixo. Edite apenas esses valores para
   adaptar o site a outro casal / data / local.
   ========================================================================== */

const CONFIG = {
  coupleNames: 'Evandro & Vitória',
  // Horário de Brasília (America/Sao_Paulo) é fixo em UTC-03:00.
  ceremony: {
    title: 'Cerimônia Religiosa — Evandro & Vitória',
    start: '2027-04-10T17:00:00-03:00',
    end:   '2027-04-10T18:00:00-03:00',
    location: 'Basílica Santuário Sagrado Coração Misericordioso de Jesus, Içara, SC',
    // Local da recepção ainda não definido — atualize aqui e no card
    // "Recepção" do index.html assim que houver uma data confirmada.
    description: 'Cerimônia de casamento no rito Católico Apostólico Romano. Local da festa a definir.'
  }
};

/* ---------------- Header scroll state ---------------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Mobile nav toggle ---------------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------------- Reveal on scroll ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------------- Countdown ---------------- */
const weddingDate = new Date(CONFIG.ceremony.start);
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMinutes = document.getElementById('cdMinutes');
const cdSeconds = document.getElementById('cdSeconds');

function pad(n){ return String(n).padStart(2, '0'); }

function updateCountdown(){
  const diff = weddingDate.getTime() - Date.now();
  if (diff <= 0){
    cdDays.textContent = cdHours.textContent = cdMinutes.textContent = cdSeconds.textContent = '00';
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMinutes.textContent = pad(minutes);
  cdSeconds.textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------- Add to calendar ---------------- */
function toUtcStamp(isoString){
  const d = new Date(isoString);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildCalendarLinks(event){
  const start = toUtcStamp(event.start);
  const end = toUtcStamp(event.end);
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.location);

  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;

  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${text}&startdt=${event.start}&enddt=${event.end}&body=${details}&location=${location}&path=/calendar/action/compose&rru=addevent`;

  const startDate = new Date(event.start);
  const durationMs = new Date(event.end).getTime() - startDate.getTime();
  const durH = pad(Math.floor(durationMs / 3600000));
  const durM = pad(Math.floor((durationMs % 3600000) / 60000));
  const yahoo = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${text}&st=${start}&dur=${durH}${durM}&desc=${details}&in_loc=${location}`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Casamento//PT-BR',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@casamento`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const icsUrl = 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);

  return { google, outlook, yahoo, icsUrl };
}

// O evento de agenda cobre apenas a cerimônia, já que o local da festa
// ainda está "a definir". Quando a recepção for confirmada, basta trocar
// CONFIG.ceremony.end pelo horário de término da festa.
const links = buildCalendarLinks(CONFIG.ceremony);

document.getElementById('calGoogle').href = links.google;
document.getElementById('calOutlook').href = links.outlook;
document.getElementById('calYahoo').href = links.yahoo;
document.getElementById('calIcs').href = links.icsUrl;

const calendarToggle = document.getElementById('calendarToggle');
const calendarMenu = document.getElementById('calendarMenu');
calendarToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = calendarMenu.classList.toggle('is-open');
  calendarToggle.setAttribute('aria-expanded', String(isOpen));
});
document.addEventListener('click', (e) => {
  if (!calendarMenu.contains(e.target) && e.target !== calendarToggle){
    calendarMenu.classList.remove('is-open');
    calendarToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---------------- RSVP form: sozinho/casal e filhos ---------------- */
const campoSozinho = document.getElementById('campoSozinho');
const campoCasal = document.getElementById('campoCasal');
const campoCasalEsposa = document.getElementById('campoCasalEsposa');
const nomeInput = document.getElementById('nome');
const nomeEsposoInput = document.getElementById('nomeEsposo');
const nomeEsposaInput = document.getElementById('nomeEsposa');

document.querySelectorAll('input[name="tipoConvidado"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const isCasal = document.getElementById('tipoCasal').checked;
    campoSozinho.hidden = isCasal;
    campoCasal.hidden = !isCasal;
    campoCasalEsposa.hidden = !isCasal;
    nomeInput.required = !isCasal;
    nomeEsposoInput.required = isCasal;
    nomeEsposaInput.required = isCasal;
  });
});

const campoFilhos = document.getElementById('campoFilhos');
const filhosDetalheInput = document.getElementById('filhosDetalhe');
document.querySelectorAll('input[name="temFilhos"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const temFilhos = document.getElementById('filhosSim').checked;
    campoFilhos.hidden = !temFilhos;
    filhosDetalheInput.required = temFilhos;
  });
});

/* ---------------- Máscara numérica do WhatsApp ---------------- */
const whatsappInput = document.getElementById('whatsapp');
whatsappInput.addEventListener('input', () => {
  const digits = whatsappInput.value.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if (digits.length > 10){
    formatted = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  } else if (digits.length > 6){
    formatted = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (digits.length > 2){
    formatted = digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  } else if (digits.length > 0){
    formatted = digits.replace(/(\d{0,2})/, '($1');
  }
  whatsappInput.value = formatted.trim();
});

/* ---------------- RSVP form (client-side feedback only) ---------------- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpNote = document.getElementById('rsvpNote');
rsvpForm.addEventListener('submit', () => {
  // A submissão real depende do "action" configurado no HTML
  // (Formspree, Google Forms, Netlify Forms, etc). Isto apenas
  // dá um retorno visual imediato ao usuário.
  rsvpNote.hidden = false;
});

/* ---------------- Copy Pix key ---------------- */
const pixBtn = document.getElementById('pixCopyBtn');
pixBtn.addEventListener('click', async () => {
  const key = pixBtn.dataset.pix;
  try{
    await navigator.clipboard.writeText(key);
    const original = pixBtn.textContent;
    pixBtn.textContent = 'Chave copiada!';
    setTimeout(() => { pixBtn.textContent = original; }, 2000);
  }catch(err){
    alert('Chave Pix: ' + key);
  }
});
