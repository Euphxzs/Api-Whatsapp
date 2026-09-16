# Perguntas obrigatórias antes das próximas fases

Como o repositório estava vazio, as decisões abaixo foram tomadas de forma conservadora para não travar a Fase 1. Ainda assim, estes pontos podem alterar a arquitetura das próximas fases e precisam de confirmação.

## 1. Infraestrutura
- Railway ficará responsável apenas pela API principal ou também por workers separados de fila?
- Para ambientes de teste em Codespaces, você quer subir Postgres e Redis em containers locais automaticamente?

## 2. Banco de dados
- Podemos padronizar o banco principal como PostgreSQL desde já para produção e desenvolvimento?
- Você quer retenção de mensagens/logs ilimitada ou com política padrão de expurgo?

## 3. Autenticação
- O login administrativo inicial pode usar e-mail/senha + JWT e depois evoluir para 2FA?
- Haverá necessidade de SSO no futuro ou somente autenticação própria?

## 4. Usuários
- Além de `MASTER_ADMIN`, `ADMIN`, `MANAGER` e `USER`, existe mais algum papel obrigatório já no MVP?
- O cadastro de usuários será feito apenas internamente pelo painel ou precisa existir API pública para isso?

## 5. WhatsApps
- Qual provedor/lib você deseja priorizar para sessões: Baileys, whatsapp-web.js ou outro conector já definido?
- Existe limite esperado inicial de sessões simultâneas por instância Railway?

## 6. APIs
- A autenticação de integrações externas deve aceitar simultaneamente API Key e JWT administrativo?
- Você quer idempotência para envio de mensagens já no MVP?

## 7. Webhooks
- O retry padrão pode seguir backoff exponencial com número máximo configurável de tentativas?
- O secret do webhook deve ser usado em assinatura HMAC do payload?

## 8. Interface
- Você prefere painel em React separado da API ou renderização no mesmo processo inicialmente?
- O visual inicial deve priorizar desktop administrativo ou responsividade mobile desde o primeiro painel funcional?

## 9. Escalabilidade
- A distribuição de broadcast deve ser round-robin entre sessões ou você quer regras por capacidade/status?
- A fila precisa suportar prioridade por mensagem e por campanha já no MVP?

## 10. Deploy
- No Railway, você pretende usar um único serviço inicialmente ou API + worker + banco/redis gerenciados em serviços distintos?
- Em Codespaces, o objetivo é apenas testes internos ou também demonstrações manuais da interface?

## 11. Segurança
- Podemos exigir rotação periódica de API keys e hash-only no armazenamento como regra obrigatória?
- Existe necessidade de trilha de auditoria imutável para ações administrativas críticas já nas primeiras fases?
