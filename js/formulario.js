const EMAILJS_PUBLIC_KEY = "-5Kwri3YujiMv39yH";
const EMAILJS_SERVICE_ID = "service_pgz0f39";
const EMAILJS_TEMPLATE_ID = "template_qpy1xiv";
const EMAILJS_RECIPIENTS = [
  "christianmatheus.102005@gmail.com",
  "christian.chaves@aedb.br",
  "christianmatheus1.102005@gmail.com",
];

/*lucylea.carvalho@gmail.com*/

const MODO_SIMULACAO = false;


  /*Textos e campos de cada tipo de envio*/
  
const TIPOS = {
  problema: {
    nome: "Relato de problema",
    rotuloTitulo: "Título do problema",
    rotuloDescricao: "Descrição do problema",
    explicacao: "Um relato de problema aponta algo que está errado ou desperdiçando recursos hoje (por exemplo, uma torneira vazando). Não precisa trazer a solução completa.",
    grupo: "grupo-problema",
    campos: {
      category: "categoria_problema",
      location: "local_problema",
      suggested_solution: "solucao_problema",
      additional_notes: "obs_problema"
    }
  },
  sugestao: {
    nome: "Sugestão de melhoria",
    rotuloTitulo: "Título da sugestão",
    rotuloDescricao: "Descrição da sugestão",
    explicacao: "Uma sugestão é uma ideia simples e direta para melhorar algo no SENAI, sem precisar de plano de execução ou orçamento.",
    grupo: "grupo-sugestao",
    campos: {
      category: "categoria_sugestao",
      location: "local_sugestao",
      additional_notes: "obs_sugestao"
    }
  },
  projeto: {
    nome: "Proposta de projeto de sustentabilidade",
    rotuloTitulo: "Título do projeto",
    rotuloDescricao: "Descrição do projeto",
    explicacao: "Uma proposta de projeto é um plano mais completo, com problema, solução, materiais, custo estimado, pessoas envolvidas e resultados esperados.",
    grupo: "grupo-projeto",
    campos: {
      category: "categoria_projeto",
      location: "local_projeto",
      problem_solved: "problema_projeto",
      project_solution: "solucao_projeto",
      materials: "materiais_projeto",
      estimated_cost: "custo_projeto",
      people_resources: "pessoas_projeto",
      expected_benefits: "beneficios_projeto",
      environmental_impact: "impacto_projeto",
      implementation_time: "prazo_projeto",
      additional_notes: "obs_projeto"
    }
  }
};

const NAO_INFORMADO = "Não informado";

const form = document.getElementById("form-contribuicao");

if (form) {
  const selectTipo = document.getElementById("tipo");
  const rotuloTitulo = document.getElementById("rotulo-titulo");
  const rotuloDescricao = document.getElementById("rotulo-descricao");
  const caixaExplicacao = document.getElementById("tipo-explica");
  const resumoErros = document.getElementById("resumo-erros");
  const mensagem = document.getElementById("mensagem-status");
  const botaoEnviar = document.getElementById("botao-enviar");

  /* ---------- Listas de categorias ---------- */
  preencherSelect(document.getElementById("categoria_problema"), SENAI_CATEGORIAS_PROBLEMA, "Selecione uma categoria");
  preencherSelect(document.getElementById("categoria_sugestao"), SENAI_CATEGORIAS, "Selecione uma categoria");
  preencherSelect(document.getElementById("categoria_projeto"), SENAI_CATEGORIAS, "Selecione uma categoria");

  /* ---------- Grupos condicionais ---------- */
  function definirGrupo(id, aberto) {
    const grupo = document.getElementById(id);
    if (!grupo) return;
    grupo.classList.toggle("aberto", aberto);
    // "inert" impede foco e leitura de campos escondidos
    if (aberto) grupo.removeAttribute("inert"); else grupo.setAttribute("inert", "");
    grupo.setAttribute("aria-hidden", String(!aberto));
    // Campos escondidos ficam desativados e não entram no envio
    grupo.querySelectorAll("input, select, textarea").forEach((campo) => { campo.disabled = !aberto; });
  }

  function atualizarTipo() {
    const tipo = selectTipo.value;
    const info = TIPOS[tipo];

    Object.keys(TIPOS).forEach((chave) => definirGrupo(TIPOS[chave].grupo, chave === tipo));

    caixaExplicacao.className = "tipo-explica";
    if (info) {
      rotuloTitulo.firstChild.nodeValue = info.rotuloTitulo;
      rotuloDescricao.firstChild.nodeValue = info.rotuloDescricao;
      caixaExplicacao.textContent = info.explicacao;
      caixaExplicacao.classList.add("tipo-" + tipo, "visivel");
    } else {
      rotuloTitulo.firstChild.nodeValue = "Título";
      rotuloDescricao.firstChild.nodeValue = "Descrição";
      caixaExplicacao.textContent = "";
    }
  }

  selectTipo.addEventListener("change", () => {
    atualizarTipo();
    limparErro(selectTipo);
  });

  /* Permite abrir o formulário já com o tipo escolhido: registrar.html?tipo=projeto */
  const tipoNaUrl = new URLSearchParams(window.location.search).get("tipo");
  if (tipoNaUrl && TIPOS[tipoNaUrl]) selectTipo.value = tipoNaUrl;
  atualizarTipo();

  /* ---------- Validação ---------- */
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const REGRAS = [
    { id: "nome", validar: (v) => v.split(/\s+/).filter(Boolean).length >= 2 || "Informe seu nome completo (nome e sobrenome)." },
    { id: "email", validar: (v) => v === "" ? "Informe seu e-mail." : (REGEX_EMAIL.test(v) || "Digite um e-mail válido, como nome@exemplo.com.") },
    { id: "tipo", validar: (v) => v !== "" || "Escolha o tipo de envio." },
    { id: "titulo", validar: (v) => v.length >= 5 || "Informe um título com pelo menos 5 caracteres." },
    { id: "descricao", validar: (v) => v.length >= 20 || "Descreva com pelo menos 20 caracteres para que possamos entender." }
  ];

  function campoDe(id) { return document.getElementById(id); }

  function mostrarErro(campo, texto) {
    const wrapper = campo.closest(".campo");
    const alvo = document.getElementById("erro-" + campo.id);
    wrapper.classList.add("campo--erro");
    campo.setAttribute("aria-invalid", "true");
    if (alvo) alvo.textContent = texto;
  }

  function limparErro(campo) {
    const wrapper = campo.closest(".campo");
    const alvo = document.getElementById("erro-" + campo.id);
    wrapper.classList.remove("campo--erro");
    campo.removeAttribute("aria-invalid");
    if (alvo) alvo.textContent = "";
  }

  function validarCampo(regra) {
    const campo = campoDe(regra.id);
    const resultado = regra.validar(campo.value.trim());
    if (resultado === true) { limparErro(campo); return null; }
    mostrarErro(campo, resultado);
    return { campo: campo, texto: resultado };
  }

  // Validação ao sair do campo e correção em tempo real
  REGRAS.forEach((regra) => {
    const campo = campoDe(regra.id);
    campo.addEventListener("blur", () => { if (campo.value !== "" || campo.closest(".campo--erro")) validarCampo(regra); });
    campo.addEventListener("input", () => { if (campo.closest(".campo--erro")) validarCampo(regra); });
  });

  function validarTudo() {
    const erros = REGRAS.map(validarCampo).filter(Boolean);
    resumoErros.innerHTML = "";
    if (erros.length === 0) { resumoErros.hidden = true; return true; }

    const titulo = document.createElement("strong");
    titulo.textContent = erros.length === 1 ? "Corrija 1 campo antes de enviar:" : "Corrija " + erros.length + " campos antes de enviar:";
    const ul = document.createElement("ul");
    erros.forEach((e) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + e.campo.id;
      a.textContent = e.texto;
      a.addEventListener("click", (ev) => { ev.preventDefault(); e.campo.focus(); });
      li.appendChild(a);
      ul.appendChild(li);
    });
    resumoErros.appendChild(titulo);
    resumoErros.appendChild(ul);
    resumoErros.hidden = false;
    resumoErros.scrollIntoView({ behavior: "smooth", block: "center" });
    erros[0].campo.focus({ preventScroll: true });
    return false;
  }

  /* ---------- Mensagens de resultado ---------- */
  function mostrarMensagem(tipo, texto, detalhe) {
    mensagem.className = "mensagem-status " + tipo + " visivel";
    mensagem.textContent = texto;
    if (detalhe) {
      const small = document.createElement("small");
      small.textContent = detalhe;
      mensagem.appendChild(small);
    }
    mensagem.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- Montagem dos dados enviados ao EmailJS ----------
     Os nomes (student_name, title, ...) devem ser iguais às
     variáveis {{...}} usadas no template do EmailJS. */
  function valorDe(id) {
    const campo = campoDe(id);
    const v = campo ? campo.value.trim() : "";
    return v || NAO_INFORMADO;
  }

  function montarParametros() {
    const tipo = selectTipo.value;
    const info = TIPOS[tipo];

    const params = {
      to_email: EMAILJS_RECIPIENTS.filter(Boolean).join(", "),
      student_name: valorDe("nome"),
      student_email: valorDe("email"),
      submission_type: info.nome,
      category: NAO_INFORMADO,
      title: valorDe("titulo"),
      description: valorDe("descricao"),
      location: NAO_INFORMADO,
      suggested_solution: NAO_INFORMADO,
      problem_solved: NAO_INFORMADO,
      project_solution: NAO_INFORMADO,
      materials: NAO_INFORMADO,
      estimated_cost: NAO_INFORMADO,
      people_resources: NAO_INFORMADO,
      expected_benefits: NAO_INFORMADO,
      environmental_impact: NAO_INFORMADO,
      implementation_time: NAO_INFORMADO,
      additional_notes: NAO_INFORMADO,
      submitted_at: new Date().toLocaleString("pt-BR")
    };

    Object.keys(info.campos).forEach((chave) => { params[chave] = valorDe(info.campos[chave]); });

    // Em projetos, a "solução proposta" também preenche o campo geral de solução
    if (tipo === "projeto") params.suggested_solution = params.project_solution;

    return params;
  }

  function emailjsConfigurado() {
    return [EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID]
      .every((v) => v && !v.startsWith("YOUR_"));
  }

  /* ---------- Envio ---------- */
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagem.className = "mensagem-status";
    mensagem.textContent = "";

    if (!validarTudo()) return;

    // Campo-isca contra robôs: pessoas não o veem nem preenchem
    if (form.elements["website"] && form.elements["website"].value) return;

    const params = montarParametros();
    const textoOriginal = botaoEnviar.textContent;
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

    try {
      if (MODO_SIMULACAO) {
        console.info("MODO_SIMULACAO: dados que seriam enviados ao EmailJS:", params);
        await new Promise((r) => setTimeout(r, 700));
      } else {
        if (!emailjsConfigurado()) {
          throw new Error("EmailJS ainda não configurado. Preencha as chaves em js/formulario.js (veja EMAILJS_SETUP.md).");
        }
        if (typeof emailjs === "undefined") {
          throw new Error("A biblioteca do EmailJS não carregou. Verifique a conexão com a internet.");
        }
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
      }

      mostrarMensagem("sucesso", "Enviado com sucesso! Sua contribuição será analisada.");
      form.reset();
      resumoErros.hidden = true;
      form.querySelectorAll(".campo--erro").forEach((w) => w.classList.remove("campo--erro"));
      atualizarTipo();
    } catch (erro) {
      console.error("Falha ao enviar pelo EmailJS:", erro);
      mostrarMensagem(
        "erro",
        "Não foi possível enviar agora. Tente novamente em alguns instantes.",
        "Se o problema continuar, avise a coordenação responsável pelo portal."
      );
    } finally {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoOriginal;
    }
  });
}
