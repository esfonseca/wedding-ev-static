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

/* ---------------- RSVP: só carrega o restante após escolher a presença ---------------- */
const formRestante = document.getElementById('formRestante');
const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');
const campoNomeAusente = document.getElementById('campoNomeAusente');
const nomeAusenteInput = document.getElementById('nomeAusente');
const campoMensagem = document.getElementById('campoMensagem');

function updatePresencaUI(){
  const presencaSelecionada = document.querySelector('input[name="presenca"]:checked');
  const respondeu = !!presencaSelecionada;
  const vaiComparecer = respondeu && presencaSelecionada.value === 'sim';

  formRestante.hidden = !vaiComparecer;
  // Desabilita (não só esconde) os campos do restante: assim eles ficam de
  // fora da validação do navegador e não são enviados junto no FormData,
  // evitando que um campo obrigatório invisível trave o envio em silêncio
  // e evitando duplicar o nome enviado junto com o campo abaixo.
  formRestante.querySelectorAll('input, textarea').forEach((el) => { el.disabled = !vaiComparecer; });
  if (vaiComparecer) {
    updateTipoConvidadoUI();
    updateFilhosUI();
  }

  const semComparecimento = respondeu && !vaiComparecer;
  campoNomeAusente.hidden = !semComparecimento;
  nomeAusenteInput.disabled = !semComparecimento;
  nomeAusenteInput.required = semComparecimento;

  campoMensagem.hidden = !respondeu;
  rsvpSubmitBtn.hidden = !respondeu;
  rsvpSubmitBtn.textContent = vaiComparecer ? 'Enviar Confirmação' : 'Enviar';
}

document.querySelectorAll('input[name="presenca"]').forEach((radio) => {
  radio.addEventListener('change', updatePresencaUI);
});

/* ---------------- RSVP form: sozinho/casal e filhos ---------------- */
const campoSozinho = document.getElementById('campoSozinho');
const campoCasal = document.getElementById('campoCasal');
const campoCasalEsposa = document.getElementById('campoCasalEsposa');
const nomeInput = document.getElementById('nome');
const nomeEsposoInput = document.getElementById('nomeEsposo');
const nomeEsposaInput = document.getElementById('nomeEsposa');

function updateTipoConvidadoUI(){
  const isCasal = document.getElementById('tipoCasal').checked;
  campoSozinho.hidden = isCasal;
  campoCasal.hidden = !isCasal;
  campoCasalEsposa.hidden = !isCasal;
  nomeInput.required = !isCasal;
  nomeEsposoInput.required = isCasal;
  nomeEsposaInput.required = isCasal;
}
document.querySelectorAll('input[name="tipoConvidado"]').forEach((radio) => {
  radio.addEventListener('change', updateTipoConvidadoUI);
});

const campoFilhos = document.getElementById('campoFilhos');
const filhosDetalheInput = document.getElementById('filhosDetalhe');
function updateFilhosUI(){
  const temFilhos = document.getElementById('filhosSim').checked;
  campoFilhos.hidden = !temFilhos;
  filhosDetalheInput.required = temFilhos;
}
document.querySelectorAll('input[name="temFilhos"]').forEach((radio) => {
  radio.addEventListener('change', updateFilhosUI);
});

// Chamado aqui (e não logo após sua definição) porque updatePresencaUI
// depende de updateTipoConvidadoUI/updateFilhosUI já estarem declaradas.
updatePresencaUI();

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

/* ---------------- RSVP: modal de agradecimento com fogos suaves ---------------- */
const rsvpModal = document.getElementById('rsvpModal');
const rsvpFireworks = document.getElementById('rsvpFireworks');
const rsvpModalMsg = document.getElementById('rsvpModalMsg');
const rsvpModalGift = document.getElementById('rsvpModalGift');
const SPARK_COLORS = ['var(--gold)', 'var(--gold-light)', 'var(--gold-script)', 'var(--olive)'];

const RSVP_MESSAGES = {
  sim: 'Que alegria! Sua confirmação foi recebida com todo o carinho — contamos os dias para celebrar esse momento tão especial ao seu lado. 💛',
  nao: 'Agradecemos pela sua resposta! Sentiremos sua falta, mas ficamos felizes que você nos avisou — você segue em nosso coração e em nossas orações.'
};

function launchFireworks(){
  rsvpFireworks.innerHTML = '';
  const sparkCount = 20;
  for (let i = 0; i < sparkCount; i++){
    const spark = document.createElement('span');
    spark.className = 'rsvp-spark';
    const angle = (360 / sparkCount) * i + (Math.random() * 10 - 5);
    const distance = 50 + Math.random() * 40;
    const delay = Math.random() * 0.25;
    const color = SPARK_COLORS[i % SPARK_COLORS.length];
    spark.style.setProperty('--spark-angle', `${angle}deg`);
    spark.style.setProperty('--spark-distance', `${distance}px`);
    spark.style.setProperty('--spark-delay', `${delay}s`);
    spark.style.setProperty('--spark-color', color);
    rsvpFireworks.appendChild(spark);
  }
}

function openRsvpModal(attending){
  rsvpModalMsg.textContent = attending ? RSVP_MESSAGES.sim : RSVP_MESSAGES.nao;
  rsvpModalGift.hidden = attending;
  rsvpModal.hidden = false;
  rsvpModal.classList.add('is-open');
  if (attending) {
    launchFireworks();
  } else {
    rsvpFireworks.innerHTML = '';
  }
  document.addEventListener('keydown', onRsvpModalKeydown);
}

function closeRsvpModal(){
  rsvpModal.classList.remove('is-open');
  rsvpModal.hidden = true;
  rsvpFireworks.innerHTML = '';
  document.removeEventListener('keydown', onRsvpModalKeydown);
}

function onRsvpModalKeydown(e){
  if (e.key === 'Escape') closeRsvpModal();
}

rsvpModal.querySelectorAll('[data-rsvp-close]').forEach((el) => {
  el.addEventListener('click', closeRsvpModal);
});

/* ---------------- RSVP form: envio via AJAX (Formspree) ---------------- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpError = document.getElementById('rsvpError');
const rsvpButton = rsvpSubmitBtn;

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  rsvpError.hidden = true;
  rsvpButton.disabled = true;

  try {
    const formData = new FormData(rsvpForm);
    const attending = formData.get('presenca') !== 'nao';
    const response = await fetch(rsvpForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (response.ok) {
      rsvpForm.reset();
      updatePresencaUI();
      updateTipoConvidadoUI();
      updateFilhosUI();
      openRsvpModal(attending);
    } else {
      rsvpError.hidden = false;
    }
  } catch (err) {
    rsvpError.hidden = false;
  } finally {
    rsvpButton.disabled = false;
  }
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
