# Deploy — janellproject.cartergroup.com.br

## Fluxo

```
PostgreSQL (Neon) → API NestJS (Vercel) → Web Next.js (Vercel)
```

## 2 projetos Vercel

| Projeto | Root Directory | Framework |
|---------|----------------|-----------|
| **Web** | `web` | Next.js |
| **API** | `api` **ou vazio** | Other |

### Por que “No more than 12 Serverless Functions”?

Com Root Directory **vazio**, a Vercel trata `api/**/*.ts` do monorepo como **uma function cada** (~24). Hobby = máx. 12.

**Correção neste repo:**
- `vercel.json` na **raiz** do monorepo com `builds` apontando **só** para `api/api/index.ts` (1 function).
- `api/vercel.json` com o mesmo padrão se Root Directory = `api`.

### Checklist API

1. Framework = **Other**, Build Command **vazio**
2. Preferência: Root Directory = `api` (Settings → General → Save)
3. Env: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`
4. Redeploy **sem cache**

Log OK: **1×** `Using TypeScript`.

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
