# Épicos e User Stories - Remote Guard Hub

## 📋 Visão Geral do Projeto

O **Remote Guard Hub** é um sistema de gestão de portaria remota para condomínios, com uma arquitetura hierárquica de usuários que permite a gestão centralizada através de integradores. O sistema oferece controle de acesso, monitoramento em tempo real e configurações SIP para comunicação.

### 🏗️ Arquitetura do Sistema
- **Super Admin**: Gerencia integradores e seus administradores
- **Admin Integrador**: Gerencia condomínios e usuários operacionais
- **Usuários Operacionais**: Porteiros, Porteiros Remotos, Admin Integrador
- **Usuários Finais**: Moradores, Administrativos, Síndicos, Zeladores, Funcionários, Visitantes

---

## 🎯 ÉPICOS DO PROJETO

### 1. **ÉPICO: Gestão de Integradores**
**Descrição**: Permite ao Super Admin criar e gerenciar integradores que serão responsáveis por grupos de condomínios.

**Arquivos Relacionados**:
- `src/pages/Integrators.tsx` - Interface principal de gestão
- `src/pages/Index.tsx` - Roteamento e navegação
- `src/components/ui/navigation.tsx` - Menu de navegação

#### User Stories:

**US-001: Criar Novo Integrador** *(Épico: Gestão de Integradores)*
- **Como** Super Admin
- **Eu quero** criar um novo integrador com seu administrador
- **Para que** eu possa delegar a gestão de condomínios para terceiros
- **Critérios de Aceitação**:
  - Formulário com campos: Nome, Descrição, Admin User, Email, Senha
  - Validação de email único
  - Criação automática do usuário administrador
  - Confirmação visual de sucesso

**US-002: Visualizar Integradores** *(Épico: Gestão de Integradores)*
- **Como** Super Admin
- **Eu quero** visualizar todos os integradores cadastrados
- **Para que** eu possa monitorar a estrutura organizacional
- **Critérios de Aceitação**:
  - Lista com cards informativos
  - Informações: Nome, descrição, número de condomínios, usuários online/total
  - Status do administrador
  - Data de criação

**US-003: Adicionar Condomínio ao Integrador** *(Épico: Gestão de Integradores)*
- **Como** Super Admin
- **Eu quero** adicionar condomínios a um integrador específico
- **Para que** o integrador possa gerenciar esses condomínios
- **Critérios de Aceitação**:
  - Modal de criação com campos: Nome, Endereço, Conta SIP
  - Validação de campos obrigatórios
  - Associação automática ao integrador selecionado

**US-004: Editar Condomínio** *(Épico: Gestão de Integradores)*
- **Como** Super Admin
- **Eu quero** editar informações de condomínios existentes
- **Para que** eu possa manter os dados atualizados
- **Critérios de Aceitação**:
  - Modal de edição pré-preenchido
  - Campos editáveis: Nome, Endereço, Conta SIP
  - Botão para acessar detalhes do condomínio

---

### 2. **ÉPICO: Gestão de Administradores de Integradores**
**Descrição**: Permite ao Super Admin criar e gerenciar administradores específicos para cada integrador.

**Arquivos Relacionados**:
- `src/pages/AdminUsers.tsx` - Interface de gestão de admins
- `src/components/StatusIndicator.tsx` - Indicador de status

#### User Stories:

**US-005: Criar Administrador de Integrador** *(Épico: Gestão de Administradores de Integradores)*
- **Como** Super Admin
- **Eu quero** criar administradores para integradores específicos
- **Para que** cada integrador tenha seus próprios gestores
- **Critérios de Aceitação**:
  - Formulário com: Nome, Email, Integrador, Senha
  - Seleção de integrador obrigatória
  - Validação de email único
  - Definição de permissões específicas

**US-006: Visualizar Administradores** *(Épico: Gestão de Administradores de Integradores)*
- **Como** Super Admin
- **Eu quero** visualizar todos os administradores de integradores
- **Para que** eu possa monitorar a estrutura administrativa
- **Critérios de Aceitação**:
  - Lista com cards informativos
  - Informações: Nome, Email, Integrador, Status, Permissões
  - Filtro por integrador
  - Busca por nome/email

**US-007: Gerenciar Permissões de Admin** *(Épico: Gestão de Administradores de Integradores)*
- **Como** Super Admin
- **Eu quero** definir permissões específicas para cada administrador
- **Para que** eu possa controlar o acesso às funcionalidades
- **Critérios de Aceitação**:
  - Lista de permissões disponíveis
  - Seleção múltipla de permissões
  - Visualização clara das permissões ativas
  - Atualização em tempo real

---

### 3. **ÉPICO: Gestão de Usuários Operacionais**
**Descrição**: Permite aos administradores de integradores criar e gerenciar usuários operacionais (Porteiros, Porteiros Remotos, Admin Integrador).

**Arquivos Relacionados**:
- `src/pages/Users.tsx` - Interface de gestão de usuários operacionais
- `src/components/BuildingCard.tsx` - Card de condomínio

#### User Stories:

**US-008: Criar Usuário Operacional** *(Épico: Gestão de Usuários Operacionais)*
- **Como** Admin de Integrador
- **Eu quero** criar usuários operacionais para meus condomínios
- **Para que** eles possam operar o sistema de portaria
- **Critérios de Aceitação**:
  - Formulário com: Nome, Email, Tipo, Integrador, Condomínio
  - Tipos disponíveis: Porteiro, Porteiro Remoto, Admin Integrador
  - Seleção de condomínio baseada no integrador
  - Validação de email único

**US-009: Visualizar Usuários Operacionais** *(Épico: Gestão de Usuários Operacionais)*
- **Como** Admin de Integrador
- **Eu quero** visualizar todos os usuários operacionais dos meus condomínios
- **Para que** eu possa monitorar a operação
- **Critérios de Aceitação**:
  - Lista com cards informativos
  - Informações: Nome, Email, Tipo, Status, Condomínio, Integrador
  - Filtros por: Tipo, Status, Integrador
  - Busca por nome/email

**US-010: Monitorar Status dos Usuários** *(Épico: Gestão de Usuários Operacionais)*
- **Como** Admin de Integrador
- **Eu quero** monitorar o status de conexão dos usuários
- **Para que** eu possa identificar problemas operacionais
- **Critérios de Aceitação**:
  - Indicadores visuais de status (Online, Offline, Latência Alta)
  - Informação de última vez visto
  - Atualização em tempo real
  - Alertas para usuários offline

---

### 4. **ÉPICO: Gestão de Condomínios**
**Descrição**: Permite visualizar e gerenciar detalhes específicos de cada condomínio, incluindo usuários finais e configurações.

**Arquivos Relacionados**:
- `src/pages/BuildingDetails.tsx` - Interface detalhada do condomínio
- `src/pages/Dashboard.tsx` - Visão geral com cards de condomínios

#### User Stories:

**US-011: Visualizar Detalhes do Condomínio** *(Épico: Gestão de Condomínios)*
- **Como** Usuário autorizado
- **Eu quero** acessar detalhes completos de um condomínio
- **Para que** eu possa gerenciar suas configurações e usuários
- **Critérios de Aceitação**:
  - Navegação via URL com parâmetro building
  - Informações: Nome, Endereço, Integrador, Status de conexão
  - Métricas: Total de usuários, usuários online
  - Botão de retorno ao dashboard

**US-012: Gerenciar Usuários do Condomínio** *(Épico: Gestão de Condomínios)*
- **Como** Usuário autorizado
- **Eu quero** criar e gerenciar usuários finais do condomínio
- **Para que** moradores e funcionários possam acessar o sistema
- **Critérios de Aceitação**:
  - Aba "Usuários" com lista de usuários
  - Tipos: Morador, Administrativo, Síndico, Zelador, Funcionário, Visitante
  - Formulário de criação com validação
  - Visualização de status de cada usuário

**US-013: Configurar SIP do Condomínio** *(Épico: Gestão de Condomínios)*
- **Como** Usuário autorizado
- **Eu quero** configurar as credenciais SIP do condomínio
- **Para que** a comunicação funcione corretamente
- **Critérios de Aceitação**:
  - Aba "Configuração SIP" com campos: Conta, Senha, Servidor, Porta
  - Opção de mostrar/ocultar senha
  - Botões: Regenerar credenciais, Testar conexão, Copiar configurações
  - Validação de formato SIP

**US-014: Gerenciar Licenças do Condomínio** *(Épico: Gestão de Condomínios)*
- **Como** Usuário autorizado
- **Eu quero** visualizar e gerenciar licenças vinculadas ao condomínio
- **Para que** eu possa controlar o acesso e limites
- **Critérios de Aceitação**:
  - Aba "Licenças" com lista de licenças ativas
  - Informações: Nome, Status, Data de expiração
  - Botão para vincular nova licença
  - Alertas para licenças próximas do vencimento

---

### 5. **ÉPICO: Dashboard e Monitoramento**
**Descrição**: Fornece uma visão geral do sistema com métricas e monitoramento em tempo real.

**Arquivos Relacionados**:
- `src/pages/Dashboard.tsx` - Interface principal do dashboard
- `src/components/BuildingCard.tsx` - Componente de card de condomínio
- `src/components/StatusIndicator.tsx` - Indicador de status

#### User Stories:

**US-015: Visualizar Dashboard Principal** *(Épico: Dashboard e Monitoramento)*
- **Como** Usuário autorizado
- **Eu quero** acessar um dashboard com visão geral do sistema
- **Para que** eu possa monitorar rapidamente o status geral
- **Critérios de Aceitação**:
  - Cards com métricas: Total de Integradores, Condomínios, Usuários Total, Usuários Online
  - Alternância entre visualização por condomínios e por integradores
  - Lista de condomínios recentes com status
  - Navegação rápida para detalhes

**US-016: Monitorar Status de Conexão** *(Épico: Dashboard e Monitoramento)*
- **Como** Usuário autorizado
- **Eu quero** monitorar o status de conexão dos condomínios
- **Para que** eu possa identificar problemas de conectividade
- **Critérios de Aceitação**:
  - Indicadores visuais de status (Online, Offline, Latência Alta)
  - Tempo de resposta em milissegundos
  - Atualização automática do status
  - Cores diferenciadas por status

**US-017: Navegar por Integradores** *(Épico: Dashboard e Monitoramento)*
- **Como** Usuário autorizado
- **Eu quero** alternar entre visualização por condomínios e por integradores
- **Para que** eu possa ter diferentes perspectivas organizacionais
- **Critérios de Aceitação**:
  - Seletor de tipo de visualização
  - Agrupamento de condomínios por integrador
  - Informações do integrador: Nome, número de condomínios
  - Navegação hierárquica

---

### 6. **ÉPICO: Gestão de Licenças**
**Descrição**: Permite criar e gerenciar licenças do sistema com controle de acesso e limites.

**Arquivos Relacionados**:
- `src/pages/Licenses.tsx` - Interface de gestão de licenças
- `src/components/ui/use-toast.ts` - Sistema de notificações

#### User Stories:

**US-018: Criar Nova Licença** *(Épico: Gestão de Licenças)*
- **Como** Super Admin
- **Eu quero** criar novas licenças para condomínios
- **Para que** eu possa controlar o acesso ao sistema
- **Critérios de Aceitação**:
  - Formulário com: Nome, Tipo, Máximo de usuários, Data de expiração
  - Geração automática de hash único
  - Tipos: Condomínio, Teste
  - Validação de data de expiração

**US-019: Visualizar Licenças** *(Épico: Gestão de Licenças)*
- **Como** Usuário autorizado
- **Eu quero** visualizar todas as licenças do sistema
- **Para que** eu possa monitorar o uso e status
- **Critérios de Aceitação**:
  - Lista com cards informativos
  - Informações: Nome, Target, Status, Hash, Usuários atuais/máximo
  - Status: Ativa, Expirada, Suspensa
  - Filtros por status e tipo

**US-020: Gerenciar Hash de Licença** *(Épico: Gestão de Licenças)*
- **Como** Usuário autorizado
- **Eu quero** visualizar e copiar o hash da licença
- **Para que** eu possa configurar o sistema
- **Critérios de Aceitação**:
  - Campo de hash mascarado por padrão
  - Botão para mostrar/ocultar hash
  - Botão para copiar hash para clipboard
  - Notificação de sucesso ao copiar

---

### 7. **ÉPICO: Navegação e Interface**
**Descrição**: Fornece uma interface intuitiva e navegação eficiente entre as funcionalidades.

**Arquivos Relacionados**:
- `src/components/ui/navigation.tsx` - Menu de navegação lateral
- `src/components/Header.tsx` - Cabeçalho da aplicação
- `src/App.tsx` - Configuração de rotas

#### User Stories:

**US-021: Navegar pelo Sistema** *(Épico: Navegação e Interface)*
- **Como** Usuário autorizado
- **Eu quero** navegar facilmente entre as diferentes seções
- **Para que** eu possa acessar todas as funcionalidades
- **Critérios de Aceitação**:
  - Menu lateral com ícones e labels
  - Indicador visual da seção ativa
  - Navegação sem recarregamento da página
  - Responsividade para dispositivos móveis

**US-022: Acessar Condomínio Específico** *(Épico: Navegação e Interface)*
- **Como** Usuário autorizado
- **Eu quero** acessar diretamente um condomínio específico
- **Para que** eu possa trabalhar com URLs compartilháveis
- **Critérios de Aceitação**:
  - URL com parâmetro `?building=ID`
  - Carregamento automático dos detalhes
  - Botão de retorno ao dashboard
  - Manutenção do estado de navegação

---

### 8. **ÉPICO: Aquisição de PABX em Nuvem**
**Descrição**: Permite aos integradores e condomínios adquirir e configurar serviços de PABX em nuvem para comunicação telefônica avançada.

**Arquivos Relacionados**:
- `src/pages/PabxCloud.tsx` - Interface de gestão de PABX em nuvem (a criar)
- `src/components/PabxCard.tsx` - Card de serviço PABX (a criar)
- `src/components/ui/navigation.tsx` - Adicionar item de menu

#### User Stories:

**US-023: Visualizar Planos de PABX em Nuvem** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador ou Super Admin
- **Eu quero** visualizar os planos disponíveis de PABX em nuvem
- **Para que** eu possa escolher o melhor plano para meus condomínios
- **Critérios de Aceitação**:
  - Lista de planos com características: Número de ramais, minutos incluídos, recursos
  - Preços mensais e anuais
  - Comparativo entre planos
  - Informações sobre recursos: Gravação, IVR, Filas, Relatórios

**US-024: Contratar Plano de PABX** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador
- **Eu quero** contratar um plano de PABX em nuvem para meus condomínios
- **Para que** eu possa oferecer comunicação telefônica avançada
- **Critérios de Aceitação**:
  - Formulário de contratação com dados do integrador
  - Seleção de plano e período de pagamento
  - Informações de cobrança e faturamento
  - Confirmação de contrato e termos de uso
  - Processo de ativação automática

**US-025: Configurar PABX para Condomínio** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador
- **Eu quero** configurar o PABX em nuvem para um condomínio específico
- **Para que** o condomínio tenha sua própria central telefônica
- **Critérios de Aceitação**:
  - Configuração de ramais para cada apartamento/unidade
  - Definição de horários de funcionamento
  - Configuração de IVR (Menu de voz)
  - Atribuição de números de telefone
  - Teste de configuração

**US-026: Gerenciar Ramais do PABX** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador
- **Eu quero** gerenciar os ramais do PABX de cada condomínio
- **Para que** eu possa controlar o acesso telefônico
- **Critérios de Aceitação**:
  - Lista de ramais ativos por condomínio
  - Criação/edição/remoção de ramais
  - Configuração de permissões por ramal
  - Histórico de chamadas por ramal
  - Status de uso em tempo real

**US-027: Monitorar Uso do PABX** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador
- **Eu quero** monitorar o uso do PABX em nuvem
- **Para que** eu possa controlar custos e otimizar recursos
- **Critérios de Aceitação**:
  - Dashboard com métricas de uso: Minutos consumidos, Chamadas realizadas
  - Relatórios de uso por condomínio e período
  - Alertas de limite de uso
  - Histórico de faturamento
  - Gráficos de tendência de uso

**US-028: Configurar Recursos Avançados** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Admin de Integrador
- **Eu quero** configurar recursos avançados do PABX
- **Para que** eu possa oferecer funcionalidades diferenciadas
- **Critérios de Aceitação**:
  - Configuração de filas de atendimento
  - Criação de grupos de ramais
  - Configuração de transferência de chamadas
  - Gravação de chamadas (se permitido)
  - Integração com sistema de portaria

**US-029: Gerenciar Faturamento do PABX** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Super Admin
- **Eu quero** gerenciar o faturamento dos serviços de PABX
- **Para que** eu possa controlar a receita e cobrança
- **Critérios de Aceitação**:
  - Visualização de contratos ativos por integrador
  - Relatórios de faturamento mensal/anual
  - Controle de inadimplência
  - Renovação automática de contratos
  - Suspensão por falta de pagamento

**US-030: Suporte Técnico PABX** *(Épico: Aquisição de PABX em Nuvem)*
- **Como** Usuário do sistema
- **Eu quero** acessar suporte técnico para problemas com PABX
- **Para que** eu possa resolver questões rapidamente
- **Critérios de Aceitação**:
  - Portal de suporte integrado
  - Abertura de chamados técnicos
  - Status de resolução em tempo real
  - Base de conhecimento e FAQs
  - Chat online com suporte técnico

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor

### UI/UX
- **shadcn/ui** - Componentes de interface
- **Radix UI** - Componentes primitivos acessíveis
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Ícones
- **Sonner** - Sistema de notificações

### Desenvolvimento
- **ESLint** - Linting
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade de CSS

---

## 📁 Estrutura de Arquivos Principais

```
src/
├── pages/                    # Páginas principais
│   ├── Index.tsx            # Roteamento principal
│   ├── Dashboard.tsx        # Dashboard com métricas
│   ├── Integrators.tsx      # Gestão de integradores
│   ├── AdminUsers.tsx       # Gestão de admins
│   ├── Users.tsx           # Gestão de usuários operacionais
│   ├── BuildingDetails.tsx  # Detalhes do condomínio
│   └── Licenses.tsx        # Gestão de licenças
├── components/              # Componentes reutilizáveis
│   ├── Header.tsx          # Cabeçalho
│   ├── BuildingCard.tsx    # Card de condomínio
│   ├── StatusIndicator.tsx # Indicador de status
│   └── ui/                 # Componentes de interface
├── hooks/                   # Hooks customizados
├── lib/                     # Utilitários
└── main.tsx                # Ponto de entrada
```

---

## 📊 Resumo da Documentação

### 🎯 **8 Épicos Principais**:
1. **Gestão de Integradores** - Criação e gerenciamento de integradores
2. **Gestão de Administradores** - Criação de admins para cada integrador  
3. **Gestão de Usuários Operacionais** - Porteiros, Porteiros Remotos, Admin Integrador
4. **Gestão de Condomínios** - Detalhes, usuários finais, configurações SIP
5. **Dashboard e Monitoramento** - Visão geral e métricas em tempo real
6. **Gestão de Licenças** - Controle de acesso e limites
7. **Navegação e Interface** - UX/UI e navegação
8. **Aquisição de PABX em Nuvem** - Contratação e gestão de serviços telefônicos

### 📝 **30 User Stories Detalhadas** com:
- Descrição clara do usuário, necessidade e benefício
- Critérios de aceitação específicos
- Caminhos dos arquivos Git relacionados
- Estrutura hierárquica de usuários bem definida

### 🛠️ **Informações Técnicas**:
- Stack tecnológico completo (React, TypeScript, Vite, shadcn/ui)
- Estrutura de arquivos organizada
- Próximos passos sugeridos para evolução

### 📁 **Caminhos dos Arquivos**:
Todos os arquivos relevantes estão mapeados com seus caminhos completos para facilitar o desenvolvimento, incluindo:
- `src/pages/` - Todas as páginas principais
- `src/components/` - Componentes reutilizáveis
- `src/components/ui/` - Componentes de interface

---

## 🎯 Próximos Passos Sugeridos

1. **Implementar Autenticação**
   - Sistema de login com roles
   - Controle de acesso baseado em permissões
   - Sessões seguras

2. **Integração com Backend**
   - APIs REST para CRUD
   - WebSockets para atualizações em tempo real
   - Validação de dados

3. **Funcionalidades Avançadas**
   - Relatórios e analytics
   - Notificações push
   - Logs de auditoria
   - Backup e restore

4. **Melhorias de UX**
   - Loading states
   - Error boundaries
   - Responsividade completa
   - Acessibilidade (WCAG)

5. **Testes**
   - Testes unitários (Jest/Vitest)
   - Testes de integração
   - Testes E2E (Playwright)

---

*Documentação gerada em: $(date)*
*Versão do projeto: 0.0.0*
