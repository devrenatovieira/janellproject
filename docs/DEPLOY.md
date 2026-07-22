# Deploy — janellproject.cartergroup.com.br

## Fluxo

```
PostgreSQL (Neon) → API NestJS (Vercel) → Web Next.js (Vercel)
```

## 2 projetos Vercel

| Projeto | Root Directory | Framework |
|---------|----------------|-----------|
| **Web** | `web` | Next.js |
| **API** | **`api`** (obrigatório) | Other |

### Por que “No more than 12 Serverless Functions”?

Com Root Directory **vazio**, a Vercel trata `api/**/*.ts` do monorepo como **uma function cada** (~24). Hobby = máx. 12.

**Correção:**
- Projeto API com Root Directory = **`api`** e `api/vercel.json` (1 function Nest).
- Projeto Web com Root Directory = **`web`** e `web/vercel.json` (Next.js).
- **Não** use Root Directory vazio na raiz do monorepo.

### Checklist API

1. Framework = **Other**, Build Command **vazio**
2. Preferência: Root Directory = `api` (Settings → General → Save)
3. **Environment Variables (Production + Preview)** — sem isso a function crasha:
   | Nome | Exemplo |
   |------|---------|
   | `DATABASE_URL` | `postgresql://...@...neon.tech/neondb?sslmode=require` |
   | `JWT_ACCESS_SECRET` | string aleatória ≥ 32 chars |
   | `JWT_REFRESH_SECRET` | outra string aleatória ≥ 32 chars |
   | `CORS_ORIGINS` | `https://janellproject.vercel.app,https://janellproject.cartergroup.com.br` |
   | `SEED_ADMIN_PASSWORD` | `Teste@123` |
4. Redeploy **sem cache**

Log de build OK: **1×** `Using TypeScript`.  
Erro runtime `JWT_ACCESS_SECRET does not exist` = env não configurada (não é bug de código).

## DNS

| Tipo | Nome | Valor |
|------|------|--------|
| CNAME | janellproject | cname.vercel-dns.com |

## Env

**Web:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL=/api/v1`, `API_PROXY_ORIGIN`  
**API:** `DATABASE_URL`, `JWT_*`, `CORS_ORIGINS`, seed admin `Teste@123`

## Banco

```bash
cd api && npx prisma migrate deploy && npx prisma db seed
```
