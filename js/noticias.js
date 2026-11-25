/* =========================================================
   Portal Antas Bahia — carrega as notícias publicadas no
   painel administrativo do Achei Fácil (coleção "noticias")
   e só depois liga o portal (js/app.js).
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyDbMlnT8pO0_JECJsGrQn2CNfcsKA6uyGQ",
  authDomain: "cidade-9528a.firebaseapp.com",
  projectId: "cidade-9528a",
  storageBucket: "cidade-9528a.firebasestorage.app",
  messagingSenderId: "475692348722",
  appId: "1:475692348722:web:f03639854c7243e917932b"
}, "portal");
const db = getFirestore(app);

// Imagem padrão (cor da editoria + nome do portal) para notícia sem foto
function capaPadrao(cor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="#061a33"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><text x="600" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="64" font-weight="900" font-style="italic" fill="#fff">PORTAL ANTAS BAHIA</text><text x="600" y="400" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" fill="#ffffffcc">Informação que conecta, comunidade que cresce</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const dois = n => String(n).padStart(2, "0");
const formatar = d => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())} ${dois(d.getHours())}:${dois(d.getMinutes())}`;
// Texto do painel → parágrafos (linha em branco separa; "## " vira intertítulo)
const paragrafos = t => String(t || "").split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);

// Usadas só se ainda não houver nenhuma notícia publicada no painel
const EXEMPLOS = [
  { id: "achei-facil-vira-aplicativo", categoria: "Cidade", autor: "Redação", data: new Date("2026-11-20T09:00:00"),
    titulo: "Achei Fácil vira aplicativo no dia 30 de novembro",
    texto: "O guia comercial de Antas chega à Play Store e à App Store no dia 30 de novembro.\n\nLojas, lanchonetes e prestadores de serviço da cidade ficam num só lugar, com contato direto pelo WhatsApp. Comerciantes podem cadastrar a empresa e testar o primeiro mês grátis." }
];

function converter(n, i) {
  const editoria = CATEGORIA_PARA_EDITORIA[n.categoria] || "antas";
  const texto = paragrafos(n.texto);
  return {
    id: n.id, editoria, chapeu: "", // a editoria já mostra a categoria
    titulo: n.titulo, subtitulo: texto.length > 1 ? texto[0].slice(0, 220) : "",
    autor: n.autor || "Redação", data: formatar(n.data || new Date()),
    imagem: n.imagem || capaPadrao(EDITORIAS[editoria].cor),
    destaque: i < 3, maisLida: i < 5 ? i + 1 : undefined,
    texto: texto.length > 1 ? texto.slice(1) : texto, link: n.link || ""
  };
}

try {
  const snap = await getDocs(query(collection(db, "noticias"), orderBy("criadoEm", "desc"), limit(60)));
  const lista = snap.docs.filter(d => !d.data().teste).map(d => {
    const x = d.data();
    return { id: d.id, titulo: x.titulo || x.title || "", texto: x.texto || x.content || "", imagem: String(x.imagemUrl || x.image || "").replace(/^\/portal\//, ""),
      categoria: x.categoria || "Geral", autor: x.autor || "", link: x.link || "", data: x.criadoEm?.toDate ? x.criadoEm.toDate() : null };
  }).filter(n => n.titulo);
  (lista.length ? lista : EXEMPLOS).forEach((n, i) => NOTICIAS.push(converter(n, i)));
} catch (e) {
  console.warn("Portal: não foi possível carregar as notícias.", e.code || e);
  EXEMPLOS.forEach((n, i) => NOTICIAS.push(converter(n, i)));
}

// Agora liga o portal
const s = document.createElement("script");
s.src = "js/app.js?v=7";
document.body.appendChild(s);
