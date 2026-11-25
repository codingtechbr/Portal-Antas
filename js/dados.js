/* =========================================================
   PORTAL ANTAS BAHIA — dentro do Achei Fácil
   ---------------------------------------------------------
   As notícias NÃO ficam neste arquivo: elas vêm do painel
   administrativo do Achei Fácil (área "Notícias"), as mesmas
   que aparecem no app. Este arquivo só guarda a configuração.
   ========================================================= */

const SITE = {
  nome: "Portal Antas Bahia",
  slogan: "Informação que conecta, comunidade que cresce",
  sigla: "PA",
  whatsapp: "5575988701513",
  email: "contato@acheifacil.app",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  youtube: "https://youtube.com/"
};

/* Editorias: a "categoria" escolhida no painel vira a editoria aqui */
const EDITORIAS = {
  "antas":    { nome: "Antas",    cor: "#0a2545", desc: "Tudo o que acontece na nossa cidade" },
  "politica": { nome: "Política", cor: "#5b2c83", desc: "Câmara, prefeitura, governo e eleições" },
  "economia": { nome: "Economia", cor: "#0f7a4a", desc: "Mercado, comércio e seu bolso" },
  "empregos": { nome: "Empregos", cor: "#0891b2", desc: "Vagas, concursos e seleções" },
  "saude":    { nome: "Saúde",    cor: "#0e8a9c", desc: "Bem-estar, SUS e prevenção" },
  "esportes": { nome: "Esportes", cor: "#e36414", desc: "Futebol amador, campeonatos e mais" },
  "cultura":  { nome: "Cultura",  cor: "#c2185b", desc: "Festas, forró, eventos e turismo" }
};
const CATEGORIA_PARA_EDITORIA = {
  "Geral": "antas", "Cidade": "antas", "Política": "politica", "Economia": "economia",
  "Empregos": "empregos", "Saúde": "saude", "Esporte": "esportes", "Cultura": "cultura"
};

/* Cidades da previsão do tempo (latitude / longitude) */
const CIDADES_TEMPO = [
  { nome: "Antas", lat: -10.3858, lon: -38.3328 },
  { nome: "Cícero Dantas", lat: -10.5997, lon: -38.3828 },
  { nome: "Ribeira do Pombal", lat: -10.8340, lon: -38.5360 },
  { nome: "Paulo Afonso", lat: -9.4060, lon: -38.2144 },
  { nome: "Feira de Santana", lat: -12.2664, lon: -38.9663 },
  { nome: "Salvador", lat: -12.9714, lon: -38.5014 }
];

/* Espaços de patrocínio — levam para o Achei Fácil */
const PATROCINIOS = {
  topo:    { achei: true, texto: "Lojas, delivery e serviços de Antas no seu celular", botao: "Abrir", link: "https://achei-facil.vercel.app/" },
  lateral: { texto: "Anuncie no Portal Antas Bahia", link: "anuncie.html" },
  feed:    { achei: true, texto: "Tem um negócio? Coloque no Achei Fácil — 1º mês grátis", botao: "Saiba mais", link: "https://achei-facil.vercel.app/" },
  artigo:  { texto: "Sua marca dentro das notícias de Antas", link: "anuncie.html" },
  apoiadores: [{ nome: "Achei Fácil", link: "https://achei-facil.vercel.app/" }, "Seu comércio", "Sua farmácia", "Seu supermercado", "Sua loja", "Sua empresa"]
};

/* Preenchida por js/noticias.js com as notícias do painel do Achei Fácil */
const NOTICIAS = [];
