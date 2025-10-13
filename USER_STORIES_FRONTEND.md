# User Stories - FRONTEND
## Sistema de Atendimento da Portaria

---

## 📱 INTERFACE DE ATENDIMENTO

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
- [ ] Campo opcional para motivo/observações
- [ ] Ao confirmar: disparar alerta para supervisores/segurança
- [ ] Exibir toast de confirmação: "Alerta de pânico acionado - Ajuda a caminho"
- [ ] Registrar no histórico de eventos da chamada (se houver chamada ativa)

**Tarefas Técnicas:**
- Criar botão destacado no header
- Implementar modal de confirmação
- Integrar com endpoint `POST /api/portaria/panico/acionar`
- Capturar geolocalização/IP do operador
- Adicionar ao histórico da chamada ativa (se aplicável)
- Implementar feedback visual imediato

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
- [ ] Botão "🔄 Refazer" para recapturar foto
- [ ] Contador de fotos capturadas (ex: "3 fotos capturadas")
- [ ] Fotos salvas automaticamente ao liberar/negar entrada
- [ ] Fotos armazenadas vinculadas ao registro da visita

**Tarefas Técnicas:**
- Capturar screenshot do elemento canvas/video das câmeras
- Converter para base64 ou Blob
- Armazenar temporariamente no estado durante atendimento
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
- Integrar com endpoint de finalização
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
- [ ] Tempo de atendimento para chamadas de morador/elevador
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
- Criar interface de cadastro com validações
- Sistema de geração automática de apartamentos
- Formulário de cadastro de moradores
- Sistema de busca e filtros
- Importação de dados em massa
- Validação de CPF e telefone
- Interface para logs de auditoria

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

### US-F020: Maximização de Câmeras e Fotos
**Como** porteiro remoto  
**Quero** maximizar câmeras e fotos capturadas para visualização detalhada  
**Para** ter melhor visibilidade durante o atendimento  

**Critérios de Aceitação:**
- [ ] Botão de maximizar em cada feed de câmera (aparece no hover)
- [ ] Botão de maximizar em cada foto capturada
- [ ] Modal fullscreen para visualização maximizada
- [ ] Header com informações da câmera/foto
- [ ] Botão de fechar no canto superior direito
- [ ] Fechar com tecla ESC
- [ ] Manter qualidade original da imagem
- [ ] Transição suave de abertura/fechamento

**Tarefas Técnicas:**
- Criar modal fullscreen responsivo
- Implementar controles de hover
- Gerenciar estado de maximização
- Adicionar event listeners para ESC
- Otimizar performance de renderização

---

### US-F021: Busca Avançada de Moradores
**Como** porteiro remoto  
**Quero** buscar moradores por nome e filtrar por bloco  
**Para** encontrar rapidamente o apartamento correto  

**Critérios de Aceitação:**
- [ ] Campo de busca por nome do morador
- [ ] Filtro por bloco específico
- [ ] Resultados em tempo real conforme digita
- [ ] Lista de apartamentos com moradores correspondentes
- [ ] Exibir status do morador (Ativo/Inativo)
- [ ] Mostrar telefones disponíveis
- [ ] Seleção rápida com um clique
- [ ] Funciona tanto na ligação rápida quanto no atendimento

**Tarefas Técnicas:**
- Implementar busca em tempo real
- Criar interface de filtros
- Otimizar performance de busca
- Integrar com dados de moradores
- Design responsivo para diferentes contextos

---

## 🎯 DEFINITION OF DONE - FRONTEND

Cada User Story é considerada DONE quando:
- [ ] Componente React implementado e testado
- [ ] Interface responsiva (desktop/mobile)
- [ ] Estados gerenciados corretamente
- [ ] Integração com APIs funcionando
- [ ] Validações de formulário implementadas
- [ ] Feedback visual para ações do usuário
- [ ] Acessibilidade básica (ARIA labels, navegação por teclado)
- [ ] Testes unitários para componentes críticos
- [ ] Documentação de uso do componente
- [ ] Aprovado em QA visual e funcional
- [ ] Deploy em ambiente de staging
- [ ] Aprovado pelo Product Owner

---

## 🏗️ TECNOLOGIAS FRONTEND

### Stack Principal
- **Framework**: React 18 + TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Estado**: React Context API + useReducer
- **Formulários**: React Hook Form + Zod
- **HTTP Client**: Axios ou Fetch API
- **Real-time**: Socket.io-client

### Componentes Essenciais
- `CameraPanel` - Gerenciamento de feeds de vídeo
- `CallQueue` - Lista de chamadas aguardando
- `CallHistory` - Histórico de eventos
- `VisitForm` - Formulário de dados do visitante
- `ResidentSelector` - Seleção de apartamento/morador
- `PhotoCapture` - Captura e preview de fotos
- `TimerDisplay` - Exibição de timers
- `MaximizeModal` - Modal fullscreen para câmeras/fotos

### Padrões de Desenvolvimento
- Componentes funcionais com hooks
- Props tipadas com TypeScript
- Estados locais para UI, globais para dados
- Error boundaries para tratamento de erros
- Lazy loading para componentes pesados
- Memoização para otimização de performance

---

**Documento gerado em:** 09/10/2025  
**Versão:** 1.0 - Frontend  
**Última atualização:** Separado do documento principal, incluindo funcionalidades de timer específico para moradores/elevadores
