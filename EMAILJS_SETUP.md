# Configuração do EmailJS

Este guia explica como fazer o formulário do portal enviar cada contribuição para os e-mails configurados no arquivo `js/formulario.js`. O endereço atual é **christianmatheus.102005@gmail.com**.

O EmailJS permite enviar e-mails direto do navegador, sem servidor. O site nunca guarda sua senha de e-mail: ela fica só no painel do EmailJS.

## O que você vai precisar copiar no final

Três valores, que ficam no topo do arquivo `js/formulario.js`:

```javascript
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
```

| Valor | Onde encontrar no EmailJS |
|---|---|
| Public Key | Painel → **Account** → **General** → *Public Key* |
| Service ID | Painel → **Email Services** → seu serviço → *Service ID* |
| Template ID | Painel → **Email Templates** → seu template → *Template ID* |

> A **Public Key** foi feita para ficar no navegador e pode aparecer no código do site. Já a **Private Key** (Access Token) é secreta: **nunca** coloque no projeto.

---

## Passo 1 – Criar a conta

1. Acesse https://www.emailjs.com e clique em **Sign Up Free**.
2. Crie a conta e confirme o e-mail.

## Passo 2 – Conectar o e-mail (Email Service)

1. No painel, abra **Email Services** → **Add New Service**.
2. Escolha **Gmail** (ou outro provedor).
3. Clique em **Connect Account** e autorize o acesso com a conta Google que enviará as mensagens.
4. Se aparecer a lista de permissões, mantenha marcada a permissão de **enviar e-mails**.
5. Clique em **Create Service** e anote o **Service ID**.

## Passo 3 – Criar o template do e-mail

1. Abra **Email Templates** → **Create New Template**.
2. Preencha:
   - **To Email:** `{{to_email}}`
   - **From Name:** `Portal de Sustentabilidade SENAI`
   - **Reply To:** `{{student_email}}` (assim você responde direto ao aluno)
   - **Subject:** `[Portal SENAI] {{submission_type}}: {{title}}`
3. Para usar o modelo visual, abra o modo **Code/HTML** do conteúdo, copie todo o conteúdo de [emailjs-template.html](./emailjs-template.html) e cole no editor do EmailJS. O layout usa as cores do portal e estilos inline para melhor compatibilidade com clientes de e-mail.
4. Se preferir um e-mail simples, use a alternativa em texto abaixo:

```text
Nova contribuição recebida pelo Portal de Sustentabilidade

Data do envio: {{submitted_at}}

DADOS DO ALUNO
Nome: {{student_name}}
E-mail: {{student_email}}

CONTRIBUIÇÃO
Tipo: {{submission_type}}
Categoria: {{category}}
Título: {{title}}
Descrição: {{description}}
Local: {{location}}
Solução sugerida: {{suggested_solution}}

INFORMAÇÕES DO PROJETO (quando aplicável)
Problema que o projeto resolve: {{problem_solved}}
Solução proposta: {{project_solution}}
Materiais: {{materials}}
Custo estimado: {{estimated_cost}}
Pessoas e recursos: {{people_resources}}
Benefícios esperados: {{expected_benefits}}
Impacto ambiental: {{environmental_impact}}
Tempo de implementação: {{implementation_time}}

OBSERVAÇÕES ADICIONAIS
{{additional_notes}}
```

5. Clique em **Save** e anote o **Template ID**.

### Variáveis enviadas pelo formulário

Os nomes precisam ser **idênticos** aos usados no template (incluindo letras minúsculas e `_`).

| Variável | Conteúdo |
|---|---|
| `to_email` | Destinatários configurados em `EMAILJS_RECIPIENTS` no arquivo `js/formulario.js` |
| `student_name` | Nome do aluno |
| `student_email` | E-mail do aluno |
| `submission_type` | Relato de problema, Sugestão de melhoria ou Proposta de projeto |
| `category` | Categoria escolhida |
| `title` | Título |
| `description` | Descrição |
| `location` | Local |
| `suggested_solution` | Solução sugerida (em projetos, repete a solução proposta) |
| `problem_solved` | Problema que o projeto resolve |
| `project_solution` | Solução do projeto |
| `materials` | Materiais necessários |
| `estimated_cost` | Custo estimado |
| `people_resources` | Pessoas e recursos |
| `expected_benefits` | Benefícios esperados |
| `environmental_impact` | Impacto ambiental |
| `implementation_time` | Tempo de implementação |
| `additional_notes` | Observações adicionais |
| `submitted_at` | Data e hora do envio |

Campos que o aluno não preencher chegam como **"Não informado"**.

## Passo 4 – Colocar as chaves no projeto

1. Abra `js/formulario.js` em um editor de texto.
2. No topo do arquivo, troque os três valores:

```javascript
const EMAILJS_PUBLIC_KEY = "sua_public_key_aqui";
const EMAILJS_SERVICE_ID = "service_xxxxxxx";
const EMAILJS_TEMPLATE_ID = "template_xxxxxxx";
```

3. Salve o arquivo.

### Alterar ou adicionar destinatários

No topo de `js/formulario.js`, edite a lista `EMAILJS_RECIPIENTS`:

```javascript
const EMAILJS_RECIPIENTS = [
  "christianmatheus.102005@gmail.com",
  "outro-email@exemplo.com"
];
```

Troque `outro-email@exemplo.com` pelo endereço desejado. Para adicionar mais pessoas, inclua novos endereços entre aspas, separados por vírgula. Para remover alguém, apague a linha correspondente. O campo **To Email** do template deve estar definido como `{{to_email}}` para usar essa lista; depois de salvar a configuração no arquivo, não é necessário alterar o template novamente.

## Passo 5 – Testar

1. Abra `registrar.html` no navegador (clique duas vezes no arquivo, ou use o Live Server do VS Code).
2. Preencha o formulário e envie.
3. Você deve ver **"Enviado com sucesso! Sua contribuição será analisada."** e receber o e-mail em alguns segundos. Confira também a caixa de spam.
4. Se aparecer a mensagem de erro, abra o console do navegador (tecla **F12** → aba *Console*) para ver o motivo.

### Testar só o visual, sem EmailJS

No `js/formulario.js`, troque `MODO_SIMULACAO` para `true`. O formulário mostra a mensagem de sucesso sem enviar nada, e os dados aparecem no console. **Volte para `false` antes de publicar.**

---

## Segurança (recomendado antes de publicar)

- No painel do EmailJS, em **Account → Security**, restrinja os **domínios permitidos** ao endereço onde o site ficará.
- Ative o **reCAPTCHA** do EmailJS, se quiser mais proteção contra spam.
- O plano gratuito tem limite mensal de envios. Confira o limite atual no painel, em **Account**.
- O formulário já inclui um campo-isca invisível que bloqueia robôs simples.

## Problemas comuns

| Mensagem no console | Causa provável |
|---|---|
| `EmailJS ainda não configurado` | As chaves ainda são `YOUR_...`. Preencha o Passo 4. |
| `The Public Key is invalid` (erro 400/403) | Public Key copiada errada ou com espaços. |
| `The service ID not found` / `template ID not found` (erro 400) | Service ID ou Template ID incorreto. |
| `Gmail_API: Request had insufficient authentication scopes` (erro 412) | Reconecte o Gmail e mantenha a permissão de envio marcada. |
| `A biblioteca do EmailJS não carregou` | Sem internet, ou o endereço do script em `registrar.html` está bloqueado. |
| E-mail chega sem os dados | O nome de alguma variável no template não bate com a tabela acima. |
