# Apresentação de Minhas tarefas

Deixe abertas duas janelas com perfis diferentes do navegador. Na primeira, tenha a conta A pronta para entrar. Na segunda, deixe a conta B conectada com uma tarefa diferente, por exemplo, “Ler o PDF”. Abra também os três arquivos da seção abaixo no VS Code. Use contas fictícias e evite mostrar senhas ou o arquivo `.env.local`.

| Tempo | O que mostrar | O que dizer |
|---|---|---|
| 0:00–0:35 | Tela de entrada. Aponte o link para criar conta e entre na conta A. | “Esse é um sistema pessoal de tarefas. A pessoa cria uma conta, entra com e-mail e senha e vê a própria lista.” |
| 0:35–1:50 | Digite “Revisar apresentação” e clique em **Adicionar**. Clique em **Concluir**, depois **Desmarcar**. Recarregue a página. | “Consigo criar, listar, mudar o estado e excluir. Vou recarregar para mostrar que a tarefa ficou salva no banco como pendente.” |
| 1:50–2:35 | Alterne para o perfil da conta B e recarregue a lista. Volte à conta A, exclua a tarefa e confirme. | “A conta B tem a lista dela. A tarefa da conta A só aparece aqui na conta A. Ao excluir, o sistema pede confirmação e leva o foco de volta ao campo de tarefa.” |
| 2:35–3:45 | Mostre a função `adicionar` e a regra RLS no VS Code. Volte à tela e pressione Tab para mostrar o foco. | “O código manda o título para o Supabase. O banco registra o dono pelo usuário logado e usa essa identidade para decidir quais linhas a conta pode acessar. Dá para navegar com Tab, e os botões têm nomes que descrevem as ações.” |
| 3:45–5:00 | Mostre o workflow. Se houver execução ou deploy concluído, abra a aba **Actions** e a URL publicada. | “O Git guarda o histórico, o GitHub hospeda o repositório e o Actions verifica regras, tipos e build. A Vercel publica o site pelo GitHub. O teste que acabei de demonstrar verifica o comportamento da aplicação.” |

Se estiver apresentando localmente, diga que está usando o servidor do VS Code. Consulte `VALIDACAO.md` antes de afirmar que algum teste ou etapa de publicação foi concluído.

## Os três trechos para abrir

1. **Cadastro de uma tarefa** em `app/tarefas/lista.tsx`. Procure por `.insert({ titulo: tituloLimpo })`. Aponte o título que vai para o banco e o `.select(...).single()` que traz a tarefa gravada para atualizar a lista.
2. **Regra por conta** em `supabase/migrations/202610280001_create_tarefas.sql`. Procure por `create policy "ler proprias tarefas"`. Aponte `(select auth.uid()) = user_id` e diga que o banco compara quem está logado com o dono de cada linha. As outras políticas fazem a checagem para inserir, atualizar e remover.
3. **Verificação automática** em `.github/workflows/ci.yml`. Aponte `push` e `pull_request` para a `main`. Depois mostre os três comandos que verificam regras de código, tipos e build.

## Perguntas que podem aparecer

| Pergunta | Resposta curta |
|---|---|
| O que é CRUD? | Criar, ler, atualizar e excluir. Aqui é adicionar, listar, concluir ou desmarcar e excluir. |
| Para que serve o Supabase? | Gerencia autenticação e oferece o Postgres para guardar as tarefas. |
| O que é RLS? | É a segurança por linha. O banco compara o usuário logado com o dono da tarefa antes de permitir acesso. |
| Para que serve o Git? | Registra as mudanças em commits e permite trabalhar em branches. |
| Para que serve o GitHub Actions? | Executa as verificações automaticamente quando abrimos ou atualizamos um PR para a main e quando enviamos mudanças à main. |
| Para que serve a Vercel? | Publica a aplicação e gera um endereço para acessar o sistema no navegador. |
| O que o CI verifica? | Regras do código pelo ESLint, tipos pelo TypeScript e se a aplicação consegue gerar o build. |
| O que vocês testaram manualmente? | Cite o que você realmente executou no checklist. A demonstração cobre o CRUD e a lista de cada conta. Teclado, leitor de tela e regras de acesso precisam de verificações próprias. |
| O que acontece quando eu recarrego? | A página confere a sessão e lê novamente os registros do banco. |
