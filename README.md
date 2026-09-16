# Convite de Casamento — Evandro & Vitória

Landing page estática (HTML/CSS/JS puro, sem build) para convite de casamento católico,
com contagem regressiva e botões de "adicionar à agenda" (Google Calendar, Outlook,
Yahoo Calendar e arquivo .ics para Apple Calendar/Outlook desktop).

## Estrutura

```
index.html      → conteúdo da página
css/style.css   → estilos, paleta, tipografia, animações
js/main.js      → contagem regressiva, links de agenda, menu, reveal-on-scroll
```

## Como visualizar localmente

### Opção A — Docker (recomendado, ambiente já preparado neste projeto)

```bash
docker compose up -d
```

- **http://localhost:8080** → modo dev, recarrega o navegador sozinho a cada save (live-reload)
- **http://localhost:8081** → preview via nginx puro, igual a um host estático real (GitHub Pages/Netlify/Vercel)

Para derrubar: `docker compose down`. Para ver os logs do live-reload: `docker compose logs -f dev`.

### Opção B — sem Docker

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

(Abrir o `index.html` direto com duplo clique também funciona, mas alguns navegadores
bloqueiam recursos locais — um servidor evita esse tipo de problema.)

## O que personalizar

Todos os pontos de edição estão marcados com o comentário `EDITE AQUI` nos arquivos.
Os principais:

- **Nomes do casal**: `index.html` (hero e footer).
- **Data, horários e locais da cerimônia/recepção**: edite o objeto `CONFIG` no topo de
  `js/main.js` — ele alimenta automaticamente a contagem regressiva e os links de agenda.
  Lembre-se de manter os textos exibidos no `index.html` (data no hero, cards de
  cerimônia/recepção) consistentes com esses valores.
- **Endereços e links do Google Maps**: cards de "Cerimônia & Recepção" no `index.html`.
- **Traje sugerido**: seção "Traje".
- **Lista de presentes / chave Pix**: seção "Presentes".
- **Cores**: variáveis no topo de `css/style.css` (`:root`).

## Formulário de confirmação de presença (RSVP)

Uma página estática não consegue processar envios de formulário sozinha. O formulário já
está pronto visualmente, mas para receber as respostas você precisa ligá-lo a um serviço
de formulários, por exemplo:

- [Formspree](https://formspree.io) — troque `action="https://formspree.io/f/SEU_ID_AQUI"` no `index.html` pelo seu endpoint.
- [Netlify Forms](https://docs.netlify.com/forms/setup/) — se hospedar no Netlify, basta adicionar `data-netlify="true"` ao `<form>`.
- Google Forms — pode substituir a seção inteira por um `<iframe>` do seu formulário.

## Tipografia

- **Cinzel** — fonte de letras capitais inspirada nas inscrições clássicas romanas
  (a mesma linguagem visual usada em monumentos e edifícios do Vaticano). Não existe uma
  fonte gratuita oficial "Vaticana"; Cinzel é a alternativa mais próxima e mais usada
  no mercado para essa estética.
- **Great Vibes** — caligrafia manuscrita, para os nomes do casal.
- **Cormorant Garamond** — serifada elegante, para o texto corrido.

Todas carregadas via Google Fonts, sem necessidade de instalar nada.

## Deploy

Por ser 100% estático, pode ser hospedado gratuitamente em:

- **GitHub Pages**: suba os arquivos para um repositório e ative Pages nas configurações.
- **Netlify** ou **Vercel**: arraste a pasta no painel, ou conecte o repositório.
