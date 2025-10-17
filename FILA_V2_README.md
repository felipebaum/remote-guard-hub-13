# Fila de Atendimento V2 - Sistema Wizard

## Visão Geral

A Fila de Atendimento V2 é uma versão completamente redesenhada do sistema de gerenciamento de visitantes, implementada como um wizard de 5 passos que guia o porteiro através de todo o processo de liberação de acesso.

## Funcionalidades

### 🎯 Processo Wizard Completo

O sistema é dividido em 5 passos sequenciais:

1. **Step 1: Dados do Visitante**
   - Coleta informações básicas do visitante
   - Validação de campos obrigatórios (nome, telefone)
   - Campos opcionais: email, empresa
   - Seleção do motivo da visita

2. **Step 2: Dados do Visitado**
   - Seleção do prédio e apartamento
   - Busca automática de moradores
   - Coleta de dados de quem será visitado
   - Informação do relacionamento

3. **Step 3: Autorização**
   - Contato automático com o morador
   - Simulação de chamadas telefônicas
   - Registro de tentativas de contato
   - Status de autorização (aprovado/negado/sem resposta)

4. **Step 4: Documentação**
   - Coleta de CPF e RG (obrigatórios)
   - Informações do veículo (opcional)
   - Captura de foto do visitante (opcional)
   - Validação de documentos

5. **Step 5: Liberação de Acesso**
   - Configuração do tipo de acesso (temporário/permanente)
   - Definição de restrições especiais
   - Resumo completo do processo
   - Finalização e liberação

### 🎨 Interface Moderna

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Navegação Intuitiva**: Progress bar visual e navegação entre steps
- **Validação em Tempo Real**: Feedback imediato sobre campos obrigatórios
- **Estados Visuais**: Indicadores claros de progresso e status

### 📊 Dashboard Integrado

- **Visão Geral**: Estatísticas em tempo real
- **Duas Abas**: Chamadas ativas e Processos de liberação
- **Filtros Avançados**: Busca por nome, prédio, status
- **Cards Interativos**: Acesso direto ao wizard a partir das chamadas

## Como Usar

### 1. Acesso ao Sistema

- **Via Dashboard**: Clique no card "Fila de Atendimento V2" na página principal
- **URL Direta**: Navegue para `/queue-v2`
- **Nova Aba**: O sistema abre em uma nova aba para não interromper o trabalho

### 2. Iniciando um Processo

1. Na aba "Chamadas", localize a chamada que deseja processar
2. Clique em "Iniciar Processo" ou "Wizard"
3. O sistema abrirá o wizard completo
4. Siga os 5 passos sequenciais

### 3. Navegação no Wizard

- **Progress Bar**: Mostra o progresso visual no topo
- **Botões de Navegação**: "Anterior" e "Próximo" conforme necessário
- **Validação**: Não é possível avançar sem completar campos obrigatórios
- **Cancelamento**: Botão "Cancelar Processo" disponível a qualquer momento

### 4. Finalização

- No Step 5, revise todos os dados coletados
- Configure o tipo de acesso e restrições
- Clique em "Finalizar e Liberar Acesso"
- O processo será registrado e a chamada removida da fila

## Recursos Técnicos

### 🔧 Componentes

- **QueueWizard**: Componente principal que gerencia o fluxo
- **Step Components**: Componentes individuais para cada etapa
- **QueueManagementV2**: Dashboard integrado
- **Validação**: Sistema robusto de validação de formulários

### 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **Touch Friendly**: Botões e campos otimizados para toque

### 🎯 Validações

- **CPF**: Formato brasileiro (000.000.000-00)
- **Telefone**: Formato brasileiro ((11) 99999-9999)
- **Placa**: Formato brasileiro (ABC1234 ou ABC1D23)
- **Campos Obrigatórios**: Validação em tempo real

## Integração com Sistema Existente

### 🔗 Compatibilidade

- **Roteamento**: Integrado ao sistema de rotas existente
- **Componentes UI**: Utiliza a biblioteca de componentes já estabelecida
- **Estilos**: Mantém consistência visual com o sistema atual
- **Dados**: Preparado para integração com APIs existentes

### 📈 Melhorias Futuras

- **Integração com APIs**: Conectar com sistema de dados real
- **Notificações**: Sistema de notificações em tempo real
- **Relatórios**: Geração de relatórios detalhados
- **Auditoria**: Log completo de todas as ações

## Arquivos Criados

```
src/
├── components/
│   ├── QueueWizard.tsx              # Componente principal do wizard
│   └── wizard/
│       ├── Step1VisitorData.tsx     # Step 1: Dados do visitante
│       ├── Step2VisitTarget.tsx     # Step 2: Dados do visitado
│       ├── Step3Authorization.tsx   # Step 3: Autorização
│       ├── Step4Documents.tsx       # Step 4: Documentação
│       └── Step5AccessRelease.tsx   # Step 5: Liberação
├── pages/
│   ├── QueueManagementV2.tsx        # Dashboard da fila V2
│   └── Dashboard.tsx                 # Atualizado com link para V2
└── App.tsx                          # Rota adicionada
```

## Benefícios

### 🚀 Para o Porteiro

- **Processo Guiado**: Não há dúvidas sobre qual informação coletar
- **Validação Automática**: Reduz erros de preenchimento
- **Interface Intuitiva**: Fácil de usar mesmo para usuários não técnicos
- **Feedback Visual**: Sempre sabe em que etapa está

### 🏢 Para o Condomínio

- **Processo Padronizado**: Todos os visitantes são processados da mesma forma
- **Documentação Completa**: Todos os dados são coletados e armazenados
- **Rastreabilidade**: Histórico completo de todos os acessos
- **Segurança**: Validação rigorosa de documentos e autorizações

### 💼 Para o Sistema

- **Escalabilidade**: Fácil adição de novos passos ou validações
- **Manutenibilidade**: Código bem estruturado e documentado
- **Integração**: Preparado para APIs e sistemas externos
- **Extensibilidade**: Base sólida para futuras funcionalidades

---

**Desenvolvido com ❤️ para melhorar a experiência de gerenciamento de visitantes**
