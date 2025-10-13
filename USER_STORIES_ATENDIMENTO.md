# User Stories - Sistema de Atendimento da Portaria

## Épico: Sistema de Atendimento Remoto com Gestão de Chamadas

---

## 📱 FRONTEND - Interface de Atendimento

### US-F001: Visualização de Câmeras em Tempo Real
**Como** porteiro remoto  
**Quero** visualizar múltiplas câmeras simultaneamente (Interfone, Câmera 1 - Portão, Câmera 2 - Portão)  
**Para** ter visão completa do que está acontecendo na portaria  

**Critérios de Aceitação:**
- [ ] Exibir feed principal da câmera do interfone (maior)
- [ ] Exibir feeds secundários das câmeras 1 e 2 do portão (menores, lado a lado)
- [ ] Todas as câmeras devem ser quadradas e proporcionais
- [ ] Indicador visual "● LIVE" nas câmeras ativas
- [ ] Botões de controle overlay ao passar mouse (Snapshot, Zoom, Áudio)
- [ ] Câmeras devem ser visíveis sem necessidade de rolagem
- [ ] Layout responsivo em 3 colunas: Câmeras (35%) | Formulário (45%) | Ações (20%)

**Tarefas Técnicas:**
- Criar componente `CameraPanel` com 3 feeds de vídeo
- Implementar controles overlay com hover
- Adicionar indicadores visuais de status
- Otimizar layout para caber em uma tela sem scroll

---

### US-F002: Atendimento de Chamadas da Fila
**Como** porteiro remoto  
**Quero** atender chamadas da fila de espera  
**Para** iniciar o processo de identificação e liberação  

**Critérios de Aceitação:**
- [ ] Exibir lista de chamadas aguardando atendimento
- [ ] Ordenar por prioridade (Crítica > Alta > Média > Baixa)
- [ ] Mostrar tipo de chamada (Elevador, Portaria, Morador)
- [ ] Exibir tempo de espera de cada chamada
- [ ] Botão "Atender" para iniciar atendimento
- [ ] Ao atender, abrir automaticamente o formulário de dados
- [ ] Iniciar timer da chamada automaticamente
- [ ] Registrar evento "Atendimento iniciado" no histórico

**Tarefas Técnicas:**
- Criar sistema de fila com ordenação por prioridade
- Implementar timer de chamada ativa
- Criar sistema de eventos/histórico
- Integrar formulário de atendimento

---

### US-F003: Formulário de Dados do Visitante
**Como** porteiro remoto  
**Quero** preencher dados do visitante de forma rápida e organizada  
**Para** ter registro completo de quem está solicitando acesso  

**Critérios de Aceitação:**
- [ ] Card "Visitante" com campos: Nome Completo, CPF, RG, Motivo, Veículo, Placa
- [ ] Campo de placa preenchido automaticamente pela câmera (indicador ✨)
- [ ] Dropdown de motivo com opções: Convidado, Entrega, Serviço, Outro
- [ ] Campo de observações para anotações adicionais
- [ ] Validação de campos obrigatórios
- [ ] Layout compacto em grid 2 colunas
- [ ] Inputs com altura reduzida (28px) e texto pequeno

**Tarefas Técnicas:**
- Criar formulário com validação
- Implementar auto-fill da placa via OCR/câmera
- Adicionar campos opcionais e obrigatórios
- Salvar dados localmente durante preenchimento

---

### US-F004: Seleção de Apartamento e Morador
**Como** porteiro remoto  
**Quero** selecionar rapidamente o apartamento de destino  
**Para** identificar qual morador o visitante deseja contatar  

**Critérios de Aceitação:**
- [ ] Card "Morador" ao lado do card "Visitante"
- [ ] Select com apartamentos organizados por blocos (A, B, C, D, E)
- [ ] Ao selecionar apartamento, carregar automaticamente nome do morador
- [ ] Exibir informações do morador (nome, apartamento, status)
- [ ] Mostrar alertas/observações do morador (ex: "Sem entregas após 22h")
- [ ] Badge de status (Ativo/Inativo)

**Tarefas Técnicas:**
- Implementar select agrupado por blocos
- Criar busca/filtro de apartamentos
- Integrar com banco de dados de moradores
- Exibir preferências e alertas do morador

---

### US-F005: Ligação para Morador via Interfone
**Como** porteiro remoto  
**Quero** ligar para o morador pelo interfone do apartamento  
**Para** obter autorização de entrada do visitante  

**Critérios de Aceitação:**
- [ ] Botão "LIGAR INTERFONE" no card do morador
- [ ] Ao clicar, pausar automaticamente a ligação do interfone da portaria
- [ ] Mostrar indicador "Interfone em espera" (amarelo)
- [ ] Exibir banner destacado "Em ligação com morador" (azul gradiente)
- [ ] Timer separado para ligação com morador (texto grande, 2xl)
- [ ] Botão vermelho "Desligar" visível e destacado
- [ ] Ao desligar, retomar automaticamente interfone da portaria
- [ ] Registrar todos os eventos no histórico

**Tarefas Técnicas:**
- Implementar controle de estado de ligação
- Criar timers separados (interfone e morador)
- Adicionar indicadores visuais de status
- Integrar com sistema de telefonia
- Registrar eventos de pausa/retomada

---

### US-F006: Ligação para Morador via Celular
**Como** porteiro remoto  
**Quero** ligar para o celular do morador como alternativa  
**Para** quando o interfone não funcionar ou morador não atender  

**Critérios de Aceitação:**
- [ ] Botão "LIGAR CELULAR" ao lado do botão de interfone
- [ ] Mesmo comportamento de pausa do interfone da portaria
- [ ] Timer separado para ligação celular
- [ ] Indicador visual de ligação ativa
- [ ] Botão de desligar e retomar
- [ ] Registrar no histórico qual número foi chamado

**Tarefas Técnicas:**
- Buscar número de celular do morador no banco
- Implementar discagem via telefonia
- Controlar estado da ligação
- Registrar eventos

---

### US-F007: Ligação Rápida (Header)
**Como** porteiro remoto  
**Quero** fazer ligações rápidas sem estar em atendimento ativo  
**Para** contatar moradores ou discar números externos a qualquer momento  

**Critérios de Aceitação:**
- [ ] Botão "Ligação Rápida" no header da página (lado esquerdo)
- [ ] Botão "Botão de Pânico" ao lado do botão de Ligação Rápida
- [ ] Modal com 2 modos: "Ligar para Morador" e "Discar Número"
- [ ] **Modo Morador**: Select de Condomínio → Select de Apartamento → Morador carregado → Ligar
- [ ] **Modo Direto**: Campo para digitar número → Discar
- [ ] Validação de campos obrigatórios
- [ ] Fechar modal após iniciar ligação
- [ ] Indicador visual de ligação ativa

**Tarefas Técnicas:**
- Criar modal de ligação rápida
- Implementar dois modos de discagem
- Integrar com sistema de telefonia
- Gerenciar estado do modal

---

### US-F007B: Botão de Pânico (Header)
**Como** porteiro remoto  
**Quero** acionar um alerta de emergência rapidamente  
**Para** solicitar ajuda imediata em situações de perigo ou emergência  

**Critérios de Aceitação:**
- [ ] Botão "Botão de Pânico" no header, ao lado do botão "Ligação Rápida"
- [ ] Cor vermelha/laranja com ícone de alerta destacado
- [ ] Ao clicar, mostrar modal de confirmação (evitar acionamento acidental)
- [ ] Modal pergunta: "Tem certeza que deseja acionar o pânico?"
- [ ] Ao confirmar: disparar alerta para supervisores/segurança
- [ ] Notificação via WebSocket para todos os supervisores online
- [ ] Registrar no banco: operador, timestamp, localização (IP/geolocalização)
- [ ] Enviar SMS/WhatsApp para contatos de emergência
- [ ] Gravar áudio/vídeo automaticamente se houver chamada ativa
- [ ] Exibir toast de confirmação: "Alerta de pânico acionado - Ajuda a caminho"
- [ ] Registrar no histórico de eventos da chamada (se houver chamada ativa)
- [ ] Log de auditoria completo

**Tarefas Técnicas:**
- Criar botão destacado no header
- Implementar modal de confirmação
- Criar endpoint `POST /api/portaria/panico/acionar`
- Integrar com sistema de notificações (WebSocket, SMS, WhatsApp)
- Registrar evento no banco de dados
- Capturar geolocalização/IP do operador
- Notificar supervisores em tempo real
- Adicionar ao histórico da chamada ativa (se aplicável)
- Implementar sistema de auditoria

---

### US-F007C: Captura de Fotos das Câmeras
**Como** porteiro remoto  
**Quero** capturar fotos das câmeras durante o atendimento  
**Para** ter registro visual do visitante, veículo e documentos  

**Critérios de Aceitação:**
- [ ] Botão "📸 Foto Visitante" para capturar imagem da Câmera 1 (rosto)
- [ ] Botão "📸 Foto Veículo" para capturar imagem da Câmera 2 (veículo/placa)
- [ ] Botão "📸 Foto Documento" para capturar imagem de documento apresentado
- [ ] Preview das fotos capturadas em thumbnails
- [ ] Mostrar timestamp de cada foto capturada
- [ ] Indicador visual quando foto é capturada com sucesso
- [ ] Botão "❌" em cada thumbnail para excluir foto antes de salvar
- [ ] Contador de fotos capturadas (ex: "3 fotos capturadas")
- [ ] Fotos salvas automaticamente ao liberar/negar entrada
- [ ] Fotos armazenadas vinculadas ao registro da visita
- [ ] Nome dos arquivos: `{callId}_visitante.jpg`, `{callId}_veiculo.jpg`, `{callId}_documento.jpg`

**Tarefas Técnicas:**
- Capturar screenshot do elemento canvas/video das câmeras
- Converter para base64 ou Blob
- Armazenar temporariamente no estado durante atendimento
- Fazer upload para storage (S3/local) ao finalizar
- Salvar URLs das fotos no banco junto com a visita
- Implementar preview de thumbnails
- Adicionar evento no histórico quando foto é capturada
- Compressão de imagem para otimizar storage

---

### US-F008: Liberação de Entrada com Salvamento
**Como** porteiro remoto  
**Quero** liberar a entrada e salvar automaticamente todos os dados  
**Para** ter registro completo do acesso concedido  

**Critérios de Aceitação:**
- [ ] Botão verde grande "Liberar Entrada e Salvar"
- [ ] Salvar: Nome, CPF, RG, Motivo, Veículo, Placa, Apartamento, Morador, Observações
- [ ] Salvar fotos capturadas (visitante, veículo, documento)
- [ ] Registrar evento "Acesso liberado" com todos os detalhes
- [ ] Adicionar à lista de "Finalizadas" com status "✅ Liberado"
- [ ] Encerrar chamada automaticamente
- [ ] Limpar formulário e fotos temporárias
- [ ] Mostrar alerta de confirmação
- [ ] Log completo no console para debug

**Tarefas Técnicas:**
- Validar dados obrigatórios antes de salvar
- Upload de fotos para storage
- Salvar no banco de dados com URLs das fotos
- Adicionar ao histórico de chamadas finalizadas
- Limpar estados após finalização

---

### US-F009: Negação de Entrada com Salvamento
**Como** porteiro remoto  
**Quero** negar a entrada e salvar os dados do visitante  
**Para** ter registro de tentativas de acesso negadas  

**Critérios de Aceitação:**
- [ ] Botão vermelho grande "Negar Entrada e Salvar"
- [ ] Salvar todos os dados do visitante (mesmo negado)
- [ ] Registrar motivo da negação (campo observações)
- [ ] Adicionar à lista de "Finalizadas" com status "🚫 Negado"
- [ ] Encerrar chamada automaticamente
- [ ] Limpar formulário
- [ ] Mostrar alerta de confirmação
- [ ] Log completo no console

**Tarefas Técnicas:**
- Salvar dados no banco mesmo quando negado
- Registrar motivo da negação
- Adicionar ao histórico
- Implementar lógica de finalização

---

### US-F010: Histórico de Eventos em Tempo Real
**Como** porteiro remoto  
**Quero** ver o histórico de eventos da chamada atual em tempo real  
**Para** acompanhar tudo que aconteceu durante o atendimento  

**Critérios de Aceitação:**
- [ ] Painel "Eventos desta Chamada" na coluna direita
- [ ] Cores diferentes por tipo de evento (azul, roxo, verde, vermelho)
- [ ] Timestamp de cada evento em formato HH:MM:SS
- [ ] Duração das ações quando aplicável
- [ ] Scroll automático para último evento
- [ ] Eventos incluem: Início, Ligação morador, Resposta, Pausa, Retomada, Liberação/Negação

**Tipos de Eventos:**
- 🔵 Azul: Atendimento iniciado
- 🟣 Roxo: Ligando para morador
- 🟢 Verde: Morador autorizou / Acesso liberado
- 🔴 Vermelho: Morador negou / Acesso negado
- 🟡 Amarelo: Interfone em espera / Retomado
- ⚪ Cinza: Observação adicionada

**Tarefas Técnicas:**
- Criar sistema de eventos timestamped
- Implementar cores semânticas
- Adicionar scroll automático
- Salvar histórico no estado

---

### US-F011: Seção de Chamadas Aguardando
**Como** porteiro remoto  
**Quero** ver todas as chamadas aguardando atendimento  
**Para** priorizar e organizar meu trabalho  

**Critérios de Aceitação:**
- [ ] Tab "Aguardando" com contador de chamadas
- [ ] Lista ordenada por prioridade
- [ ] Exibir: Tipo, Nome, Condomínio, Apartamento, Tempo de espera
- [ ] Badge de prioridade colorido
- [ ] Botão "Atender" para cada chamada
- [ ] Avatar com ícone do tipo de chamada
- [ ] Atualização em tempo real

**Tarefas Técnicas:**
- Implementar sistema de tabs
- Ordenação por prioridade
- Atualização em tempo real da fila
- Design responsivo

---

### US-F012: Seção de Chamadas Perdidas
**Como** porteiro remoto  
**Quero** ver chamadas que não foram concluídas  
**Para** identificar atendimentos que falharam e entender o motivo  

**Critérios de Aceitação:**
- [ ] Tab "Perdidas" com contador
- [ ] Card vermelho para cada chamada perdida
- [ ] Informações: Nome, Condomínio, Horário, Duração total
- [ ] Badge "Perdida" em destaque
- [ ] Histórico de eventos expansível (details/summary)
- [ ] Ver todos os eventos que ocorreram antes de perder
- [ ] Ordenação por mais recentes primeiro

**Tarefas Técnicas:**
- Filtrar chamadas finalizadas sem decisão
- Implementar expansão de detalhes
- Salvar histórico completo
- Design com cores de alerta

---

### US-F013: Seção de Chamadas Finalizadas
**Como** porteiro remoto  
**Quero** ver histórico de chamadas concluídas (liberadas/negadas)  
**Para** consultar atendimentos anteriores e gerar relatórios  

**Critérios de Aceitação:**
- [ ] Tab "Finalizadas" com contador
- [ ] Cards verde (liberado) ou vermelho (negado)
- [ ] Informações: Nome, Condomínio, Apartamento, Status
- [ ] Duração total do atendimento
- [ ] Tempo de ligação com morador (quando aplicável)
- [ ] Histórico completo expansível com todos os eventos
- [ ] Badge "✅ Liberado" ou "🚫 Negado"
- [ ] Timestamp de início em formato BR

**Tarefas Técnicas:**
- Filtrar chamadas por status final
- Exibir histórico completo
- Calcular durações
- Implementar expansão de detalhes

---

### US-F014: Estatísticas em Tempo Real
**Como** porteiro remoto  
**Quero** ver estatísticas consolidadas do atendimento  
**Para** monitorar performance e carga de trabalho  

**Critérios de Aceitação:**
- [ ] Card "Ativas": Quantidade de chamadas em atendimento no momento
- [ ] Card "Aguardando": Quantidade de chamadas na fila
- [ ] Card "Perdidas": Total de chamadas perdidas hoje
- [ ] Card "Finalizadas": Total de chamadas concluídas hoje
- [ ] Card "Tempo Médio": Cálculo automático do tempo médio de atendimento
- [ ] Cores diferentes para cada métrica
- [ ] Atualização em tempo real

**Tarefas Técnicas:**
- Calcular métricas dinamicamente
- Implementar contadores reativos
- Design com 5 cards em linha
- Cálculo de média de tempo

---

### US-F015: Controles de Chamada (Pausar/Mutar/Transferir)
**Como** porteiro remoto  
**Quero** controlar a chamada ativa (pausar, mutar, transferir, encerrar)  
**Para** gerenciar a comunicação durante o atendimento  

**Critérios de Aceitação:**
- [ ] Botão "Pausar/Retomar" com indicador visual
- [ ] Botão "Mutar/Ativar" microfone
- [ ] Botão "Vídeo On/Off"
- [ ] Botão "Transferir" (para outro operador)
- [ ] Botão "Encerrar" (vermelho, finaliza tudo)
- [ ] Timer visível mostrando tempo de interfone
- [ ] Indicador quando interfone está pausado (amarelo)
- [ ] Todos os botões compactos e alinhados

**Tarefas Técnicas:**
- Implementar controles de áudio/vídeo
- Gerenciar estado de pausa
- Integrar com telefonia
- Adicionar indicadores visuais

---

### US-F016: Indicador de Ligação com Morador
**Como** porteiro remoto  
**Quero** ver claramente quando estou em ligação com o morador  
**Para** saber com quem estou falando e há quanto tempo  

**Critérios de Aceitação:**
- [ ] Banner grande azul gradiente quando em ligação com morador
- [ ] Ícone de telefone pulsando
- [ ] Nome do morador e apartamento visíveis
- [ ] Timer grande (texto 2xl) em tempo real
- [ ] Label "tempo de ligação"
- [ ] Botão vermelho "Desligar" em destaque
- [ ] Ao desligar, voltar automaticamente para interfone

**Tarefas Técnicas:**
- Criar componente de indicador visual
- Implementar timer separado
- Gerenciar transição entre chamadas
- Adicionar animações

---

### US-F017: Informações do Condomínio/Cliente
**Como** porteiro remoto  
**Quero** ver claramente qual condomínio estou atendendo  
**Para** não confundir informações entre diferentes clientes  

**Critérios de Aceitação:**
- [ ] Card destacado no topo do formulário
- [ ] Ícone de prédio
- [ ] Nome do condomínio em destaque
- [ ] Badge com tipo de contato (Elevador/Portaria/Morador)
- [ ] Background gradiente azul/cyan
- [ ] Sempre visível durante o atendimento

**Tarefas Técnicas:**
- Exibir informações do condomínio
- Design destacado
- Integrar com dados da chamada

---

### US-F018: Cadastro de Blocos e Apartamentos
**Como** administrador  
**Quero** cadastrar blocos e apartamentos dentro dos condomínios  
**Para** organizar a estrutura habitacional e facilitar o atendimento  

**Critérios de Aceitação:**
- [ ] Seção "Gerenciar Condomínios" no menu administrativo
- [ ] Lista de condomínios cadastrados
- [ ] Botão "Gerenciar Blocos" para cada condomínio
- [ ] Modal para adicionar/editar blocos:
  - Nome do bloco (ex: "Bloco A", "Torre 1", "Edifício Sul")
  - Quantidade de andares
  - Apartamentos por andar
- [ ] Sistema de geração automática de apartamentos:
  - Exemplo: Bloco A, 10 andares, 4 aptos/andar = A-101 a A-1040
- [ ] Lista de apartamentos gerados com opção de editar/remover
- [ ] Cadastro de morador por apartamento:
  - Nome completo
  - CPF
  - Telefone (interfone)
  - Celular
  - Email
  - Observações (ex: "Sem entregas após 22h")
- [ ] Status do morador (Ativo/Inativo)
- [ ] Busca e filtros por bloco/apartamento
- [ ] Importação em lote via Excel/CSV
- [ ] Validação de dados (CPF, telefone)
- [ ] Histórico de alterações

**Tarefas Técnicas:**
- Criar tabelas: buildings, blocks, apartments, residents
- Interface de cadastro com validações
- Sistema de geração automática de apartamentos
- Formulário de cadastro de moradores
- Sistema de busca e filtros
- Importação de dados em massa
- Validação de CPF e telefone
- Log de auditoria

---

### US-F019: Seleção de Apartamento Melhorada
**Como** porteiro remoto  
**Quero** selecionar apartamentos de forma mais organizada  
**Para** encontrar rapidamente o morador correto  

**Critérios de Aceitação:**
- [ ] Select agrupado por blocos
- [ ] Formato: "Bloco A - 101" ao invés de apenas "A-101"
- [ ] Busca por nome do morador
- [ ] Filtro por bloco específico
- [ ] Indicador de status do morador (Ativo/Inativo)
- [ ] Exibir telefones disponíveis (interfone/celular)
- [ ] Observações do morador visíveis na seleção
- [ ] Ordenação alfabética por bloco e apartamento
- [ ] Sugestão automática ao digitar

**Tarefas Técnicas:**
- Modificar componente de seleção
- Implementar busca e filtros
- Integrar com dados de moradores
- Adicionar indicadores visuais
- Sistema de sugestões

---

## 🔧 BACKEND - API e Lógica de Negócio

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
  "phoneType": "intercom" // ou "cellphone"
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
  "residentResponse": "approved" // ou "rejected" ou null
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
    },
    {
      "timestamp": "2025-10-09T08:32:47Z",
      "type": "resumed",
      "description": "Interfone retomado automaticamente"
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
  "totalDuration": 165,
  "isOnCallWithResident": false,
  "interfoneOnHold": false
}
```

**Tarefas Técnicas:**
- Calcular duração desde startTime
- Calcular duração da ligação com morador
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
  "finalStatus": "granted", // ou "denied" ou "missed"
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
  "endTime": "2025-10-09T08:35:00Z",
  "events": [...],
  "visitData": {...}
}
```

**Tarefas Técnicas:**
- Salvar todos os dados do visitante
- Salvar dados do morador
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

**Tarefas Técnicas:**
- Criar tabela `visits` no banco
- Relacionar com `calls`
- Validar CPF
- Armazenar fotos/documentos (futuro)
- Criar índices para consultas

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

---

## 📞 INTEGRAÇÃO COM TELEFONIA (SIP/WebRTC)

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
  "type": "resident", // ou "direct"
  "building": "Residencial Vista Bela",
  "apartment": "A-101",
  "phoneNumber": null // ou número direto
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

### US-T011B: Botão de Pânico (API)
**Como** sistema  
**Quero** processar e distribuir alertas de pânico  
**Para** acionar equipes de segurança em emergências  

**Endpoint:** `POST /api/portaria/panico/acionar`

**Request:**
```json
{
  "operatorId": "op_123",
  "operatorName": "João Silva",
  "callId": "call_456", // opcional, se houver chamada ativa
  "reason": "Situação de risco", // opcional
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
**Como** porteiro remoto  
**Quero** realizar atendimento completo desde a chamada até liberação  
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

## 🚀 MELHORIAS FUTURAS

### US-M001: Reconhecimento Facial
- Identificação automática de visitantes frequentes
- Alertas de pessoas em lista de restrição
- Integração com banco de fotos

### US-M002: QR Code de Autorização
- Morador gera QR Code pelo app
- Visitante apresenta QR Code na portaria
- Liberação automática sem ligação

### US-M003: Integração com Aplicativo do Morador
- Notificação push quando visitante chega
- Morador autoriza entrada pelo app
- Liberação automática sem ligação telefônica

### US-M004: IA para Priorização
- ML para priorizar chamadas automaticamente
- Detecção de emergências
- Sugestão de ações baseada em histórico

### US-M005: Multi-idioma
- Interface em PT, EN, ES
- Suporte a moradores estrangeiros
- Tradução em tempo real

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - MVP (4-6 semanas)
- [ ] Backend: APIs básicas (B001-B008)
- [ ] Frontend: Interface 3 colunas (F001-F007)
- [ ] Telefonia: SIP básico (T001-T004)
- [ ] Integração: Fluxo completo (I001)

### Fase 2 - Avançado (4-6 semanas)
- [ ] Frontend: Histórico e seções (F008-F017)
- [ ] Backend: Eventos e relatórios (B009-B010, R001)
- [ ] Telefonia: Múltiplas câmeras e gravação (T009, T013)
- [ ] Integração: Sincronização real-time (I002-I003)

### Fase 3 - Compliance (2-4 semanas)
- [ ] Segurança e LGPD (S001-S002)
- [ ] Relatórios avançados (R002)
- [ ] Testes de carga
- [ ] Documentação completa

### Fase 4 - Melhorias (Ongoing)
- [ ] Reconhecimento facial (M001)
- [ ] QR Code (M002)
- [ ] App do morador (M003)
- [ ] IA e ML (M004)

---

## 🎯 DEFINITION OF DONE

Cada User Story é considerada DONE quando:
- [ ] Código implementado e revisado
- [ ] Testes unitários (>80% coverage)
- [ ] Testes de integração
- [ ] Documentação técnica
- [ ] Aprovado em QA
- [ ] Deploy em staging
- [ ] Aprovado pelo PO
- [ ] Deploy em produção

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

## 🏗️ ARQUITETURA SUGERIDA

### Backend
- **Framework**: Node.js + Express ou Fastify
- **Banco de Dados**: PostgreSQL (relacional) + Redis (cache)
- **Telefonia**: Asterisk/FreeSWITCH + SIP.js
- **WebSocket**: Socket.io
- **Storage**: AWS S3 (gravações)

### Frontend
- **Framework**: React + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Estado**: Zustand ou Context API
- **WebRTC**: Simple-peer ou PeerJS
- **Real-time**: Socket.io-client

### Telefonia
- **SIP Server**: Asterisk ou FreeSWITCH
- **WebRTC Gateway**: Janus ou Jitsi
- **STUN/TURN**: Coturn
- **Recording**: Asterisk Recording ou custom

---

**Documento gerado em:** 09/10/2025  
**Versão:** 1.4  
**Última atualização:** Adicionado sistema de cadastro de condomínios, blocos e apartamentos (US-F018 e US-F019)

