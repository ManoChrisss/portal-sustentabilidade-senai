const SENAI_CATEGORIAS = [
  "Energia",
  "Água",
  "Reciclagem",
  "Resíduos",
  "Higiene e limpeza",
  "Conscientização ambiental",
  "Infraestrutura",
  "Tecnologia sustentável",
  "Reaproveitamento de materiais",
  "Outros"
];

/* Categorias específicas para o relato de problemas */
const SENAI_CATEGORIAS_PROBLEMA = [
  "Consumo de energia",
  "Consumo de água",
  "Reciclagem",
  "Descarte de resíduos",
  "Higiene e limpeza",
  "Infraestrutura",
  "Impacto ambiental",
  "Desperdício de materiais",
  "Outros"
];

/* Preenche um <select> com uma lista de opções */
function preencherSelect(select, lista, textoInicial) {
  if (!select) return;
  select.innerHTML = "";
  if (textoInicial) {
    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = textoInicial;
    select.appendChild(opcaoInicial);
  }
  lista.forEach((item) => {
    const opcao = document.createElement("option");
    opcao.value = item;
    opcao.textContent = item;
    select.appendChild(opcao);
  });
}

(function iniciarPagina() {
  /* ---------- Menu mobile ---------- */
  const botaoMenu = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-principal");

  function fecharMenu() {
    if (!botaoMenu || !menu) return;
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => {
      const abrir = !menu.classList.contains("aberto");
      menu.classList.toggle("aberto", abrir);
      botaoMenu.setAttribute("aria-expanded", String(abrir));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { fecharMenu(); botaoMenu.focus(); }
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", fecharMenu));
  }

  /* ---------- Sombra do cabeçalho ---------- */
  const cabecalho = document.querySelector(".site-header");
  function marcarRolagem() {
    if (cabecalho) cabecalho.classList.toggle("rolou", window.scrollY > 8);
  }
  window.addEventListener("scroll", marcarRolagem, { passive: true });
  marcarRolagem();

  /* ---------- Verificação do logo ---------- */
  document.querySelectorAll(".logo-container").forEach((container) => {
    const img = container.querySelector("img");
    if (!img) return;
    const verificar = () => {
      if (!img.complete) return;
      container.classList.toggle("logo-vazio", img.naturalWidth <= 2);
    };
    img.addEventListener("load", verificar);
    img.addEventListener("error", () => container.classList.add("logo-vazio"));
    verificar();
  });

  /* ---------- Entrada suave das seções ---------- */
  const elementos = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach((el) => observador.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visivel"));
  }

  /* ---------- Transição suave entre páginas ---------- */
  const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduzir) {
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        const mesmaAba = !link.target || link.target === "_self";
        const interno = href && !href.startsWith("#") && !/^(https?:|mailto:|tel:)/i.test(href);
        const teclaEspecial = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
        if (!interno || !mesmaAba || teclaEspecial) return;
        e.preventDefault();
        document.body.classList.add("saindo");
        setTimeout(() => { window.location.href = link.href; }, 200);
      });
    });
    // Ao voltar pelo botão "voltar" do navegador, remove o efeito de saída
    window.addEventListener("pageshow", () => document.body.classList.remove("saindo"));
  }
})();
