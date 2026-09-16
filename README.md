# WhatsHub API

Base inicial para uma plataforma multi-tenant de gerenciamento de sessões WhatsApp com foco em Railway e GitHub Codespaces.

## O que esta entrega implementa

- API TypeScript com versionamento em `/api/v1`
- Autenticação bootstrap do master admin via JWT
- Health/status endpoint padronizado
- Respostas de erro padronizadas
- Rate limiting central inicial
- OpenAPI JSON inicial em `/api/v1/docs/openapi.json`
- Desenho relacional inicial do banco em `database/migrations/0001_init/schema.sql`
- Configuração de deploy para Railway
- Configuração de desenvolvimento para Codespaces
- Documentação de arquitetura e perguntas obrigatórias

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse:

- `http://localhost:3000/`
- `http://localhost:3000/api/v1/status`
- `http://localhost:3000/api/v1/docs`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run check`

## Credenciais bootstrap

Definidas por ambiente:

- `MASTER_EMAIL`
- `MASTER_PASSWORD`

## Documentação complementar

- `docs/architecture.md`
- `docs/questions.md`
