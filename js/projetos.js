/*
icons:
  Natureza:  natureza-arvore, natureza-floresta, natureza-muda, natureza-folha, natureza-campo, natureza-flor, natureza-abelha, natureza-planeta
  Recursos:  energia-raio, energia-bateria, energia-sol, agua-gota, agua-torneira
  Resíduos:  residuos-reciclagem, residuos-lixeira, residuos-descarte
  Outros:    transporte-bicicleta, limpeza-vassoura, clima-vento, educacao-livro, industria-fabrica, transporte-carro, alimento-cenoura, cultivo-vaso
*/


/* projetos */

const PROJETOS = [
    /*
    {
      title: "Desperdício de energia",
      description: "Projeto para reduzir o desperdicio de energia.",
      category: "Energia",
      icon: "energia-raio",
      status: "em-andamento",
      date: "2026-11-05",
      responsible: "Gabriel, Heitor, Júnior, Zampiere, Leonardo, Romulo, Kaua",
      materials: ["Papelão", "Papel", "Caneta", "Lápis", "Tesoura"],
      benefits: "Redução do desperdicio de energia."
    },
    */

    /*   
    {
      title: "Desperdício de água",
      description: "Projeto para reduzir o desperdicio de água.",
      category: "Água",
      icon: "agua-gota",
      status: "em-andamento",
      date: "2026-11-05",
      responsible: "Lavínia, Beatriz, João Gabriel, Gabriela",
      materials: ["Papelão", "Papel", "Caneta", "Lápis", "Tesoura"],
      benefits: "Redução do desperdicio de água."
    },
*/ 
    


];



/*titulo*/
const PROJETO_EM_DESTAQUE = "Desperdício de energia";

const STATUS_INFO = {
  "em-andamento": { rotulo: "EM ANDAMENTO", classe: "status-em-andamento" },
  "concluido":    { rotulo: "CONCLUÍDO",    classe: "status-concluido" },
  "pendente":     { rotulo: "PENDENTE",     classe: "status-pendente" }
};

const ICONES_CATEGORIA = {
  "energia": "energia-raio",
  "agua": "agua-gota",
  "reciclagem": "residuos-reciclagem",
  "residuos": "residuos-lixeira",
  "higiene e limpeza": "limpeza-vassoura",
  "conscientizacao ambiental": "natureza-planeta",
  "infraestrutura": "industria-fabrica",
  "tecnologia sustentavel": "energia-bateria",
  "reaproveitamento de materiais": "cultivo-vaso",
  "outros": "natureza-muda"
};

const ICONES_PROJETO = [
  "natureza-arvore", "natureza-floresta", "natureza-muda", "natureza-folha",
  "natureza-campo", "natureza-flor", "natureza-abelha", "natureza-planeta",
  "energia-raio", "energia-bateria", "energia-sol", "agua-gota", "agua-torneira",
  "residuos-reciclagem", "residuos-lixeira", "residuos-descarte",
  "transporte-bicicleta", "limpeza-vassoura", "clima-vento", "educacao-livro",
  "industria-fabrica", "transporte-carro", "alimento-cenoura", "cultivo-vaso"
];

/* Garante valores válidos para cada projeto */
function normalizarProjeto(p) {
  let status = p.status;
  if (!STATUS_INFO[status]) {
    console.warn('Status inválido em "' + p.title + '": use "pendente", "em-andamento" ou "concluido". Usando "pendente".');
    status = "pendente";
  }
  const categoria = p.category || "Outros";
  const iconeCategoria = ICONES_CATEGORIA[normalizarTexto(categoria)] || ICONES_CATEGORIA.outros;
  const iconeInformado = typeof p.icon === "string" ? p.icon.trim() : "";
  const icon = ICONES_PROJETO.includes(iconeInformado) ? iconeInformado : iconeCategoria;
  if (iconeInformado && icon !== iconeInformado) {
    console.warn('Ícone inválido em "' + p.title + '": confira a lista de classes no modelo. Usando o ícone da categoria.');
  }
  return {
    title: p.title || "Projeto sem título",
    description: p.description || "",
    category: categoria,
    icon: icon,
    status: status,
    date: p.date || "",
    responsible: p.responsible || "",
    materials: Array.isArray(p.materials) ? p.materials.filter(Boolean) : [],
    benefits: p.benefits || ""
  };
}

const LISTA_PROJETOS = (typeof PROJETOS !== "undefined" ? PROJETOS : [])
  .map(normalizarProjeto)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

/* "2026-11-05" → "05/11/2026" (sem usar Date, para evitar erro de fuso horário) */
function formatarData(texto) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto || "");
  return m ? m[3] + "/" + m[2] + "/" + m[1] : (texto || "");
}

/* Remove acentos e maiúsculas, para a busca ignorar diferenças */
function normalizarTexto(texto) {
  return (texto || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/* Cria um elemento com classe e texto (textContent evita HTML indesejado) */
function criarEl(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function criarSeloStatus(status) {
  const info = STATUS_INFO[status];
  return criarEl("span", "status-selo " + info.classe, info.rotulo);
}

/* ---------- Card de projeto ---------- */
function criarCard(p, indice) {
  const card = criarEl("details", "projeto-card");
  card.dataset.status = p.status;
  card.style.animationDelay = Math.min(indice, 8) * 50 + "ms";

  const resumo = criarEl("summary", "projeto-resumo");
  resumo.appendChild(criarEl("span", "projeto-icone projeto-icone--" + p.icon));

  const titulo = criarEl("span", "projeto-resumo-titulo");
  titulo.appendChild(criarEl("span", "categoria-tag", p.category));
  titulo.appendChild(criarEl("h3", "", p.title));
  resumo.appendChild(titulo);

  const acao = criarEl("span", "projeto-resumo-acao");
  acao.appendChild(criarSeloStatus(p.status));
  acao.appendChild(criarEl("span", "projeto-chevron", "⌄"));
  resumo.appendChild(acao);
  card.appendChild(resumo);

  const conteudo = criarEl("div", "projeto-conteudo");
  if (p.description) conteudo.appendChild(criarEl("p", "", p.description));

  const meta = criarEl("dl", "projeto-meta");
  if (p.date) {
    meta.appendChild(criarEl("dt", "", "Data"));
    meta.appendChild(criarEl("dd", "", formatarData(p.date)));
  }
  if (p.responsible) {
    meta.appendChild(criarEl("dt", "", "Responsável"));
    meta.appendChild(criarEl("dd", "", p.responsible));
  }
  if (meta.children.length) conteudo.appendChild(meta);

  if (p.materials.length) {
    const bloco = criarEl("div", "projeto-bloco");
    bloco.appendChild(criarEl("h4", "", "Materiais"));
    const lista = criarEl("ul", "chips");
    p.materials.forEach((m) => lista.appendChild(criarEl("li", "", m)));
    bloco.appendChild(lista);
    conteudo.appendChild(bloco);
  }

  if (p.benefits) {
    const bloco = criarEl("div", "projeto-bloco");
    bloco.appendChild(criarEl("h4", "", "Benefícios esperados"));
    bloco.appendChild(criarEl("p", "", p.benefits));
    conteudo.appendChild(bloco);
  }
  card.appendChild(conteudo);
  return card;
}

/* ---------- Estatísticas (página inicial) ---------- */
function contarPorStatus() {
  return {
    total: LISTA_PROJETOS.length,
    andamento: LISTA_PROJETOS.filter((p) => p.status === "em-andamento").length,
    concluido: LISTA_PROJETOS.filter((p) => p.status === "concluido").length,
    pendente: LISTA_PROJETOS.filter((p) => p.status === "pendente").length
  };
}

function animarNumero(el, valor) {
  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduzir || valor === 0) { el.textContent = valor; return; }
  const duracao = 900;
  const inicio = performance.now();
  function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    el.textContent = Math.round(valor * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

function atualizarEstatisticas() {
  const numeros = contarPorStatus();
  document.querySelectorAll("[data-stat]").forEach((el) => {
    const valor = numeros[el.dataset.stat];
    if (valor !== undefined) animarNumero(el, valor);
  });
}

/* ---------- Projeto em destaque (página inicial) ---------- */
function mostrarDestaque() {
  const secao = document.getElementById("destaque");
  const alvo = document.getElementById("destaque-conteudo");
  if (!secao || !alvo || !PROJETO_EM_DESTAQUE) return;

  const p = LISTA_PROJETOS.find((x) => normalizarTexto(x.title) === normalizarTexto(PROJETO_EM_DESTAQUE));
  if (!p) {
    console.warn('PROJETO_EM_DESTAQUE não corresponde a nenhum título em PROJETOS: "' + PROJETO_EM_DESTAQUE + '"');
    return;
  }

  alvo.innerHTML = "";
  const lado = criarEl("div", "destaque-lado");
  lado.appendChild(criarEl("span", "selo-destaque", "Projeto em destaque"));
  lado.appendChild(criarEl("h3", "", p.title));
  const selo = criarSeloStatus(p.status);
  selo.style.alignSelf = "flex-start";
  lado.appendChild(selo);

  const corpo = criarEl("div", "destaque-corpo");
  if (p.description) corpo.appendChild(criarEl("p", "", p.description));
  const dl = criarEl("dl", "projeto-meta");
  dl.appendChild(criarEl("dt", "", "Categoria"));
  dl.appendChild(criarEl("dd", "", p.category));
  if (p.responsible) { dl.appendChild(criarEl("dt", "", "Responsável")); dl.appendChild(criarEl("dd", "", p.responsible)); }
  if (p.date) { dl.appendChild(criarEl("dt", "", "Data")); dl.appendChild(criarEl("dd", "", formatarData(p.date))); }
  corpo.appendChild(dl);
  if (p.benefits) corpo.appendChild(criarEl("p", "", p.benefits));
  const link = criarEl("a", "btn btn-verde", "Ver todos os projetos");
  link.href = "projetos.html";
  corpo.appendChild(link);

  alvo.appendChild(lado);
  alvo.appendChild(corpo);
  secao.hidden = false;
}

/* ---------- Página de projetos: filtros e busca ---------- */
function iniciarPaginaProjetos() {
  const lista = document.getElementById("lista-projetos");
  if (!lista) return;

  const areaFiltros = document.getElementById("area-filtros");
  const estadoVazio = document.getElementById("estado-vazio");
  const semResultados = document.getElementById("sem-resultados");
  const contador = document.getElementById("contador-resultados");
  const campoBusca = document.getElementById("busca");
  const selectCategoria = document.getElementById("filtro-categoria");
  const botoesStatus = document.querySelectorAll(".filtro-status button");

  // Nenhum projeto cadastrado → mostra o estado vazio e esconde os filtros
  if (LISTA_PROJETOS.length === 0) {
    if (areaFiltros) areaFiltros.hidden = true;
    if (contador) contador.hidden = true;
    if (estadoVazio) estadoVazio.hidden = false;
    return;
  }

  // Categorias do filtro: lista padrão + qualquer categoria nova usada em projetos
  const categorias = SENAI_CATEGORIAS.slice();
  LISTA_PROJETOS.forEach((p) => { if (!categorias.includes(p.category)) categorias.push(p.category); });
  preencherSelect(selectCategoria, categorias, "Todas as categorias");

  // Contagem em cada botão de status
  const numeros = contarPorStatus();
  const mapaContagem = { "todos": numeros.total, "pendente": numeros.pendente, "em-andamento": numeros.andamento, "concluido": numeros.concluido };
  botoesStatus.forEach((b) => {
    const span = b.querySelector(".contagem");
    if (span) span.textContent = mapaContagem[b.dataset.status];
  });

  const estado = { status: "todos", categoria: "", busca: "" };

  function aplicar() {
    const busca = normalizarTexto(estado.busca);
    const filtrados = LISTA_PROJETOS.filter((p) => {
      if (estado.status !== "todos" && p.status !== estado.status) return false;
      if (estado.categoria && p.category !== estado.categoria) return false;
      if (busca && !(normalizarTexto(p.title).includes(busca) || normalizarTexto(p.category).includes(busca))) return false;
      return true;
    });

    lista.innerHTML = "";
    filtrados.forEach((p, i) => lista.appendChild(criarCard(p, i)));
    if (semResultados) semResultados.hidden = filtrados.length > 0;
    if (contador) {
      contador.textContent = filtrados.length === 1
        ? "1 projeto encontrado"
        : filtrados.length + " projetos encontrados";
    }
  }

  botoesStatus.forEach((b) => {
    b.addEventListener("click", () => {
      estado.status = b.dataset.status;
      botoesStatus.forEach((outro) => outro.setAttribute("aria-pressed", String(outro === b)));
      aplicar();
    });
  });
  if (selectCategoria) selectCategoria.addEventListener("change", () => { estado.categoria = selectCategoria.value; aplicar(); });
  if (campoBusca) campoBusca.addEventListener("input", () => { estado.busca = campoBusca.value; aplicar(); });

  const limpar = document.getElementById("limpar-filtros");
  if (limpar) {
    limpar.addEventListener("click", () => {
      estado.status = "todos"; estado.categoria = ""; estado.busca = "";
      if (campoBusca) campoBusca.value = "";
      if (selectCategoria) selectCategoria.value = "";
      botoesStatus.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === "todos")));
      aplicar();
      if (campoBusca) campoBusca.focus();
    });
  }

  aplicar();
}

atualizarEstatisticas();
mostrarDestaque();
iniciarPaginaProjetos();
