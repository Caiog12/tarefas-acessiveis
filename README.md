# Minhas tarefas

Lista de tarefas acessível feita em Next.js, React e TypeScript. O Supabase cuida do cadastro, do login e do banco Postgres. Cada conta acessa apenas suas próprias tarefas.

## 1. Abrir e configurar

1. Extraia o ZIP. No VS Code, clique em **Arquivo → Abrir Pasta** e escolha a pasta **tarefas-acessiveis**, que contém o `package.json`.
2. Abra **Terminal → Novo Terminal**. Instale o Node.js **24.x** e o Git no computador caso ainda precise. Confira:

   ```sh
   node -v
   npm -v
   git --version
   npm ci
   ```

3. Entre no [painel do Supabase](https://supabase.com/dashboard), clique em **New project**, selecione a organização e a região e guarde a senha do banco. No projeto, abra **Connect** e copie **Project URL** e **Publishable key**.
4. Abra **SQL Editor → New query**, cole o conteúdo de `supabase/migrations/202610280001_create_tarefas.sql` e clique em **Run** uma única vez. Em **Project Settings → Data API**, confira se a Data API está habilitada e se `public` está nos schemas expostos.
5. Copie o arquivo de exemplo usando o comando correspondente ao seu terminal:

   **Windows PowerShell**

   ```powershell
   Copy-Item .env.example .env.local
   ```

   **Bash ou Git Bash**

   ```bash
   cp .env.example .env.local
   ```

   Abra `.env.local` no VS Code e substitua os dois valores pelo Project URL e pela Publishable key. O Git ignora o arquivo local. Use somente a chave pública. A senha do banco, a secret key e a chave service_role ficam fora do projeto.

6. No Supabase, abra **Authentication → URL Configuration**. Para começar localmente, coloque `http://localhost:3000` em **Site URL** e adicione `http://localhost:3000/auth/confirm` em **Redirect URLs**. Use esse mesmo hostname ao abrir o site.
7. Em **Authentication → Emails → Templates → Confirm signup**, mantenha a confirmação por e-mail habilitada e salve um corpo como este:

   ```html
   <p>Confirme o cadastro para usar sua lista de tarefas.</p>
   <p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}">Confirmar cadastro</a></p>
   ```

   A aplicação passa o endereço completo de `/auth/confirm` ao cadastrar. Essa rota valida o token e abre `/tarefas`. Se o serviço padrão de e-mail limitar os destinatários do projeto, configure um SMTP autorizado para testar o cadastro público. Para ensaiar o login e o CRUD enquanto isso, crie duas contas fictícias em **Authentication → Users → Add user → Create new user** e marque **Auto Confirm User**. Esse atalho serve para o ensaio e deixa o teste do cadastro com confirmação por e-mail pendente.

## 2. Executar no VS Code

```sh
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Clique em **Criar uma conta**, cadastre-se e confirme o e-mail. Para uma conta já confirmada, use **Entrar**. O terminal precisa permanecer aberto enquanto você testa. Se a porta 3000 estiver ocupada, libere-a ou ajuste as URLs para a porta exibida. Reinicie o servidor após alterar `.env.local`.

Para verificar o código antes de enviar:

```sh
npm run lint
npm run typecheck
npm run build
```

## 3. Git, GitHub e pull request

1. No GitHub, escolha **New repository**, nomeie como `tarefas-acessiveis` e crie o repositório vazio. Em dupla, convide a outra pessoa em **Settings → Collaborators** e combinem commits próprios. Cada pessoa usa seu próprio e-mail de commit e arquivo `.env.local`.
2. Na pasta extraída, execute os comandos abaixo. Substitua nome, e-mail e `SEU-USUARIO` pelos seus dados. Se já iniciou um Git nessa pasta, confira `git status` e `git remote -v` antes de configurar o remoto.

   ```sh
   git init -b main
   git config user.name "Seu nome"
   git config user.email "seu-email-de-commits"
   git add .
   git diff --cached --name-only
   git commit -m "feat: cria lista de tarefas acessível"
   git remote add origin https://github.com/SEU-USUARIO/tarefas-acessiveis.git
   git push -u origin main
   ```

   Antes do commit, confira se a lista de arquivos inclui `.env.example` e se `.env.local` ficou de fora.

3. No repositório, abra **Settings → Secrets and variables → Actions → Variables → New repository variable** e crie:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

   Use os mesmos valores públicos do `.env.local`. Em **Actions → CI → Run workflow**, você pode repetir a primeira execução com as variáveis preenchidas.

4. Crie uma branch para uma mudança pequena. Por exemplo, registre no README uma observação real do seu primeiro teste. Depois envie o commit:

   ```sh
   git switch -c docs/registro-de-teste
   git diff
   git add README.md
   git diff --cached
   git commit -m "docs: registra resultado do primeiro teste"
   git push -u origin docs/registro-de-teste
   ```

5. No GitHub, clique em **Compare & pull request**, com **base: main** e **compare: docs/registro-de-teste**. Escreva o que mudou, o que testou e o que está pendente. Aguarde o check **qualidade** e a revisão. Em **Settings → Branches** ou **Rules → Rulesets**, se o plano permitir, proteja `main` exigindo PR e o check **qualidade**, sem bypass.
6. Depois de revisar a mudança e o resultado do CI, faça **Merge pull request** no GitHub. Atualize sua cópia:

   ```sh
   git switch main
   git pull --ff-only origin main
   ```

## 4. Publicar na Vercel

1. No [painel da Vercel](https://vercel.com/dashboard), escolha **Add New → Project**, conecte o GitHub e clique em **Import** no repositório. Em **Framework Preset**, escolha **Next.js**. Use a raiz do repositório, onde está o `package.json`. Confira **Node.js 24.x** nas configurações do projeto.
2. Adicione as duas variáveis públicas em **Environment Variables** para **Production** e **Preview**. Se editar as variáveis depois de publicar, faça um **Redeploy** no ambiente correspondente.
3. Clique em **Deploy**. Copie o domínio de produção. No Supabase, em **Authentication → URL Configuration**, substitua **Site URL** pelo domínio de produção. Em **Redirect URLs**, mantenha o retorno local e adicione os endereços exatos da publicação:

   - `http://localhost:3000/auth/confirm`
   - `https://SEU-DOMINIO.vercel.app/auth/confirm`
   - `https://SEU-PREVIEW.vercel.app/auth/confirm`, quando for testar um preview.

4. Para demonstrar preview, crie outra branch com uma melhoria pequena, envie e abra um PR. Na Vercel, abra **Deployments** e copie a URL de preview para testar. Revise login, CRUD e CI antes do merge. O merge na `main` publica a nova versão de produção pela integração GitHub–Vercel. O preview e o CI podem rodar em paralelo. Execute o SQL pelo Supabase conforme a etapa 1.

## 5. Onde está a lógica

| Arquivo | O que faz |
|---|---|
| `app/auth/formulario.tsx` | Cadastro e login com e-mail e senha. |
| `app/auth/confirm/route.ts` | Valida o link de confirmação e abre a lista. |
| `app/tarefas/page.tsx` | Confere a sessão no servidor e carrega as tarefas. |
| `app/tarefas/lista.tsx` | Liga os botões ao banco e atualiza a interface. |
| `proxy.ts` | Atualiza os cookies quando é preciso renovar a sessão. |
| `supabase/migrations/202610280001_create_tarefas.sql` | Cria a tabela e as regras de acesso por conta. |
| `.github/workflows/ci.yml` | Executa lint, verificação de tipos e build. |

Use [APRESENTACAO.md](APRESENTACAO.md) para ensaiar e [VALIDACAO.md](VALIDACAO.md) para conferir os resultados e preencher o checklist.

## Referências

- [Supabase: modelos de e-mail e variáveis de confirmação](https://supabase.com/docs/guides/local-development/customizing-email-templates)
- [GitHub Actions: checkout](https://github.com/actions/checkout) e [setup-node](https://github.com/actions/setup-node)
- [Vercel: versões do Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) e [deploys com Git](https://vercel.com/docs/git)
