# Validação e evidências

## Verificações executadas

| Verificação | Resultado |
|---|---|
| Dependências | `npm ci` terminou com o lockfile incluído no projeto. Node.js 24.22.3 e npm 11.19.1. |
| Análise de código | `npm run lint` passou sem erros e sem avisos do ESLint. |
| Tipos | `npm run typecheck` passou. |
| Build | `npm run build` gerou a aplicação sem acessar o Supabase hospedado. |
| Políticas SQL | A migration rodou em Postgres local via PGlite com duas identidades simuladas. A conta A gravou uma tarefa com seu ID. B recebeu zero linhas ao ler, atualizar e excluir a tarefa de A. O banco bloqueou a inserção em nome de outra conta, a troca de dono, leitura e escrita anônimas e título em branco. |
| Rotas HTTP do Next.js | Com uma API local simulando o Supabase, login e cadastro retornaram as páginas esperadas, /tarefas redirecionou visitantes sem sessão, e a confirmação simulada criou o cookie e abriu a lista. |
| CRUD com SDK | Com a API simulada e Postgres local, duas contas entraram, a conta A criou, concluiu, desmarcou e excluiu uma tarefa. A tarefa foi lida em nova requisição à página, e a conta B não recebeu a tarefa de A. A saída foi aceita pela API simulada. |

A validação de interface no Chromium ficou pendente porque o navegador não pôde iniciar no ambiente. A confirmação por e-mail real, o fluxo completo por teclado e leitor de tela, o workflow no GitHub e o deploy na Vercel também estão pendentes.

## Conferência com o Supabase hospedado em 22/11/2026

- Migration aplicada. O painel listou as quatro políticas de `public.tarefas`, uma por operação do CRUD.
- Retorno de confirmação local cadastrado. O Supabase Auth respondeu com o provedor de e-mail e a confirmação habilitados.
- A consulta a `/rest/v1/tarefas` com a chave publicável e sem sessão recebeu HTTP 401, código `42501` de acesso negado.
- A aplicação aberta em localhost carregou a tela de entrada usando o `.env.local`. Uma requisição sem sessão a `/tarefas` recebeu HTTP 307 com destino a `/auth/login`.
- Cadastro com confirmação real por e-mail, CRUD autenticado com duas contas, teclado e leitor de tela seguem pendentes.

## Checklist com o Supabase do projeto

Execute cada verificação no ambiente que vai demonstrar. Marque o item após executar e registre evidências sem mostrar senha, token ou dados pessoais.

- [x] Configurar o ambiente local, executar a migration e conferir Data API e URL de retorno local.
- [ ] Conferir o modelo de e-mail no teste de confirmação.
- [ ] Criar conta pela interface e confirmar o e-mail. Conferir se o link abre a lista com a sessão criada.
- [x] Sem sessão, acessar `/tarefas`. O servidor redirecionou para a tela de entrada.
- [ ] Entrar na conta A. Adicionar “Revisar apresentação”. A tarefa deve aparecer com o estado **Pendente**.
- [ ] Concluir a tarefa e conferir **Concluída**. Recarregar para conferir a gravação. Desmarcar, voltar a **Pendente** e recarregar mais uma vez.
- [ ] Em outro perfil de navegador, entrar na conta B, criar uma tarefa diferente e recarregar as duas listas. Cada conta deve ver só a própria tarefa. O teste SQL local registra o bloqueio de tentativas de editar ou excluir a linha da outra conta. Repetir no ambiente hospedado com sessões de usuário se for comprovar essas operações lá. O SQL Editor administrativo não é evidência de isolamento entre contas.
- [ ] Ao excluir pela conta A, cancelar a primeira confirmação e verificar se a tarefa ficou. Confirmar na segunda tentativa, recarregar e conferir que a tarefa sumiu.
- [ ] Clicar em **Sair** e tentar acessar `/tarefas` diretamente outra vez. Deve continuar protegida.
- [ ] Conferir estado vazio, mensagem de sucesso e mensagem para um título composto só de espaços.
- [ ] Usar **Tab** e **Shift+Tab** desde a tela de login. Conferir ordem e contorno de foco. Testar os botões com **Enter** e **Espaço**, inclusive a confirmação de exclusão. Após excluir, conferir se o foco volta a **Nova tarefa**.
- [ ] Com **NVDA** no Windows ou **VoiceOver** no macOS, navegar pelos títulos e campos. Ouvir “E-mail”, “Senha” e “Nova tarefa”. Na lista, conferir o título e o estado de cada tarefa, os nomes dos botões e o anúncio de sucesso ao adicionar, concluir, desmarcar e excluir. Confira também o anúncio de erro ao enviar somente espaços.
- [ ] Criar o repositório, configurar as variáveis do Actions e abrir um PR para a `main`. Conferir o check **qualidade** e aplicar a proteção da branch conforme o plano.
- [ ] Publicar preview e produção pela integração com a Vercel. Confirmar as variáveis e os retornos do login. Repetir os testes necessários em cada endereço.

## Registro para preencher

| Página ou item | Como testei | Resultado observado | Correção e novo teste |
|---|---|---|---|
| Exemplo de preenchimento: login | Navegador, conta fictícia | Pendente | Pendente |

- Repositório: pendente
- Pull request: pendente
- Execução do CI: pendente
- Preview e produção: pendentes
- Navegador e leitor de tela usados: pendentes

Para o registro final da atividade, escreva de 5 a 10 linhas contando como o código saiu do VS Code e chegou à Vercel, o que o CI verificou e um problema que você encontrou ou conferiu. Explique como confirmou o resultado e marque o que ainda falta executar.
