# Fila de Atendimento V2 - Câmeras Específicas por Tipo de Ligação

## Funcionalidades Implementadas

### 📹 **Sistema de Câmeras Específicas**

Ajustei o sistema para ter configurações de câmeras específicas para cada tipo de ligação:

#### **Interfone (1 Câmera):**
- **Caller Name**: "Visitante no Interfone"
- **Caller Info**: "Entrada Social - Aguardando identificação"
- **Câmeras**: ✅ 1 câmera - "Entrada Social"
- **Layout**: Câmera centralizada em tela cheia
- **Função**: Monitorar a entrada social do prédio

#### **Esclusa (3 Câmeras):**
- **Caller Name**: "Esclusa - Condomínio Solar"
- **Caller Info**: "Visitante aguardando na esclusa"
- **Câmeras**: ✅ 3 câmeras - Layout 2+1
- **Layout**: 2 câmeras em cima, 1 em baixo
- **Função**: Monitorar entrada externa, interna e área de espera

#### **Morador (0 Câmeras):**
- **Caller Name**: "Pedro Costa"
- **Caller Info**: "Morador - Apartamento 301"
- **Câmeras**: ❌ Sem câmeras
- **Layout**: Avatar central com ícone de telefone
- **Função**: Chamada direta do morador

### 🎥 **Layouts de Câmera Implementados**

#### **Layout de 1 Câmera (Interfone):**
- **Posicionamento**: Câmera centralizada em tela cheia
- **Informações**: Nome da câmera, localização, status REC
- **Visual**: Ícone de câmera com "Câmera Ativa"
- **Exemplo**: "Entrada Social - Portão Principal"

#### **Layout de 3 Câmeras (Esclusa):**
- **Posicionamento**: Layout 2+1 (2 em cima, 1 em baixo)
- **Câmera 1**: Esclusa Externa - Entrada Externa
- **Câmera 2**: Esclusa Interna - Entrada Interna
- **Câmera 3**: Área de Espera - Recepção
- **Visual**: Badges identificadores e status individual

#### **Layout Sem Câmeras (Morador):**
- **Posicionamento**: Avatar central com ícone
- **Visual**: Ícone de telefone em círculo azul
- **Informações**: Nome do morador, apartamento, prédio
- **Função**: Foco na conversa, sem monitoramento

### 🎯 **Configurações Específicas**

#### **Interfone - Entrada Social:**
- **Câmera**: "Entrada Social" no "Portão Principal"
- **Status**: Ativa com vídeo
- **Função**: Monitorar visitantes no portão
- **Layout**: Tela cheia para melhor visualização

#### **Esclusa - Monitoramento Completo:**
- **Câmera 1**: "Esclusa Externa" - "Entrada Externa" (Ativa)
- **Câmera 2**: "Esclusa Interna" - "Entrada Interna" (Ativa)
- **Câmera 3**: "Área de Espera" - "Recepção" (Inativa)
- **Função**: Cobertura total da esclusa

#### **Morador - Sem Monitoramento:**
- **Câmeras**: Nenhuma
- **Avatar**: Ícone de telefone
- **Função**: Conversa direta sem necessidade de câmeras

### 🔄 **Lógica Condicional Implementada**

#### **Detecção Automática:**
```typescript
// Layout de 1 Câmera (Interfone)
{call.cameras && call.cameras.length === 1 ? (
  // Layout centralizado
) : call.cameras && call.cameras.length >= 3 ? (
  // Layout 2+1 (Esclusa)
) : (
  // Avatar central (Morador)
)}
```

#### **Configurações por Tipo:**
- **Interfone**: `call.cameras.length === 1`
- **Esclusa**: `call.cameras.length >= 3`
- **Morador**: `!call.cameras || call.cameras.length === 0`

### 💡 **Benefícios da Abordagem Específica**

#### **Para o Porteiro:**
- **Visualização Apropriada**: Câmeras adequadas para cada situação
- **Informações Relevantes**: Dados específicos para cada tipo
- **Interface Otimizada**: Layout ideal para cada contexto
- **Processo Natural**: Fluxo similar ao trabalho real

#### **Para o Sistema:**
- **Simulação Precisa**: Comportamento real de portarias
- **Recursos Otimizados**: Câmeras só quando necessário
- **Interface Inteligente**: Se adapta automaticamente
- **Lógica Consistente**: Cada tipo tem suas características

### 🎨 **Interface Adaptativa**

#### **Interfone (1 Câmera):**
- **Layout**: Câmera centralizada em tela cheia
- **Visual**: Ícone de câmera com status "Câmera Ativa"
- **Informações**: Nome e localização da câmera
- **Status**: Indicador REC vermelho

#### **Esclusa (3 Câmeras):**
- **Layout**: 2 câmeras em cima, 1 em baixo
- **Visual**: Badges identificadores para cada câmera
- **Informações**: Nome e localização de cada câmera
- **Status**: Indicadores individuais de cada câmera

#### **Morador (0 Câmeras):**
- **Layout**: Avatar central com ícone de telefone
- **Visual**: Círculo azul com ícone
- **Informações**: Nome, apartamento e prédio
- **Status**: Foco na conversa

### 🔧 **Implementação Técnica**

#### **Dados Mock Atualizados:**
- **Interfone**: 1 câmera "Entrada Social"
- **Esclusa**: 3 câmeras (Externa, Interna, Área de Espera)
- **Morador**: Sem câmeras

#### **Lógica de Exibição:**
- **Detecção por Quantidade**: `cameras.length` determina o layout
- **Layouts Específicos**: Cada quantidade tem seu layout
- **Fallback Inteligente**: Avatar quando não há câmeras

#### **Interface Responsiva:**
- **Altura Adaptativa**: Se ajusta conforme conteúdo
- **Layout Flexível**: Funciona com qualquer quantidade de câmeras
- **Controles Consistentes**: Sempre disponíveis

### 🎯 **Casos de Uso Reais**

#### **Interfone - Entrada Social:**
- **Situação**: Visitante no portão principal
- **Câmera**: Entrada Social para identificação
- **Layout**: Tela cheia para melhor visualização
- **Função**: Identificar visitante antes de liberar

#### **Esclusa - Monitoramento Completo:**
- **Situação**: Visitante na esclusa de segurança
- **Câmeras**: Externa, Interna e Área de Espera
- **Layout**: 2+1 para monitorar todo o processo
- **Função**: Controle total da entrada

#### **Morador - Chamada Direta:**
- **Situação**: Morador liga do apartamento
- **Câmeras**: Nenhuma necessária
- **Layout**: Avatar central
- **Função**: Conversa direta sem monitoramento

### 🎯 **Resultado Final**

Um sistema onde:
- ✅ **Câmeras específicas** para cada tipo de ligação
- ✅ **Layouts otimizados** conforme a quantidade
- ✅ **Interface inteligente** que se adapta automaticamente
- ✅ **Simulação realista** de portarias reais
- ✅ **Recursos eficientes** sem desperdício
- ✅ **Processo natural** para cada situação

---

**Sistema com configurações específicas de câmeras para cada tipo de ligação, otimizando a experiência do porteiro**
