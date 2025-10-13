# User Stories - BACKEND
## Sistema de Atendimento da Portaria

---

## 🔧 API E LÓGICA DE NEGÓCIO

### US-B001: API de Iniciar Chamada
**Como** sistema  
**Quero** registrar o início de uma nova chamada  
**Para** começar a contabilizar tempo e eventos  

**Endpoint:** `POST /api/portaria/chamadas/iniciar`

**Request:**
```json
{
  "type": "main_gate",
  "callerName": "João Silva",
  "building": "Residencial Vista Bela",
  "apartment": "A-101",
  "priority": "high",
  "hasVideo": true
}
```

**Response:**
```json
{
  "id": "call_12345",
  "status": "active",
  "startTime": "2025-10-09T08:30:00Z",
  "events": [
    {
      "timestamp": "2025-10-09T08:30:00Z",
      "type": "call_started",
      "description": "Atendimento iniciado - João Silva (Residencial Vista Bela)"
    }
  ]
}
```

**Tarefas Técnicas:**
- Criar endpoint POST
- Validar dados obrigatórios
- Gerar ID único da chamada
- Registrar timestamp inicial
- Criar primeiro evento do histórico
- Retornar objeto da chamada criada

---

### US-B002: API de Ligar para Morador
**Como** sistema  
**Quero** iniciar ligação para o morador e pausar interfone  
**Para** gerenciar múltiplas linhas telefônicas simultaneamente  

**Endpoint:** `PUT /api/portaria/chamadas/:id/ligar-morador`

**Request:**
```json
{
  "apartment": "A-101",
  "residentName": "Maria Silva",
  "phoneType": "intercom"
}
```

**Response:**
```json
{
  "id": "call_12345",
  "isOnCallWithResident": true,
  "residentCallStartTime": "2025-10-09T08:32:00Z",
  "interfoneOnHold": true,
  "events": [
    {
      "timestamp": "2025-10-09T08:32:00Z",
      "type": "on_hold",
      "description": "Interfone colocado em espera para ligar ao morador"
    },
    {
      "timestamp": "2025-10-09T08:32:01Z",
      "type": "calling_resident",
      "description": "Ligando para Maria Silva - A-101"
    }
  ]
}
```

**Tarefas Técnicas:**
- Validar ID da chamada
- Pausar linha do interfone na telefonia
- Iniciar nova linha para morador
- Registrar timestamps
- Adicionar eventos ao histórico
- Atualizar estado da chamada

---

### US-B003: API de Desligar do Morador
**Como** sistema  
**Quero** encerrar ligação com morador e retomar interfone  
**Para** voltar a falar com o visitante na portaria  

**Endpoint:** `PUT /api/portaria/chamadas/:id/desligar-morador`

**Request:**
```json
{
  "residentResponse": "approved"
}
```

**Response:**
```json
{
  "id": "call_12345",
  "isOnCallWithResident": false,
  "residentCallDuration": 45,
  "interfoneOnHold": false,
  "events": [
    {
      "timestamp": "2025-10-09T08:32:45Z",
      "type": "resident_answered",
      "description": "Morador autorizou a entrada",
      "duration": 45
    },
    {
      "timestamp": "2025-10-09T08:32:46Z",
      "type": "resumed",
      "description": "Desligou do morador após 00:45 - Retornando para interfone"
    }
  ]
}
```

**Tarefas Técnicas:**
- Calcular duração da ligação com morador
- Encerrar linha do morador
- Retomar linha do interfone
- Registrar resposta do morador
- Atualizar eventos
- Calcular tempo total

---

### US-B004: API de Consultar Tempo de Ligação
**Como** sistema  
**Quero** obter tempo atual de ligação (interfone e morador)  
**Para** exibir timers em tempo real no frontend  

**Endpoint:** `GET /api/portaria/chamadas/:id/tempo-ligacao`

**Response:**
```json
{
  "id": "call_12345",
  "interfoneCallDuration": 120,
  "residentCallDuration": 45,
  "moradorElevatorCallDuration": 30,
  "totalDuration": 165,
  "isOnCallWithResident": false,
  "interfoneOnHold": false
}
```

**Tarefas Técnicas:**
- Calcular duração desde startTime
- Calcular duração da ligação com morador
- Calcular duração específica para chamadas de morador/elevador
- Calcular duração total
- Retornar status atual
- Otimizar para polling frequente

---

### US-B005: API de Finalizar Chamada com Decisão
**Como** sistema  
**Quero** finalizar chamada salvando todos os dados e decisão final  
**Para** ter registro completo do atendimento  

**Endpoint:** `PUT /api/portaria/chamadas/:id/finalizar`

**Request:**
```json
{
  "finalStatus": "granted",
  "visitData": {
    "fullName": "João da Silva",
    "cpf": "123.456.789-00",
    "rg": "12.345.678-9",
    "visitReason": "convidado",
    "carModel": "Honda Civic Preto",
    "carPlate": "ABC-1234",
    "apartment": "A-101",
    "residentName": "Maria Silva",
    "notes": "Visitante já conhecido da moradora"
  },
  "capturedPhotos": {
    "visitor": "base64_image_data",
    "vehicle": "base64_image_data",
    "document": "base64_image_data"
  }
}
```

**Response:**
```json
{
  "id": "call_12345",
  "status": "completed",
  "finalStatus": "granted",
  "totalDuration": 165,
  "residentCallDuration": 45,
  "moradorElevatorCallDuration": 30,
  "endTime": "2025-10-09T08:35:00Z",
  "events": [...],
  "visitData": {...},
  "photosSaved": {
    "visitor": "https://storage.com/call_12345_visitor.jpg",
    "vehicle": "https://storage.com/call_12345_vehicle.jpg",
    "document": "https://storage.com/call_12345_document.jpg"
  }
}
```

**Tarefas Técnicas:**
- Salvar todos os dados do visitante
- Salvar dados do morador
- Upload e armazenamento de fotos
- Calcular durações finais
- Registrar evento de finalização
- Mover para tabela de histórico
- Liberar recursos de telefonia
- Enviar notificações se necessário

---

### US-B006: API de Listar Chamadas Aguardando
**Como** sistema  
**Quero** listar todas as chamadas aguardando atendimento  
**Para** popular a fila no frontend  

**Endpoint:** `GET /api/portaria/chamadas/aguardando`

**Query Params:**
- `building` (opcional): filtrar por condomínio
- `priority` (opcional): filtrar por prioridade

**Response:**
```json
{
  "calls": [
    {
      "id": "call_123",
      "type": "main_gate",
      "callerName": "Pedro Costa",
      "building": "Condomínio Solar",
      "priority": "high",
      "status": "waiting",
      "startTime": "2025-10-09T08:28:00Z",
      "waitingTime": 120
    }
  ],
  "total": 3
}
```

**Tarefas Técnicas:**
- Query no banco de chamadas ativas
- Filtros opcionais
- Ordenação por prioridade e tempo
- Cálculo de tempo de espera
- Paginação se necessário

---

### US-B007: API de Listar Chamadas Perdidas
**Como** sistema  
**Quero** listar chamadas que não foram concluídas  
**Para** análise e relatórios  

**Endpoint:** `GET /api/portaria/chamadas/perdidas`

**Query Params:**
- `startDate` (opcional): filtrar por data inicial
- `endDate` (opcional): filtrar por data final
- `building` (opcional): filtrar por condomínio

**Response:**
```json
{
  "calls": [
    {
      "id": "call_456",
      "callerName": "Ana Oliveira",
      "building": "Edifício Central",
      "startTime": "2025-10-09T07:50:00Z",
      "endTime": "2025-10-09T07:52:00Z",
      "totalDuration": 120,
      "moradorElevatorCallDuration": 60,
      "finalStatus": "missed",
      "events": [...]
    }
  ],
  "total": 5
}
```

**Tarefas Técnicas:**
- Query de chamadas com status "missed"
- Filtros por data e condomínio
- Incluir histórico de eventos
- Incluir tempo específico de morador/elevador
- Ordenação por mais recentes
- Paginação

---

### US-B008: API de Listar Chamadas Finalizadas
**Como** sistema  
**Quero** listar chamadas concluídas com sucesso (liberadas/negadas)  
**Para** consultas e relatórios  

**Endpoint:** `GET /api/portaria/chamadas/finalizadas`

**Query Params:**
- `startDate` (opcional)
- `endDate` (opcional)
- `building` (opcional)
- `status` (opcional): "granted" ou "denied"

**Response:**
```json
{
  "calls": [
    {
      "id": "call_789",
      "callerName": "Carlos Lima",
      "building": "Residencial Jardim",
      "apartment": "B-205",
      "startTime": "2025-10-09T08:00:00Z",
      "endTime": "2025-10-09T08:03:30Z",
      "totalDuration": 210,
      "residentCallDuration": 35,
      "moradorElevatorCallDuration": 180,
      "finalStatus": "granted",
      "visitData": {
        "fullName": "Carlos Lima",
        "cpf": "111.222.333-44",
        "visitReason": "entrega"
      },
      "events": [...]
    }
  ],
  "total": 15
}
```

**Tarefas Técnicas:**
- Query de chamadas finalizadas
- Incluir dados do visitante
- Incluir histórico completo
- Incluir todos os tipos de duração
- Filtros múltiplos
- Paginação e ordenação

---

### US-B009: Salvar Dados do Visitante
**Como** sistema  
**Quero** salvar dados completos do visitante  
**Para** manter registro de segurança e auditoria  

**Campos a Salvar:**
- Nome completo
- CPF e RG
- Motivo da visita
- Modelo e cor do veículo
- Placa do veículo (capturada automaticamente)
- Apartamento de destino
- Nome do morador autorizado
- Observações do porteiro
- Timestamp de entrada
- Status (liberado/negado)
- Fotos capturadas (URLs)
- Durações de ligação

**Tarefas Técnicas:**
- Criar tabela `visits` no banco
- Relacionar com `calls`
- Validar CPF
- Armazenar fotos/documentos
- Criar índices para consultas
- Criptografar dados sensíveis

---

### US-B010: Gestão de Eventos de Chamada
**Como** sistema  
**Quero** registrar todos os eventos que ocorrem durante uma chamada  
**Para** ter rastreabilidade completa do atendimento  

**Tipos de Eventos:**
1. `call_started` - Atendimento iniciado
2. `calling_resident` - Ligando para morador
3. `resident_answered` - Morador atendeu e aprovou
4. `resident_rejected` - Morador atendeu e negou
5. `on_hold` - Interfone colocado em espera
6. `resumed` - Interfone retomado
7. `access_granted` - Acesso liberado
8. `access_denied` - Acesso negado
9. `call_ended` - Chamada encerrada
10. `observation_added` - Observação adicionada
11. `panic_activated` - Botão de pânico acionado
12. `photo_captured` - Foto capturada
13. `photo_removed` - Foto removida

**Estrutura do Evento:**
```json
{
  "callId": "call_123",
  "timestamp": "2025-10-09T08:30:00Z",
  "type": "calling_resident",
  "description": "Ligando para Maria Silva - A-101",
  "duration": 45,
  "metadata": {}
}
```

**Tarefas Técnicas:**
- Criar tabela `call_events`
- Relacionar com chamadas
- Timestamp automático
- Tipos enumerados
- Query otimizada para histórico
- Índices para performance

---

### US-B011: API de Botão de Pânico
**Como** sistema  
**Quero** processar e distribuir alertas de pânico  
**Para** acionar equipes de segurança em emergências  

**Endpoint:** `POST /api/portaria/panico/acionar`

**Request:**
```json
{
  "operatorId": "op_123",
  "operatorName": "João Silva",
  "callId": "call_456",
  "reason": "Situação de risco",
  "location": {
    "ip": "192.168.1.100",
    "geolocation": {
      "lat": -23.550520,
      "lng": -46.633308
    }
  }
}
```

**Response:**
```json
{
  "panicId": "panic_789",
  "timestamp": "2025-10-09T08:45:00Z",
  "status": "active",
  "notificationsSent": {
    "websocket": 5,
    "sms": 3,
    "whatsapp": 2
  },
  "recording": {
    "started": true,
    "recordingId": "rec_999"
  },
  "message": "Alerta de pânico acionado com sucesso. Equipe de segurança notificada."
}
```

**Critérios de Aceitação:**
- [ ] Validar operador autenticado
- [ ] Registrar pânico no banco com timestamp preciso
- [ ] Capturar IP e geolocalização do operador
- [ ] Enviar notificação WebSocket para todos os supervisores online
- [ ] Enviar SMS para contatos de emergência cadastrados
- [ ] Enviar WhatsApp via API (Twilio/oficial)
- [ ] Se houver chamada ativa: marcar como emergência e iniciar gravação
- [ ] Registrar evento no histórico da chamada ativa
- [ ] Criar log de auditoria imutável
- [ ] Retornar confirmação com detalhes das notificações enviadas

**Tarefas Técnicas:**
- Criar endpoint POST com autenticação
- Validar operador e sessão
- Salvar registro na tabela `panic_alerts`
- Enviar notificações via WebSocket (Socket.io broadcast)
- Integrar com provedor SMS (Twilio/AWS SNS)
- Integrar com WhatsApp API
- Se `callId` fornecido: atualizar chamada e iniciar recording
- Adicionar evento `panic_activated` ao histórico
- Log imutável para compliance
- Rate limiting para evitar abusos
- Monitoramento de alertas falsos

---

### US-B012: API de Gerenciamento de Condomínios
**Como** sistema  
**Quero** gerenciar condomínios, blocos, apartamentos e moradores  
**Para** organizar a estrutura habitacional  

**Endpoints:**

#### `GET /api/condominios`
Listar todos os condomínios

#### `POST /api/condominios`
Criar novo condomínio

#### `GET /api/condominios/:id/blocos`
Listar blocos de um condomínio

#### `POST /api/condominios/:id/blocos`
Criar novo bloco

#### `GET /api/blocos/:id/apartamentos`
Listar apartamentos de um bloco

#### `POST /api/blocos/:id/apartamentos/gerar`
Gerar apartamentos automaticamente

#### `GET /api/apartamentos/:id/moradores`
Listar moradores de um apartamento

#### `POST /api/apartamentos/:id/moradores`
Adicionar morador ao apartamento

#### `PUT /api/moradores/:id`
Atualizar dados do morador

#### `DELETE /api/moradores/:id`
Remover morador

**Tarefas Técnicas:**
- Criar tabelas: `buildings`, `blocks`, `apartments`, `residents`
- Implementar CRUD completo
- Validações de dados (CPF, telefone)
- Sistema de geração automática de apartamentos
- Busca e filtros
- Importação em lote via CSV
- Log de auditoria

---

### US-B013: API de Importação em Lote de Moradores
**Como** sistema  
**Quero** importar moradores em lote via arquivo CSV  
**Para** agilizar o cadastro inicial  

**Endpoint:** `POST /api/moradores/importar`

**Request:**
```json
{
  "buildingId": "bld_123",
  "blockId": "blk_456",
  "data": [
    {
      "apartment": "A-101",
      "name": "João Silva",
      "cpf": "123.456.789-00",
      "phone": "1234-5678",
      "cellphone": "11999999999",
      "email": "joao@email.com",
      "status": "active"
    }
  ]
}
```

**Response:**
```json
{
  "total": 50,
  "success": 48,
  "errors": 2,
  "errors": [
    {
      "row": 3,
      "apartment": "A-103",
      "error": "CPF inválido"
    }
  ]
}
```

**Tarefas Técnicas:**
- Validação de formato CSV
- Validação de CPF
- Validação de telefone
- Busca de apartamento por número
- Inserção em lote
- Relatório de erros
- Log de importação

---

### US-B014: API de Busca de Moradores
**Como** sistema  
**Quero** buscar moradores por nome e filtrar por bloco  
**Para** facilitar a seleção durante atendimento  

**Endpoint:** `GET /api/moradores/buscar`

**Query Params:**
- `name` (opcional): nome do morador
- `blockId` (opcional): ID do bloco
- `buildingId` (opcional): ID do condomínio
- `status` (opcional): "active" ou "inactive"

**Response:**
```json
{
  "residents": [
    {
      "id": "res_123",
      "name": "João Silva",
      "apartment": {
        "id": "apt_456",
        "number": "A-101",
        "block": {
          "id": "blk_789",
          "name": "Bloco A"
        }
      },
      "phone": "1234-5678",
      "cellphone": "11999999999",
      "status": "active",
      "observations": "Sem entregas após 22h"
    }
  ],
  "total": 1
}
```

**Tarefas Técnicas:**
- Busca por nome (LIKE)
- Filtros múltiplos
- Join com tabelas relacionadas
- Ordenação alfabética
- Paginação
- Índices para performance

---

### US-B015: API de Upload e Armazenamento de Fotos
**Como** sistema  
**Quero** armazenar fotos capturadas durante atendimento  
**Para** manter registro visual de segurança  

**Endpoint:** `POST /api/portaria/fotos/upload`

**Request:**
```multipart/form-data
{
  "callId": "call_123",
  "photoType": "visitor",
  "file": "binary_image_data"
}
```

**Response:**
```json
{
  "photoId": "photo_456",
  "url": "https://storage.com/call_123_visitor.jpg",
  "size": 245760,
  "format": "jpeg"
}
```

**Tarefas Técnicas:**
- Upload para object storage (S3)
- Validação de tipo de arquivo
- Compressão de imagem
- Geração de URLs seguras
- Relacionar com chamada
- Política de retenção
- Criptografia em repouso

---

### US-B016: API de Estatísticas e Métricas
**Como** sistema  
**Quero** fornecer estatísticas em tempo real  
**Para** monitoramento da operação  

**Endpoint:** `GET /api/portaria/estatisticas`

**Response:**
```json
{
  "timestamp": "2025-10-09T08:45:00Z",
  "chamadasAtivas": 3,
  "chamadasAguardando": 7,
  "chamadasPerdidasHoje": 2,
  "chamadasFinalizadasHoje": 45,
  "tempoMedioAtendimento": 180,
  "tempoMedioComMorador": 45,
  "tempoMedioMoradorElevator": 120,
  "operadoresOnline": 5,
  "slaAtendimento": 95.5
}
```

**Tarefas Técnicas:**
- Agregações em tempo real
- Cache de métricas
- Cálculo de médias
- SLA de atendimento
- Performance de operadores
- Exportação de dados

---

### US-B017: API de Relatórios
**Como** sistema  
**Quero** gerar relatórios de atendimentos  
**Para** análise e compliance  

**Endpoint:** `GET /api/portaria/relatorios`

**Query Params:**
- `startDate`: data inicial
- `endDate`: data final
- `buildingId` (opcional): condomínio
- `format`: "json", "csv", "pdf"

**Response:**
```json
{
  "periodo": {
    "inicio": "2025-10-01",
    "fim": "2025-10-31"
  },
  "resumo": {
    "totalChamadas": 1250,
    "chamadasLiberadas": 1100,
    "chamadasNegadas": 100,
    "chamadasPerdidas": 50,
    "tempoMedioAtendimento": 195,
    "tempoMedioComMorador": 42,
    "tempoMedioMoradorElevator": 135
  },
  "porCondominio": [
    {
      "building": "Residencial Vista Bela",
      "total": 450,
      "liberadas": 400,
      "negadas": 35,
      "perdidas": 15
    }
  ],
  "porMotivo": [
    {
      "motivo": "convidado",
      "total": 600,
      "percentual": 48.0
    }
  ]
}
```

**Tarefas Técnicas:**
- Agregações complexas
- Filtros múltiplos
- Exportação em diferentes formatos
- Cache de relatórios
- Agendamento de relatórios
- Compressão de dados

---

## 📞 INTEGRAÇÃO COM TELEFONIA

### US-T001: Receber Chamada do Interfone da Portaria
**Como** sistema de telefonia  
**Quero** receber chamadas de interfones dos condomínios  
**Para** adicionar à fila de atendimento  

**Critérios de Aceitação:**
- [ ] Integração SIP com interfones
- [ ] Detectar número de origem (identificar condomínio)
- [ ] Criar chamada automaticamente no sistema
- [ ] Adicionar à fila com prioridade correta
- [ ] Estabelecer stream de áudio/vídeo
- [ ] Notificar frontend via WebSocket

**Tarefas Técnicas:**
- Configurar servidor SIP
- Implementar WebRTC para streams
- Identificar origem da chamada
- Criar chamada no banco
- WebSocket para notificação real-time

---

### US-T002: Atender Chamada e Estabelecer Conexão
**Como** sistema de telefonia  
**Quero** estabelecer conexão bidirecional de áudio/vídeo  
**Para** permitir comunicação entre porteiro e visitante  

**Critérios de Aceitação:**
- [ ] Aceitar chamada SIP quando porteiro clicar "Atender"
- [ ] Estabelecer stream de vídeo (WebRTC)
- [ ] Estabelecer stream de áudio bidirecional
- [ ] Sincronizar vídeo de todas as câmeras disponíveis
- [ ] Baixa latência (< 500ms)
- [ ] Qualidade de vídeo ajustável

**Tarefas Técnicas:**
- Implementar signaling WebRTC
- Gerenciar ICE candidates
- Multiplexar streams de múltiplas câmeras
- Implementar STUN/TURN servers
- Otimizar codecs

---

### US-T003: Colocar Interfone em Espera
**Como** sistema de telefonia  
**Quero** colocar chamada do interfone em hold  
**Para** permitir ligação simultânea para o morador  

**Critérios de Aceitação:**
- [ ] Pausar stream de áudio do interfone
- [ ] Manter conexão ativa (não desligar)
- [ ] Reproduzir música/tom de espera para visitante
- [ ] Registrar timestamp do hold
- [ ] Permitir retomada a qualquer momento

**Tarefas Técnicas:**
- Implementar SIP HOLD
- Gerenciar estado da sessão
- Reproduzir hold music
- Manter sessão RTP ativa
- Sincronizar com backend

---

### US-T004: Discar para Morador (Interfone do Apartamento)
**Como** sistema de telefonia  
**Quero** originar chamada para interfone do apartamento do morador  
**Para** obter autorização de entrada  

**Critérios de Aceitação:**
- [ ] Discar número SIP do interfone do apartamento
- [ ] Estabelecer conexão de áudio bidirecional
- [ ] Iniciar timer da ligação
- [ ] Detectar quando morador atende
- [ ] Detectar quando morador desliga
- [ ] Timeout após 30 segundos sem resposta
- [ ] Registrar duração da ligação

**Tarefas Técnicas:**
- Mapear apartamento → número SIP
- Originar chamada SIP
- Gerenciar estados da chamada
- Implementar timeout
- Detectar eventos de telefonia
- Registrar durações

---

### US-T005: Discar para Celular do Morador
**Como** sistema de telefonia  
**Quero** originar chamada para celular do morador  
**Para** contato alternativo quando interfone falhar  

**Critérios de Aceitação:**
- [ ] Buscar número de celular cadastrado
- [ ] Discar via trunk SIP/PSTN
- [ ] Estabelecer conexão de áudio
- [ ] Exibir número chamando no frontend
- [ ] Detectar status da chamada (chamando, atendeu, ocupado, não atendeu)
- [ ] Registrar custo da ligação (se aplicável)

**Tarefas Técnicas:**
- Integração com trunk telefônico
- Busca de número no banco
- Originação de chamada externa
- Tratamento de erros
- Billing/cobrança

---

### US-T006: Desligar Chamada com Morador e Retomar Interfone
**Como** sistema de telefonia  
**Quero** encerrar chamada com morador e retomar interfone automaticamente  
**Para** voltar a falar com o visitante  

**Critérios de Aceitação:**
- [ ] Desligar chamada SIP do morador
- [ ] Remover hold do interfone automaticamente
- [ ] Retomar stream de áudio/vídeo do interfone
- [ ] Calcular duração final da ligação com morador
- [ ] Notificar frontend da mudança de estado
- [ ] Sem interrupção perceptível

**Tarefas Técnicas:**
- Encerrar sessão SIP do morador
- Enviar SIP UNHOLD para interfone
- Sincronizar estados
- WebSocket notification
- Calcular e armazenar duração

---

### US-T007: Controles de Áudio (Mutar/Desmutar)
**Como** sistema de telefonia  
**Quero** controlar mute do microfone do porteiro  
**Para** permitir consultas sem visitante ouvir  

**Critérios de Aceitação:**
- [ ] Botão mutar desabilita microfone do porteiro
- [ ] Visitante não ouve o porteiro quando mutado
- [ ] Porteiro continua ouvindo o visitante
- [ ] Indicador visual de estado (mutado/desmutado)
- [ ] Toggle rápido (sem delay)

**Tarefas Técnicas:**
- Controlar stream de áudio local
- Mute via WebRTC
- Sincronizar estado no backend
- Feedback visual imediato

---

### US-T008: Controles de Vídeo (Ativar/Desativar)
**Como** sistema de telefonia  
**Quero** controlar visualização de vídeo  
**Para** economizar banda ou focar no áudio  

**Critérios de Aceitação:**
- [ ] Botão para ativar/desativar vídeo
- [ ] Pausar stream de vídeo (não encerrar)
- [ ] Manter stream de áudio ativo
- [ ] Economia de banda quando desativado
- [ ] Reativar vídeo rapidamente

**Tarefas Técnicas:**
- Controlar tracks de vídeo WebRTC
- Manter conexão ativa
- Otimizar uso de banda
- Estados sincronizados

---

### US-T009: Múltiplas Câmeras Simultâneas
**Como** sistema de telefonia  
**Quero** receber streams de múltiplas câmeras da portaria  
**Para** exibir diferentes ângulos simultaneamente  

**Critérios de Aceitação:**
- [ ] Stream da câmera do interfone (rosto do visitante)
- [ ] Stream da câmera 1 do portão (visão geral)
- [ ] Stream da câmera 2 do portão (área externa)
- [ ] Sincronização de todas as câmeras
- [ ] Baixa latência em todos os streams
- [ ] Fallback se alguma câmera falhar

**Tarefas Técnicas:**
- Múltiplas conexões WebRTC
- Multiplexar streams
- Sincronização de timecode
- Otimização de bandwidth
- Gerenciar tracks de vídeo

---

### US-T010: Transferência de Chamada
**Como** sistema de telefonia  
**Quero** transferir chamada ativa para outro operador  
**Para** redistribuir carga de trabalho  

**Critérios de Aceitação:**
- [ ] Botão "Transferir" disponível durante chamada
- [ ] Selecionar operador destino
- [ ] Transferência cega (sem consulta) ou assistida
- [ ] Manter histórico da chamada
- [ ] Notificar operador destino
- [ ] Registrar transferência no histórico

**Tarefas Técnicas:**
- Implementar SIP REFER
- Transferência cega e assistida
- Manter contexto da chamada
- Notificações WebSocket
- Atualizar owner da chamada

---

### US-T011: Ligação Rápida (Originar Chamada)
**Como** sistema de telefonia  
**Quero** originar chamadas para moradores sem chamada ativa  
**Para** permitir contato proativo do porteiro  

**Endpoint:** `POST /api/portaria/chamadas/ligacao-rapida`

**Request:**
```json
{
  "type": "resident",
  "building": "Residencial Vista Bela",
  "apartment": "A-101",
  "phoneNumber": null
}
```

**Critérios de Aceitação:**
- [ ] Originar chamada SIP para interfone do apartamento
- [ ] Ou discar número externo via trunk
- [ ] Estabelecer conexão de áudio
- [ ] Exibir status da chamada (chamando, atendeu, ocupado)
- [ ] Permitir encerrar a qualquer momento
- [ ] Registrar no histórico

**Tarefas Técnicas:**
- Originar chamadas SIP
- Mapear apartamento → SIP URI
- Trunk para números externos
- Gerenciar estados
- Registrar no banco

---

### US-T012: Detecção Automática de Placa Veicular
**Como** sistema de visão computacional  
**Quero** detectar e ler placa de veículo automaticamente  
**Para** agilizar preenchimento de dados  

**Critérios de Aceitação:**
- [ ] Capturar frame da Câmera 2 - Placa
- [ ] Processar imagem com OCR
- [ ] Detectar formato de placa BR (ABC-1234 ou ABC1D23)
- [ ] Preencher campo "Placa" automaticamente
- [ ] Indicador visual ✨ mostrando que foi auto-preenchido
- [ ] Permitir edição manual
- [ ] Confiança > 80% para auto-preencher

**Tarefas Técnicas:**
- Integrar OCR (Tesseract ou API)
- Preprocessamento de imagem
- Validação de formato de placa
- Confiança threshold
- Fallback para manual

---

### US-T013: Gravação de Chamadas (Compliance)
**Como** sistema  
**Quero** gravar áudio/vídeo de todas as chamadas  
**Para** compliance, segurança e resolução de disputas  

**Critérios de Aceitação:**
- [ ] Gravar áudio de todas as chamadas automaticamente
- [ ] Gravar vídeo das câmeras durante atendimento
- [ ] Armazenar com ID da chamada
- [ ] Retenção configurável (30/60/90 dias)
- [ ] Criptografia em repouso
- [ ] Download de gravações por admin
- [ ] Avisar visitante sobre gravação (LGPD)

**Tarefas Técnicas:**
- Implementar recording de RTP streams
- Armazenamento em object storage (S3)
- Criptografia de arquivos
- Política de retenção
- Compliance LGPD

---

### US-T014: Notificações em Tempo Real (WebSocket)
**Como** sistema  
**Quero** notificar frontend sobre eventos de telefonia  
**Para** atualização em tempo real sem polling  

**Eventos a Notificar:**
- Nova chamada entrando
- Morador atendeu
- Morador desligou
- Visitante desligou
- Timeout de chamada
- Erro de telefonia

**Tarefas Técnicas:**
- Implementar WebSocket server
- Publicar eventos de telefonia
- Subscribe por operador
- Reconnection automática
- Heartbeat/keepalive

---

## 🔄 INTEGRAÇÃO FRONTEND ↔ BACKEND ↔ TELEFONIA

### US-I001: Fluxo Completo de Atendimento de Portaria
**Como** sistema  
**Quero** orquestrar fluxo completo desde chamada até liberação  
**Para** processar visitantes de forma eficiente  

**Fluxo Completo:**

1. **Chamada Chega** (Telefonia → Backend)
   - Interfone da portaria disca para sistema
   - Backend cria registro da chamada
   - WebSocket notifica frontend
   - Chamada aparece na fila "Aguardando"

2. **Porteiro Atende** (Frontend → Backend → Telefonia)
   - Porteiro clica "Atender"
   - Frontend chama `POST /api/portaria/chamadas/:id/atender`
   - Backend aceita chamada SIP
   - Telefonia estabelece streams de áudio/vídeo
   - Frontend exibe câmeras e formulário
   - Timer inicia

3. **Preenche Dados** (Frontend)
   - Nome, CPF, RG, Motivo
   - Veículo e Placa (auto-preenchida)
   - Observações

4. **Seleciona Apartamento** (Frontend → Backend)
   - Porteiro seleciona apartamento no select
   - Frontend busca dados do morador
   - Exibe nome, alertas e preferências

5. **Liga para Morador** (Frontend → Backend → Telefonia)
   - Porteiro clica "LIGAR INTERFONE"
   - Frontend chama `PUT /api/portaria/chamadas/:id/ligar-morador`
   - Backend pausa interfone da portaria (SIP HOLD)
   - Backend origina chamada para interfone do apartamento
   - Telefonia estabelece nova conexão
   - Frontend exibe banner "Em ligação com morador"
   - Timer do morador inicia

6. **Morador Responde** (Telefonia → Backend → Frontend)
   - Morador atende interfone
   - Telefonia notifica backend (SIP 200 OK)
   - Backend registra evento "resident_answered"
   - WebSocket notifica frontend
   - Porteiro conversa com morador
   - Timer continua rodando

7. **Desliga do Morador** (Frontend → Backend → Telefonia)
   - Porteiro clica "Desligar"
   - Frontend chama `PUT /api/portaria/chamadas/:id/desligar-morador`
   - Backend encerra chamada com morador
   - Backend retoma interfone da portaria (SIP UNHOLD)
   - Telefonia reativa áudio/vídeo do interfone
   - Frontend volta para formulário
   - Timer do morador para, timer do interfone retoma

8. **Libera/Nega Entrada** (Frontend → Backend → Telefonia)
   - Porteiro clica "Liberar Entrada e Salvar" ou "Negar Entrada e Salvar"
   - Frontend chama `PUT /api/portaria/chamadas/:id/finalizar`
   - Backend salva todos os dados
   - Backend registra decisão final
   - Backend encerra chamada SIP
   - Telefonia desliga conexões
   - Frontend move para "Finalizadas"
   - Frontend exibe confirmação

**Tarefas Técnicas:**
- Orquestrar fluxo completo
- Sincronizar estados entre camadas
- Tratamento de erros em cada etapa
- Rollback em caso de falha
- Logs detalhados

---

### US-I002: Sincronização de Estados em Tempo Real
**Como** sistema  
**Quero** manter frontend e backend sincronizados  
**Para** garantir consistência de dados  

**Critérios de Aceitação:**
- [ ] WebSocket para eventos em tempo real
- [ ] Atualização de timers a cada segundo
- [ ] Sincronização de estados de chamada
- [ ] Reconexão automática em caso de queda
- [ ] Queue de eventos offline
- [ ] Sincronizar ao reconectar

**Tarefas Técnicas:**
- Implementar WebSocket client/server
- Heartbeat/ping-pong
- Reconnection com exponential backoff
- Offline queue
- State reconciliation

---

### US-I003: Recuperação de Falhas
**Como** sistema  
**Quero** recuperar estado de chamadas em caso de falha  
**Para** não perder dados de atendimentos em andamento  

**Critérios de Aceitação:**
- [ ] Salvar estado da chamada periodicamente
- [ ] Recuperar chamadas ativas ao reconectar
- [ ] Restaurar timers com tempo correto
- [ ] Manter histórico de eventos
- [ ] Notificar usuário sobre reconexão
- [ ] Permitir retomar ou encerrar chamadas pendentes

**Tarefas Técnicas:**
- Persist state no backend
- Recovery ao reconectar
- Calcular timers offset
- Sincronizar histórico
- UI de recovery

---

## 📊 RELATÓRIOS E ANALYTICS

### US-R001: Relatório de Atendimentos
**Como** administrador  
**Quero** gerar relatórios de atendimentos por período  
**Para** análise de performance e segurança  

**Dados do Relatório:**
- Total de chamadas
- Chamadas liberadas vs negadas
- Chamadas perdidas
- Tempo médio de atendimento
- Tempo médio com morador
- Tempo médio de atendimento para moradores/elevadores
- Horários de pico
- Condomínios mais atendidos
- Motivos mais comuns de visita

**Tarefas Técnicas:**
- Criar endpoint de relatórios
- Aggregations no banco
- Export para Excel/PDF
- Filtros por data, condomínio, operador
- Gráficos e visualizações

---

### US-R002: Dashboard de Métricas
**Como** supervisor  
**Quero** dashboard com métricas em tempo real  
**Para** monitorar operação da central  

**Métricas:**
- Chamadas ativas agora
- Fila de espera (tamanho)
- Taxa de perda de chamadas
- Tempo médio de resposta
- SLA de atendimento
- Operadores disponíveis

**Tarefas Técnicas:**
- Criar dashboard com gráficos
- Métricas em tempo real
- Alertas de SLA
- Exportação de dados

---

## 🔐 SEGURANÇA E COMPLIANCE

### US-S001: Auditoria de Acessos
**Como** gestor de segurança  
**Quero** ter log completo de todos os acessos  
**Para** auditoria e investigações  

**Dados de Auditoria:**
- Quem liberou/negou
- Quando (timestamp)
- Dados do visitante
- Dados do morador
- Gravações de áudio/vídeo
- IP do operador
- Geolocalização (se disponível)

**Tarefas Técnicas:**
- Tabela de audit log
- Imutabilidade de registros
- Retenção longa (1+ ano)
- Criptografia
- Export para compliance

---

### US-S002: LGPD - Gestão de Dados Pessoais
**Como** sistema  
**Quero** gerenciar dados pessoais conforme LGPD  
**Para** compliance legal  

**Critérios de Aceitação:**
- [ ] Consentimento para gravação de áudio/vídeo
- [ ] Política de retenção de dados
- [ ] Anonimização após período
- [ ] Exportação de dados (direito do titular)
- [ ] Exclusão sob demanda
- [ ] Criptografia de dados sensíveis (CPF, RG)

**Tarefas Técnicas:**
- Implementar consent management
- Criptografia de PII
- Políticas de retenção
- Export de dados
- Anonimização job
- Logs de acesso a dados

---

## 🎯 DEFINITION OF DONE - BACKEND

Cada User Story é considerada DONE quando:
- [ ] Endpoint implementado e testado
- [ ] Validação de dados obrigatórios
- [ ] Tratamento de erros implementado
- [ ] Logs de auditoria configurados
- [ ] Testes unitários (>80% coverage)
- [ ] Testes de integração
- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] Performance testado (load testing)
- [ ] Segurança validada (autenticação/autorização)
- [ ] Deploy em ambiente de staging
- [ ] Monitoramento configurado
- [ ] Aprovado pelo Product Owner

---

## 🏗️ TECNOLOGIAS BACKEND

### Stack Principal
- **Runtime**: Node.js 18+ ou Python 3.11+
- **Framework**: Express.js (Node) ou FastAPI (Python)
- **Banco de Dados**: PostgreSQL (principal) + Redis (cache)
- **ORM**: Prisma (Node) ou SQLAlchemy (Python)
- **Telefonia**: Asterisk/FreeSWITCH + SIP.js
- **WebSocket**: Socket.io
- **Storage**: AWS S3 (gravações e fotos)
- **Queue**: Redis/Bull (jobs)

### Serviços Externos
- **SMS**: Twilio ou AWS SNS
- **WhatsApp**: WhatsApp Business API
- **OCR**: Tesseract ou Google Vision API
- **Storage**: AWS S3 ou Google Cloud Storage
- **Monitoring**: Prometheus + Grafana

### Padrões de Desenvolvimento
- Clean Architecture
- SOLID principles
- Dependency Injection
- Repository Pattern
- Event Sourcing (para auditoria)
- CQRS (para relatórios)
- Rate Limiting
- Circuit Breaker
- Health Checks

---

**Documento gerado em:** 09/10/2025  
**Versão:** 1.0 - Backend  
**Última atualização:** Separado do documento principal, incluindo funcionalidades específicas de timer para moradores/elevadores
