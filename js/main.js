const EMAIL = 'evolutiongamesofficial001@gmail.com';
const page = document.body.dataset.page;

// Cabeçalho e rodapé compartilhados
const links = [['index.html','Início','home'],['jogos.html','Jogos','jogos'],['contato.html','Contato','contato']];
document.body.insertAdjacentHTML('afterbegin', `
<canvas id="particles"></canvas>
<header>
  <a class="brand" href="index.html"><img src="assets/logo.png" alt="">Evolution Games</a>
  <button class="burger" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <nav>${links.map(l => `<a href="${l[0]}" class="${l[2]===page?'active':''}">${l[1]}</a>`).join('')}</nav>
</header>`);
document.body.insertAdjacentHTML('beforeend', `
<footer><span>© ${new Date().getFullYear()} Evolution Games Studio</span><a href="mailto:${EMAIL}">${EMAIL}</a></footer>`);

const burger = document.querySelector('.burger'), nav = document.querySelector('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; } });

// Página de jogos (lê data/games.json)
const EXTS = ['jpg','jpeg','png','webp','avif','gif'];
function imgCandidates(v) {
  if (!v) return [];
  let p = String(v).trim();
  if (/^(https?:|data:)/.test(p)) return [p];
  if (!/^(\/|\.\/|assets\/)/.test(p)) p = 'assets/jogos/' + p;   // aceita só o nome do arquivo
  const m = p.match(/^(.*)\.(\w+)$/);
  const hasExt = m && EXTS.includes(m[2].toLowerCase());
  const base = hasExt ? m[1] : p;
  const list = hasExt ? [p] : [];
  EXTS.forEach(e => { const c = base + '.' + e; if (!list.includes(c)) list.push(c); });
  return list.map(encodeURI);
}
const grid = document.getElementById('games');
if (grid) {
  fetch('data/games.json').then(r => r.json()).then(list => {
    grid.innerHTML = '';
    list.forEach(g => {
      const hasLink = g.link && String(g.link).trim() !== '';
      const el = document.createElement(hasLink ? 'a' : 'div');
      el.className = 'card';
      if (hasLink) { el.href = g.link; el.target = '_blank'; el.rel = 'noopener'; }
      const img = document.createElement('img');
      img.alt = g.nome || ''; img.loading = 'lazy';
      const c = imgCandidates(g.imagem); let i = 0;
      img.onerror = () => {
        i++;
        if (i < c.length) img.src = c[i];
        else { img.onerror = null; img.src = 'assets/logo.png'; img.classList.add('fallback'); }
      };
      img.src = c.length ? c[0] : 'assets/logo.png';
      if (!c.length) img.classList.add('fallback');
      const info = document.createElement('div');
      info.className = 'info';
      info.innerHTML = `<h3></h3>${g.descricao ? '<p></p>' : ''}${hasLink ? '<span class="go">Saiba mais</span>' : ''}`;
      info.querySelector('h3').textContent = g.nome || '';
      if (g.descricao) info.querySelector('p').textContent = g.descricao;
      el.append(img, info);
      grid.appendChild(el);
    });
  }).catch(() => {
    grid.outerHTML = '<p class="msg">Não foi possível carregar os jogos. Abra o site por um servidor (ex.: Live Server) ou hospedagem.</p>';
  });
}

// Formulário de contato (abre o app de e-mail)
const form = document.getElementById('form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  const body = `${f.get('msg')}\n\nDe: ${f.get('nome')} (${f.get('email')})`;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(f.get('assunto'))}&body=${encodeURIComponent(body)}`;
});
