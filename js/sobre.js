(() => {
  const modal = document.getElementById("modal-foto");
  const imagem = document.getElementById("foto-ampliada");
  const legenda = document.getElementById("legenda-foto");
  const botaoFechar = modal && modal.querySelector(".sobre-modal-fechar");

  if (!(modal instanceof HTMLDialogElement) || !(imagem instanceof HTMLImageElement) ||
      !(legenda instanceof HTMLElement) || !(botaoFechar instanceof HTMLButtonElement)) {
    return;
  }

  document.querySelectorAll("[data-foto-ampliar]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const miniatura = botao.querySelector("img");
      const caminho = (miniatura && miniatura.getAttribute("src")) || botao.getAttribute("data-foto-ampliar");
      const descricao = botao.getAttribute("data-foto-alt");
      if (!caminho || !descricao) return;

      imagem.src = caminho;
      imagem.alt = descricao;
      legenda.textContent = descricao;
      modal.showModal();
      botaoFechar.focus();
    });
  });

  botaoFechar.addEventListener("click", () => modal.close());
  modal.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    modal.close();
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modal.open) modal.close();
  });
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
  });
})();
