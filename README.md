# Janell Project — Lar Batista Janell Doyle

Plataforma institucional (Next.js + NestJS + PostgreSQL).

## Online (meta)

- Site: https://janellproject.cartergroup.com.br
- Admin: https://janellproject.cartergroup.com.br/admin

## Estrutura

| Pasta | App |
|-------|-----|
| `web/` | Next.js 15 — site público + painel admin |
| `api/` | NestJS — API REST + Prisma + seed |

## Admin (seed)

- E-mail: `admin@larbatistamanaus.org.br`
- Senha: `Teste@123`

## DNS

```
CNAME  janellproject  →  cname.vercel-dns.com
```

(Use o valor exato que a Vercel mostrar no projeto.)

## Deploy na Vercel (você)

### 1) Projeto Web
- Root Directory: `web`
- Framework: Next.js
- Env:
  - `NEXT_PUBLIC_SITE_URL` = `https://janellproject.cartergroup.com.br`
  - `NEXT_PUBLIC_API_URL` = `/api/v1`
  - `API_PROXY_ORIGIN` = URL do projeto da API (ex: `https://janellproject-api.vercel.app`)

### 2) Projeto API (Hobby: 1 serverless function só)

**Opção A (recomendada):** Root Directory = `api`  
**Opção B:** Root Directory vazio — o `vercel.json` na raiz do monorepo força **só 1** function (`api/api/index.ts`).

- Framework Preset: **Other**
- Build Command: **vazio**
- Env:
  - `DATABASE_URL` = connection string Neon/Postgres
  - `JWT_ACCESS_SECRET` = string longa aleatória
  - `JWT_REFRESH_SECRET` = outra string longa
  - `CORS_ORIGINS` = `https://janellproject.cartergroup.com.br,https://janellproject.vercel.app`
  - `SEED_ADMIN_EMAIL` = `admin@larbatistamanaus.org.br`
  - `SEED_ADMIN_PASSWORD` = `Teste@123`

**Log bom:** só **1** linha `Using TypeScript`.  
**Log ruim (20+ TypeScript + erro de 12 functions):** zero-config está pegando todos os `.ts` — faça redeploy sem cache após este commit.

### 3) Banco
```bash
cd api
npx prisma migrate deploy
npx prisma db seed
```

### 4) Domínio
Adicionar `janellproject.cartergroup.com.br` no projeto **web** e criar o CNAME no DNS.

## PDFs de transparência

Os PDFs (~473MB) **não** vão no Git. Ficam em:

`~/projetos/larbatista/larbatista-web/public/documentos`

No deploy, hospede essa pasta (Vercel Blob, S3, ou storage do servidor) e aponte `DOCUMENTS_PATH` / URLs.

## Local

```bash
# API
cd api && npm ci && npx prisma migrate dev && npx prisma db seed && npm run start:dev

# Web
cd web && npm ci && npm run dev
```
