# User Stories - Sistema de Atendimento da Portaria

## Épico: Sistema de Atendimento Remoto com Gestão de Chamadas

> **📋 Documentos Separados:**
> - **Frontend**: [`USER_STORIES_FRONTEND.md`](./USER_STORIES_FRONTEND.md) - Interface de usuário e componentes React
> - **Backend**: [`USER_STORIES_BACKEND.md`](./USER_STORIES_BACKEND.md) - APIs, lógica de negócio e integrações
> - **Este arquivo**: Visão geral e integração entre frontend e backend

---

## 🎯 VISÃO GERAL DO SISTEMA

### Funcionalidades Principais
- **Atendimento Remoto**: Interface para porteiros atenderem chamadas de múltiplos condomínios
- **Gestão de Chamadas**: Fila de atendimento, histórico e métricas em tempo real
- **Telefonia Integrada**: SIP/WebRTC para comunicação com interfones e moradores
- **Captura de Dados**: Formulários para visitantes, moradores e veículos
- **Sistema de Fotos**: Captura automática de visitantes, veículos e documentos
- **Botão de Pânico**: Alerta de emergência com notificações automáticas
- **Gestão de Condomínios**: Cadastro de blocos, apartamentos e moradores
- **Relatórios**: Analytics e relatórios de atendimento

### Arquitetura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    FRONTEND     │◄──►│    BACKEND      │◄──►│   TELEFONIA     │
│   (React/TS)    │    │   (Node.js)     │    │  (SIP/WebRTC)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   PostgreSQL    │    │   Asterisk      │
│   (Real-time)   │    │   + Redis       │    │  /FreeSWITCH    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📱 FRONTEND - Interface de Atendimento

### Componentes Principais
- **CameraPanel**: Exibição de múltiplas câmeras simultâneas
- **CallQueue**: Fila de chamadas aguardando atendimento
- **VisitForm**: Formulário de dados do visitante
- **ResidentSelector**: Seleção de apartamento/morador
- **PhotoCapture**: Captura e preview de fotos
- **CallHistory**: Histórico de eventos em tempo real
- **PanicButton**: Botão de emergência no header

### Funcionalidades Implementadas
- ✅ Visualização de câmeras em tempo real
- ✅ Atendimento de chamadas da fila
- ✅ Formulário de dados do visitante
- ✅ Seleção de apartamento e morador
- ✅ Ligação para morador via interfone
- ✅ Botão de pânico com confirmação
- ✅ Captura de fotos das câmeras
- ✅ Liberação/negação com salvamento
- ✅ Histórico de eventos em tempo real
- ✅ Seções de chamadas (aguardando, perdidas, finalizadas)
- ✅ Estatísticas em tempo real
- ✅ Controles de chamada (pausar/mutar/transferir)
- ✅ Indicador de ligação com morador
- ✅ Informações do condomínio/cliente
- ✅ Cadastro de blocos e apartamentos
- ✅ Seleção de apartamento melhorada
- ✅ Maximização de câmeras e fotos
- ✅ Busca avançada de moradores
- ✅ **NOVO**: Timer específico para chamadas de morador/elevador

> **📖 Detalhes completos**: [`USER_STORIES_FRONTEND.md`](./USER_STORIES_FRONTEND.md)

---

## 🔧 BACKEND - API e Lógica de Negócio

### APIs Principais
- **Chamadas**: Iniciar, atender, finalizar, consultar tempo
- **Moradores**: Ligar, desligar, buscar dados
- **Fotos**: Upload, armazenamento, associação com chamadas
- **Pânico**: Processar alertas, notificações
- **Condomínios**: CRUD de condomínios, blocos, apartamentos, moradores
- **Relatórios**: Estatísticas e métricas em tempo real

### Funcionalidades Implementadas
- ✅ API de iniciar chamada
- ✅ API de ligar para morador
- ✅ API de desligar do morador
- ✅ API de consultar tempo de ligação
- ✅ API de finalizar chamada com decisão
- ✅ API de listar chamadas (aguardando, perdidas, finalizadas)
- ✅ Salvar dados do visitante
- ✅ Gestão de eventos de chamada
- ✅ API de botão de pânico
- ✅ API de gerenciamento de condomínios
- ✅ API de importação em lote de moradores
- ✅ API de busca de moradores
- ✅ API de upload e armazenamento de fotos
- ✅ API de estatísticas e métricas
- ✅ API de relatórios
- ✅ **NOVO**: Timer específico para chamadas de morador/elevador

> **📖 Detalhes completos**: [`USER_STORIES_BACKEND.md`](./USER_STORIES_BACKEND.md)

---

## 📞 INTEGRAÇÃO COM TELEFONIA

### Funcionalidades de Telefonia
- ✅ Receber chamada do interfone da portaria
- ✅ Atender chamada e estabelecer conexão
- ✅ Colocar interfone em espera
- ✅ Discar para morador (interfone do apartamento)
- ✅ Discar para celular do morador
- ✅ Desligar chamada com morador e retomar interfone
- ✅ Controles de áudio (mutar/desmutar)
- ✅ Controles de vídeo (ativar/desativar)
- ✅ Múltiplas câmeras simultâneas
- ✅ Transferência de chamada
- ✅ Ligação rápida (originar chamada)
- ✅ Detecção automática de placa veicular
- ✅ Gravação de chamadas (compliance)
- ✅ Notificações em tempo real (WebSocket)

> **📖 Detalhes completos**: [`USER_STORIES_BACKEND.md`](./USER_STORIES_BACKEND.md) - Seção Telefonia

---

## 🔄 FLUXO COMPLETO DE INTEGRAÇÃO

### 1. Chamada Chega
```
Interfone → SIP Server → Backend → WebSocket → Frontend
```

### 2. Porteiro Atende
```
Frontend → Backend API → SIP Server → Estabelece Conexão
```

### 3. Liga para Morador
```
Frontend → Backend API → SIP Server → Pausa Interfone + Liga Morador
```

### 4. Finaliza Atendimento
```
Frontend → Backend API → Salva Dados → Upload Fotos → Encerra Chamada
```

---

## 📊 MÉTRICAS E RELATÓRIOS

### Métricas em Tempo Real
- Chamadas ativas agora
- Fila de espera (tamanho)
- Taxa de perda de chamadas
- Tempo médio de resposta
- SLA de atendimento
- Operadores disponíveis

### Relatórios Disponíveis
- Relatório de atendimentos por período
- Dashboard de métricas em tempo real
- Análise por condomínio
- Análise por motivo de visita
- Performance de operadores

---

## 🔐 SEGURANÇA E COMPLIANCE

### Auditoria
- Log completo de todos os acessos
- Quem liberou/negou e quando
- Dados do visitante e morador
- Gravações de áudio/vídeo
- IP e geolocalização do operador

### LGPD
- Consentimento para gravação
- Política de retenção de dados
- Anonimização após período
- Exportação de dados
- Exclusão sob demanda
- Criptografia de dados sensíveis

---

## 🚀 MELHORIAS FUTURAS

### Fase 1 - MVP (4-6 semanas)
- [ ] Backend: APIs básicas
- [ ] Frontend: Interface 3 colunas
- [ ] Telefonia: SIP básico
- [ ] Integração: Fluxo completo

### Fase 2 - Avançado (4-6 semanas)
- [ ] Frontend: Histórico e seções
- [ ] Backend: Eventos e relatórios
- [ ] Telefonia: Múltiplas câmeras e gravação
- [ ] Integração: Sincronização real-time

### Fase 3 - Compliance (2-4 semanas)
- [ ] Segurança e LGPD
- [ ] Relatórios avançados
- [ ] Testes de carga
- [ ] Documentação completa

### Fase 4 - Melhorias (Ongoing)
- [ ] Reconhecimento facial
- [ ] QR Code de autorização
- [ ] App do morador
- [ ] IA e ML

---

## 🎯 DEFINITION OF DONE

### Frontend
- [ ] Componente React implementado e testado
- [ ] Interface responsiva (desktop/mobile)
- [ ] Estados gerenciados corretamente
- [ ] Integração com APIs funcionando
- [ ] Validações de formulário implementadas
- [ ] Feedback visual para ações do usuário

### Backend
- [ ] Endpoint implementado e testado
- [ ] Validação de dados obrigatórios
- [ ] Tratamento de erros implementado
- [ ] Logs de auditoria configurados
- [ ] Testes unitários (>80% coverage)
- [ ] Documentação da API (Swagger/OpenAPI)

### Integração
- [ ] Fluxo completo funcionando
- [ ] Sincronização de estados
- [ ] Tratamento de erros
- [ ] Performance validada
- [ ] Segurança implementada

---

## 🏗️ TECNOLOGIAS

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Estado**: React Context API + useReducer
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL + Redis
- **ORM**: Prisma
- **WebSocket**: Socket.io

### Telefonia
- **SIP Server**: Asterisk/FreeSWITCH
- **WebRTC Gateway**: Janus ou Jitsi
- **STUN/TURN**: Coturn

### Infraestrutura
- **Storage**: AWS S3
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions

---

## 📞 EXEMPLOS DE REQUISIÇÕES

### Fluxo Completo - Exemplo Prático

```javascript
// 1. Atender chamada
POST /api/portaria/chamadas/call_123/atender
Response: { status: "active", streams: {...} }

// 2. Ligar para morador
PUT /api/portaria/chamadas/call_123/ligar-morador
Body: { apartment: "A-101", phoneType: "intercom" }
Response: { 
  interfoneOnHold: true, 
  residentCallStartTime: "2025-10-09T08:32:00Z" 
}

// 3. Consultar tempo (polling a cada 1s)
GET /api/portaria/chamadas/call_123/tempo-ligacao
Response: { 
  interfoneCallDuration: 120,
  residentCallDuration: 45,
  moradorElevatorCallDuration: 30,
  isOnCallWithResident: true
}

// 4. Desligar do morador
PUT /api/portaria/chamadas/call_123/desligar-morador
Body: { residentResponse: "approved" }
Response: { 
  interfoneOnHold: false,
  residentCallDuration: 45,
  events: [...]
}

// 5. Finalizar com liberação
PUT /api/portaria/chamadas/call_123/finalizar
Body: { 
  finalStatus: "granted",
  visitData: { fullName: "João Silva", cpf: "123...", ... }
}
Response: { 
  status: "completed",
  totalDuration: 165,
  saved: true
}
```

---

**Documento gerado em:** 09/10/2025  
**Versão:** 2.0 - Estrutura Separada  
**Última atualização:** Separado em documentos específicos (Frontend/Backend), incluindo funcionalidades de timer específico para moradores/elevadores

---

## 📋 ÍNDICE DE USER STORIES

### Frontend (21 stories)
- US-F001 a US-F021: Interface de usuário, formulários, controles e funcionalidades visuais

### Backend (17 stories)
- US-B001 a US-B017: APIs, lógica de negócio, banco de dados e integrações

### Telefonia (14 stories)
- US-T001 a US-T014: Integração SIP, WebRTC, gravações e notificações

### Integração (3 stories)
- US-I001 a US-I003: Fluxos completos e sincronização entre camadas

### Relatórios (2 stories)
- US-R001 a US-R002: Analytics e dashboards

### Segurança (2 stories)
- US-S001 a US-S002: Auditoria e compliance LGPD

**Total: 59 User Stories organizadas por responsabilidade**