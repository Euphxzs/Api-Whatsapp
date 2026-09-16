# WhatsHub API - análise inicial e arquitetura proposta

## Análise do projeto existente

O repositório foi encontrado praticamente vazio, contendo apenas `README.md`. Não havia stack definida, backend, frontend, banco, testes, variáveis de ambiente, pipeline, Docker ou estrutura de código existente para preservar.

## Decisões tomadas para a Fase 1

Para iniciar com base sólida e adequada a Railway + Codespaces, foi adotada a seguinte direção:

- **Runtime:** Node.js 22
- **Linguagem:** TypeScript
- **API HTTP:** Express 5
- **Validação:** Zod
- **Autenticação inicial:** e-mail/senha + JWT para bootstrap do master admin
- **Banco principal planejado:** PostgreSQL
- **Fila planejada:** Redis + workers dedicados
- **Documentação:** OpenAPI JSON servida pela própria API
- **Deploy:** Dockerfile + `railway.json`
- **Desenvolvimento em nuvem:** `.devcontainer` para Codespaces

## Arquitetura modular proposta

```text
src/
  config/
  modules/
    auth/
    docs/
    system/
    users/
    whatsapp/
    webhooks/
    messages/
    groups/
    api-keys/
    queue/
    logs/
  shared/
    http/
    security/
    database/
    events/
```

## Fases planejadas

### Fase 1
- Estrutura base do projeto
- Configuração central
- Padronização de erros
- Saúde/status da plataforma
- Autenticação bootstrap do administrador
- Desenho relacional inicial do banco
- Configuração de Railway e Codespaces

### Fase 2
- CRUD de usuários
- RBAC
- isolamento multi-tenant
- auditoria administrativa

### Fase 3
- session manager de WhatsApp
- persistência de sessões
- estados de conexão
- reconexão automática

### Fase 4
- QR Code em tempo real
- WebSocket/SSE
- atualização de status sem reload

### Fase 5+
- APIs individuais
- webhooks
- filas/workers
- broadcast multi-whatsapp
- dashboard
- documentação expandida
- suíte de testes ampliada

## Banco relacional proposto

As entidades base previstas nesta entrega são:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `whatsapp_sessions`
- `api_keys`
- `webhooks`
- `webhook_deliveries`
- `messages`
- `message_queue`
- `message_logs`
- `groups`
- `group_whatsapp`
- `audit_logs`
- `system_settings`

## Observações importantes

- Esta entrega **não afirma** que a plataforma final completa já está pronta.
- Esta entrega estabelece a base real para as próximas fases, com estrutura, segurança inicial, deploy, documentação e modelagem.
- Como o repositório era vazio, qualquer solução honesta precisa começar por esse foundation layer.
