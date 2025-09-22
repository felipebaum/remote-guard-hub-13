# Épicos e User Stories - Remote Guard Hub (v2)

## Visão Geral Atual

- Navegação lateral minimalista: `Dashboard` e `Integradores`.
- Ações centralizadas por integrador no menu de engrenagem: `Novo Condomínio`, `Novo Usuário`, `Listar Usuários`, `Configurar`, `Excluir Integrador`.
- Lista de condomínios sempre visível dentro do card de cada integrador.
- Criação de Integrador exige: `Nome`, `Descrição`, `CNPJ`, `Endereço completo`.
- Condomínio: `Nome`, `Endereço`, credenciais SIP (`Host`, `Usuário`, `Senha`).
- Tokens do Condomínio: modal com `gerar` (20 chars A–Z0–9), `revogar` e `histórico` com datas de criação/revogação.
- Menus superiores removidos; não existe página separada de "Usuários Condomínios" nem de "Admins Integradores".

---

## Épicos

1) Gestão de Integradores e Condomínios (Front)
2) Gestão de Usuários Operacionais do Integrador (Front)
3) Gestão de Tokens do Condomínio (Front)
4) Backend e Persistência (API/DB)
5) Autenticação e Autorização (RBAC)
6) Observabilidade, Qualidade e Deploy

---

## User Stories (com critérios de aceite)

### EP1 — Gestão de Integradores e Condomínios (Front)

**US-001 Criar Integrador**
- Como Super Admin
- Eu quero criar um integrador informando Nome, Descrição, CNPJ e Endereço completo
- Para que eu possa organizar os condomínios sob uma entidade
- Critérios de aceite:
  - Formulário valida CNPJ (formato/14 dígitos) e campos obrigatórios
  - Em sucesso, fecha modal e atualiza a lista na tela
  - Feedback visual (toast) de sucesso/erro

**US-002 Visualizar Integradores**
- Como Super Admin
- Eu quero ver os integradores com seus dados resumidos
- Para monitorar número de condomínios e usuários online
- Critérios de aceite:
  - Card por integrador com: nome, descrição, contagem de condomínios, usuários online/total
  - Engrenagem com ações: Novo Condomínio, Novo Usuário, Listar Usuários, Configurar, Excluir Integrador

**US-003 Criar Condomínio**
- Como Super Admin
- Eu quero adicionar um condomínio ao integrador
- Para que o integrador possa operá-lo
- Critérios de aceite:
  - Modal com `Nome`, `Endereço`, `Host SIP`, `Usuário SIP`, `Senha SIP`
  - Validação de obrigatórios; senha mascarada
  - Em sucesso, fecha modal e atualiza a lista de condomínios do integrador

**US-004 Editar Condomínio**
- Como Super Admin
- Eu quero editar dados do condomínio
- Para manter as informações atualizadas
- Critérios de aceite:
  - Modal pré-preenchido (Nome, Endereço, Host/Usuário/Senha)
  - Botão para abrir detalhes do condomínio (rota `/?building=ID`)
  - Em sucesso, atualiza card na UI

**US-005 Ver lista sempre de Condomínios no Integrador**
- Como Super Admin
- Eu quero ver sempre os condomínios de um integrador
- Para ter visão rápida da carteira
- Critérios de aceite:
  - A seção "Condomínios" é sempre renderizada
  - Ações rápidas por condomínio: Editar, Gerenciar Token, Abrir Detalhes

---

### EP2 — Gestão de Usuários Operacionais do Integrador (Front)

**US-006 Criar Usuário (via Engrenagem)**
- Como Super Admin
- Eu quero criar um usuário para o integrador via ação "Novo Usuário"
- Para habilitar operação (Admin, Porteiro, Porteiro Remoto, Atendimento)
- Critérios de aceite:
  - Formulário com `Nome`, `Email`, `Tipo de Perfil`
  - Se `Porteiro Remoto`, exibir seletor de Condomínio (opcional). Em branco = acesso a todos
  - Feedback de sucesso/erro

**US-007 Listar Usuários do Integrador (inline)**
- Como Super Admin
- Eu quero listar os usuários do integrador em uma visão inline
- Para revisar rapidamente quem opera
- Critérios de aceite:
  - Ação "Listar Usuários" abre a lista embaixo do integrador com nome, email, tipo e status
  - Botão "Voltar" retorna para a visualização padrão

---

### EP3 — Gestão de Tokens do Condomínio (Front)

**US-008 Gerenciar Token do Condomínio**
- Como Super Admin
- Eu quero gerar e revogar tokens do condomínio
- Para controlar integrações/uso de API/serviços
- Critérios de aceite:
  - Ícone de chave abre modal com: `Condomínio`, `Token atual` (somente leitura), `Histórico`
  - Gerar: cria token de 20 caracteres A–Z0–9; passa a ser o atual; registra `created_at`
  - Revogar: limpa token atual e seta `revoked_at` no histórico
  - Histórico mostra token, `criado em`, `revogado em` (se houver), e destaca o atual

---

### EP4 — Backend e Persistência (API/DB)

**US-009 Modelagem de Dados**
- Como Dev
- Eu quero ter um esquema de tabelas para Integradores, Condomínios, Usuários e Tokens
- Para persistir dados com integridade
- Critérios de aceite:
  - Tabelas: `integrators`, `integrator_admins` (ou usuários), `buildings`, `building_sip_credentials`, `building_tokens`
  - Restrição: apenas 1 token ativo por `building` (índice parcial único)
  - `cnpj` único em `integrators`; FKs com `ON DELETE CASCADE`

**US-010 APIs REST**
- Como Frontend
- Eu quero endpoints CRUD para integradores e condomínios, e endpoints para tokens
- Para integrar a UI ao backend
- Critérios de aceite:
  - Integradores: POST/GET/GET:id/PATCH:id/DELETE:id (validações de CNPJ e obrigatórios)
  - Condomínios: idem, com credenciais SIP (armazenar senha criptografada)
  - Tokens: gerar, listar histórico, revogar (20 chars A–Z0–9; 1 ativo)

**US-011 Soft Delete Global**
- Como Produto/Operação
- Eu quero adotar soft delete nas entidades principais
- Para permitir recuperação e auditoria
- Critérios de aceite:
  - Campos: `deleted_at TIMESTAMPTZ NULL`, `deleted_by UUID NULL` em `integrators`, `buildings`, `integrator_admins` (ou `users`)
  - Todas as consultas padrão (GET list/show) devem excluir registros soft-deletados; `?include_deleted=true` expõe opcionalmente
  - Constraints únicas devem considerar apenas registros ativos (índices parciais), ex.: `UNIQUE (cnpj) WHERE deleted_at IS NULL`
  - Endpoints: `DELETE` realiza soft delete; `POST /:id/restore` restaura (zera `deleted_at`/`deleted_by`)
  - Cascata lógica: impedir hard delete; ao soft-deletar um integrador, seus condomínios ficam invisíveis por padrão (não hard delete)

---

### EP5 — Autenticação e Autorização (RBAC)

**US-012 Login e Escopo por Integrador**
- Como Admin Integrador / Super Admin
- Eu quero autenticar e ter escopos
- Para garantir que cada admin veja apenas seus dados
- Critérios de aceite:
  - JWT com claims de `role` e `integrator_id`
  - Rotas protegidas no backend e guardas no frontend

---

### EP6 — Observabilidade, Qualidade e Deploy

**US-013 Logs, Segurança e Rate Limit**
- Como DevOps
- Eu quero ter logs estruturados e proteção
- Para operar com segurança
- Critérios de aceite:
  - Logs sem segredos (masking), rate limit nos endpoints de token

**US-014 Testes e Deploy**
- Como Equipe
- Eu quero ter build estável
- Para garantir qualidade contínua
- Critérios de aceite:
  - Testes unitários principais (tokens, CNPJ, SIP)
  - Build de produção e deploy em Vercel

---

## Backlog (Sugestões Futuras)

- Detalhes avançados do condomínio (páginas de usuários finais, relatórios)
- Importação em massa de usuários/condomínios
- Auditoria (trilhas de auditoria por ação)
- Webhooks para eventos de token e SIP

---

## Rastreabilidade (arquivos principais)

- `src/pages/Integrators.tsx` — cards, engrenagem, modais e tokens
- `src/pages/Dashboard.tsx` — visão geral
- `src/components/ui/navigation.tsx` — navegação lateral
- `src/pages/Index.tsx` — roteamento simples e container
