# Janell Project — Lar Batista Janell Doyle

Plataforma institucional (React + Express + PostgreSQL).

## Stack (nova)

| Pasta | App |
|-------|-----|
| `client/` | **Vite + React 19** — site público + admin |
| `server/` | **Express + Prisma** — API REST `/api/v1` |

(As pastas `web/` Next.js e `api/` NestJS ficam legadas até o cutover completo.)

## Admin (seed)

- E-mail: `admin@larbatistamanaus.org.br`
- Senha: `Teste@123`

## Local

```bash
# API (porta 3001)
cd server && npm ci && npx prisma migrate dev && npx prisma db seed && npm run dev

# Front (porta 5173, proxy /api → 3001)
cd client && npm ci && npm run dev
```

## Deploy Vercel (2 projetos)

### 1) API — Root Directory: `server`
- Framework: Other
- Env: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`
- 1 serverless function

### 2) Front — Root Directory: `client`
- Framework: Vite
- Env: `VITE_API_URL=/api/v1`, `VITE_SITE_URL=https://...`
- rewrites em `client/vercel.json` apontam `/api/v1` para a API

## Domínio

```
CNAME  janellproject  →  cname.vercel-dns.com
```

(no projeto **client**)
