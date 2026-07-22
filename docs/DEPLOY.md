# Deploy completo — janellproject.cartergroup.com.br

## Fluxo

```
PostgreSQL (Neon) → API NestJS (Vercel) → Web Next.js (Vercel)
```

## Crítico: 2 projetos Vercel (não 1 monorepo)

O Hobby plan permite **no máximo 12 Serverless Functions por deployment**.

| Projeto | Root Directory | Framework |
|---------|----------------|-----------|
| **Web** | `web` | Next.js |
| **API** | `api` | **Other** (não Next.js) |

### Por que o erro "No more than 12 Serverless Functions"?

Se o Root Directory do projeto **API** ficar vazio (raiz do monorepo), a Vercel trata a pasta `api/` inteira como o diretório especial de functions e cria **1 function por arquivo `.ts`** (~24) — estoura o limite do Hobby.

Com Root Directory = `api`, só existe **1** function: `api/index.ts` (NestJS inteiro atrás dela), via `vercel.json` → `builds`.

### Checklist do projeto API na Vercel

1. Settings → General → **Root Directory** = `api` → Save
2. Framework Preset = **Other**
3. Build Command = **deixar vazio** (o `vercel.json` usa `@vercel/node` em `api/index.ts`)
4. Output Directory = vazio
5. Install Command = (automático do vercel.json) ou `npm install && npx prisma generate`
6. Redeploy **sem cache** (Deployments → ⋮ → Redeploy → uncheck "Use existing Build Cache")

No log bom, você deve ver **uma** linha `Using TypeScript` (não 20+).

## DNS

| Tipo | Nome | Valor |
|------|------|--------|
| CNAME | janellproject | cname.vercel-dns.com |

## Variáveis Web

| Variável | Valor |
|----------|--------|
| NEXT_PUBLIC_SITE_URL | https://janellproject.cartergroup.com.br |
| NEXT_PUBLIC_API_URL | /api/v1 |
| API_PROXY_ORIGIN | https://SEU-PROJETO-API.vercel.app |

## Variáveis API

| Variável | Valor |
|----------|--------|
| DATABASE_URL | postgresql://... (Neon) |
| JWT_ACCESS_SECRET | (aleatório 32+) |
| JWT_REFRESH_SECRET | (aleatório 32+) |
| CORS_ORIGINS | https://janellproject.cartergroup.com.br |
| SEED_ADMIN_EMAIL | admin@larbatistamanaus.org.br |
| SEED_ADMIN_PASSWORD | Teste@123 |

## Banco (após API no ar)

```bash
cd api
npx prisma migrate deploy
npx prisma db seed
```

Admin seed: `admin@larbatistamanaus.org.br` / `Teste@123`

## Domínio

Adicionar `janellproject.cartergroup.com.br` no projeto **web** e criar o CNAME no DNS.
