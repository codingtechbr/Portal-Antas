/* =========================================================
   Player da Rádio Tropical 87.9 FM (Antas-BA) — ao vivo
   Usado no Achei Fácil (index.html) e no Portal Antas Bahia.
   Uso: <div data-radio-tropical></div> + <script src="radio.js"></script>
   (o atributo data-logo indica o caminho do logo, se a página
   estiver em outra pasta)
   ========================================================= */
(function () {
  const STREAM = "https://server09.srvsh.com.br:6870/stream";
  const NOME = "Rádio Tropical 87.9 FM";
  const SLOGAN = "Tá na Tropical? Tá legal!";

  const css = `
  .rt-player{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;color:#fff;
    background:radial-gradient(circle at 100% 0%,rgba(255,196,0,.35),transparent 45%),linear-gradient(120deg,#E8540C,#C2185B 70%,#7B1450);
    box-shadow:0 8px 22px rgba(194,24,91,.25);font-family:inherit;position:relative;overflow:hidden}
  .rt-logo{width:54px;height:54px;border-radius:14px;object-fit:cover;flex-shrink:0;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.2)}
  .rt-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .rt-vivo{display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.95}
  .rt-vivo i{width:7px;height:7px;border-radius:50%;background:#fff;opacity:.6}
  .rt-player.tocando .rt-vivo i{background:#FFE14D;opacity:1;animation:rt-pulso 1.2s infinite}
  .rt-nome{font-size:16px;font-weight:800;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-status{font-size:12.5px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rt-btn{width:50px;height:50px;border-radius:50%;border:0;flex-shrink:0;cursor:pointer;background:#fff;color:#C2185B;
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.2);transition:transform .15s}
  .rt-btn:active{transform:scale(.94)}
  .rt-btn svg{width:22px;height:22px}
  .rt-btn .rt-carrega{width:22px;height:22px;border:3px solid #f3c6d8;border-top-color:#C2185B;border-radius:50%;animation:rt-gira .8s linear infinite}
  .rt-ondas{display:none;gap:3px;align-items:flex-end;height:14px;margin-left:2px}
  .rt-ondas b{width:3px;background:#FFE14D;border-radius:2px;animation:rt-onda 1s ease-in-out infinite}
  .rt-ondas b:nth-child(2){animation-delay:.2s}.rt-ondas b:nth-child(3){animation-delay:.4s}
  .rt-player.tocando .rt-ondas{display:inline-flex}
  @keyframes rt-pulso{50%{opacity:.35}}
  @keyframes rt-gira{to{transform:rotate(360deg)}}
  @keyframes rt-onda{0%,100%{height:4px}50%{height:14px}}`;

  const ICONE_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  const ICONE_PAUSA = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>';

  let audio = null;
  const players = [];

  function estado(e, texto) {
    players.forEach(p => {
      p.el.classList.toggle("tocando", e === "tocando");
      p.btn.innerHTML = e === "carregando" ? '<span class="rt-carrega"></span>' : e === "tocando" ? ICONE_PAUSA : ICONE_PLAY;
      p.btn.setAttribute("aria-label", e === "tocando" ? "Pausar a rádio" : "Ouvir a rádio ao vivo");
      p.status.textContent = texto;
    });
  }

  function parar() {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src"); audio.load(); // solta a conexão: ao voltar, pega o ao vivo
    estado("parado", SLOGAN);
  }

  function tocar(logo) {
    if (!audio) {
      audio = new Audio();
      audio.preload = "none";
      audio.addEventListener("playing", () => estado("tocando", "Tocando agora · ao vivo"));
      audio.addEventListener("waiting", () => estado("carregando", "Conectando…"));
      audio.addEventListener("error", () => { if (audio.getAttribute("src")) estado("parado", "Rádio fora do ar no momento. Tente mais tarde."); });
    }
    estado("carregando", "Conectando…");
    audio.src = STREAM + "?t=" + Date.now();
    audio.play().catch(() => estado("parado", "Toque de novo para ouvir."));
    // Controles na tela de bloqueio do celular
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: NOME, artist: "Ao vivo de Antas-BA", artwork: [{ src: logo, sizes: "150x150", type: "image/jpeg" }] });
      navigator.mediaSession.setActionHandler("pause", parar);
      navigator.mediaSession.setActionHandler("stop", parar);
      navigator.mediaSession.setActionHandler("play", () => tocar(logo));
    }
  }

  function montar(el) {
    if (el.dataset.rtPronto) return;
    el.dataset.rtPronto = "1";
    const logo = el.dataset.logo || "img/radio-tropical.jpg";
    el.innerHTML = `<div class="rt-player">
      <img class="rt-logo" src="${logo}" alt="${NOME}" width="54" height="54">
      <div class="rt-info">
        <span class="rt-vivo"><i></i>Rádio ao vivo<span class="rt-ondas"><b></b><b></b><b></b></span></span>
        <span class="rt-nome">${NOME}</span>
        <span class="rt-status">${SLOGAN}</span>
      </div>
      <button class="rt-btn" type="button" aria-label="Ouvir a rádio ao vivo">${ICONE_PLAY}</button>
    </div>`;
    const p = { el: el.firstElementChild, btn: el.querySelector(".rt-btn"), status: el.querySelector(".rt-status") };
    players.push(p);
    p.btn.onclick = () => (audio && !audio.paused && audio.getAttribute("src")) ? parar() : tocar(logo);
  }

  function iniciar() {
    if (!document.getElementById("rt-css")) {
      const s = document.createElement("style"); s.id = "rt-css"; s.textContent = css; document.head.appendChild(s);
    }
    document.querySelectorAll("[data-radio-tropical]").forEach(montar);
  }
  window.RadioTropical = { iniciar };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", iniciar) : iniciar();
})();
