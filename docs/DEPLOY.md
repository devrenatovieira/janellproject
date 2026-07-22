# Deploy — React + Express

## Projetos

| Projeto | Root | Env principais |
|---------|------|----------------|
| API | `server` | `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS` |
| Web | `client` | `VITE_API_URL=/api/v1`, `VITE_SITE_URL` |

## API checklist

1. Root Directory = **server**
2. Env Production configurada
3. Neon: `npx prisma migrate deploy && npx prisma db seed`
4. Test: `https://SEU-API.vercel.app/api/v1/health`

## Web checklist

1. Root Directory = **client**
2. Framework Vite
3. Rewrite `/api/v1` → URL da API (já em `client/vercel.json` — ajuste o host)
4. Test: homepage carrega HTML do site, não JSON

## Admin

`/admin` · `admin@larbatistamanaus.org.br` · `Teste@123`
