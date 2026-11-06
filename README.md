# Portal de Sustentabilidade – FIRJAN SENAI

Site em **HTML, CSS e JavaScript puros** (sem frameworks) para os alunos relatarem problemas, enviarem sugestões e proporem projetos de sustentabilidade. Não usa servidor nem banco de dados.

## Como abrir

Dê dois cliques em `index.html`. Para testar o envio de formulários, siga o `EMAILJS_SETUP.md`.

## Estrutura

```text
senai-sustentabilidade/
├── index.html          Página inicial
├── sobre.html          Instrutora, grupo e história do portal
├── registrar.html      Formulário de envio
├── projetos.html       Acompanhamento de projetos
├── README.md
├── EMAILJS_SETUP.md    Configuração do envio por e-mail
├── css/
│   └── style.css       Todo o visual do site
├── js/
│   ├── main.js         Categorias, menu, animações (todas as páginas)
│   ├── sobre.js        Ampliação da foto na página Sobre nós
│   ├── formulario.js   Formulário, validação e EmailJS
│   └── projetos.js     Lista de projetos, filtros, estatísticas, destaque
├── img/
│   ├── lucy.jpg       Foto da instrutora
│   └── foto-placeholder.svg  Imagem provisória para os cards do grupo
└── assets/
    └── logo-firjan-senai.png
```

Na página `sobre.html`, substitua `img/foto-placeholder.svg` nos atributos `src` e `data-foto-ampliar` de cada integrante pela foto correspondente.

## Colocar o logo oficial

Substitua o arquivo `assets/logo-firjan-senai.png` pelo logo oficial, mantendo o mesmo nome. Enquanto o arquivo for o espaço reservado (uma imagem de 1 pixel), o site mostra um quadro tracejado "Logo FIRJAN SENAI". Quando o logo real estiver no lugar, ele aparece sozinho.

## Adicionar um projeto

1. Abra `js/projetos.js`.
2. Copie o modelo `PROJECT TEMPLATE` do topo do arquivo.
3. Cole dentro da lista `PROJETOS`, remova os comentários e preencha.
4. Separe projetos com vírgula, salve e recarregue a página.

```javascript
const PROJETOS = [
  {
    title: "Sensores de presença nas salas",
    description: "Desligar luzes automaticamente quando a sala está vazia.",
    category: "Energia",          // uma das categorias de js/main.js
    status: "em-andamento",       // "pendente", "em-andamento" ou "concluido"
    date: "2026-11-05",           // AAAA-MM-DD
    responsible: "Turma de Eletrotécnica",   // opcional
    materials: ["Sensores", "Cabos"],        // opcional
    benefits: "Menor consumo de energia."
  },
];
```

O projeto aparece sozinho nos cards, nos filtros e nas estatísticas da página inicial.

### Ver o site com projetos de exemplo

Em `js/projetos.js` há um bloco comentado `PROJETOS_DEMO` com três projetos. Copie os itens para a lista `PROJETOS` para testar o visual e **apague antes de publicar**.

### Projeto em destaque

Em `js/projetos.js`, escreva o título exato de um projeto em `PROJETO_EM_DESTAQUE`. Ele aparece na página inicial. Deixe `""` para esconder a seção.

## Categorias

As categorias ficam em `js/main.js` (`SENAI_CATEGORIAS` e `SENAI_CATEGORIAS_PROBLEMA`) e são reutilizadas no formulário e no filtro. Para criar uma nova, adicione um item na lista.

## Status dos projetos

| Valor em `status` | Rótulo exibido | Classe CSS |
|---|---|---|
| `pendente` | PENDENTE | `.status-pendente` |
| `em-andamento` | EM ANDAMENTO | `.status-em-andamento` |
| `concluido` | CONCLUÍDO | `.status-concluido` |

## O que o site inclui

- Página inicial com as duas ações principais, estatísticas automáticas, "Como funciona", diferença entre os três tipos de envio e aviso de que enviar uma ideia não garante a implementação
- Formulário com campos que mudam conforme o tipo (problema, sugestão ou projeto), validação em JavaScript e mensagens de sucesso e de erro
- Página de projetos com filtros por status e categoria, busca por título ou categoria e estado vazio
- Acessibilidade: rótulos nos campos, foco visível, link "Ir para o conteúdo", navegação por teclado, respeito a `prefers-reduced-motion`
- Layout responsivo para desktop, tablet e celular

## Antes de publicar

- [ ] Logo oficial em `assets/logo-firjan-senai.png`
- [ ] Chaves do EmailJS preenchidas e `MODO_SIMULACAO = false`
- [ ] Projetos de exemplo removidos de `js/projetos.js`
- [ ] Domínio permitido configurado no painel do EmailJS
