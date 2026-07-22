# Deploy completo — janellproject.cartergroup.com.br

## Fluxo

```
PostgreSQL (Neon) → API NestJS (Vercel) → Web Next.js (Vercel)
```

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
| DATABASE_URL | postgresql://... |
| JWT_ACCESS_SECRET | (aleatório 32+) |
| JWT_REFRESH_SECRET | (aleatório 32+) |
| CORS_ORIGINS | https://janellproject.cartergroup.com.br |
| SEED_ADMIN_PASSWORD | Teste@123 |

## Build commands sugeridos (Vercel)

### web
- Install: `npm ci`
- Build: `npm run build`
- Output: default Next.js

### api
- Install: `npm ci && npx prisma generate`
- Build: `npm run build`
- Entry: `api/index.ts` (vercel.json)
