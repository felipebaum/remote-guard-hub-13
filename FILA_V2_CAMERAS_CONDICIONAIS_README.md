# Fila de Atendimento V2 - Câmeras Condicionais por Origem

## Funcionalidades Implementadas

### 🎥 **Sistema de Câmeras Condicionais**

Agora o sistema exibe câmeras **apenas quando necessário**, baseado na origem da ligação:

#### **Com Câmeras (Layout 2+1):**
- **✅ Portaria**: Ligação da portaria/recepção
- **3 Câmeras**: Layout 2+1 (2 em cima, 1 em baixo)
- **Cobertura Total**: Entrada completamente monitorada

#### **Sem Câmeras (Avatar):**
- **❌ Morador**: Ligação direta do morador
- **❌ Elevador**: Ligação do elevador
- **Avatar Central**: Inicial do nome em círculo azul

### 📱 **Interface Adaptativa**

#### **Para Ligações da Portaria:**
- **Layout 2+1**: 3 câmeras distribuídas
- **Câmeras Ativas**: Streams individuais
- **Badges Identificadores**: "Cam 1", "Cam 2", "Cam 3"
- **Monitoramento Completo**: Entrada sob vigilância

#### **Para Ligações de Morador/Elevador:**
- **Avatar Central**: Inicial do nome em círculo grande
- **Informações Claras**: Nome, origem, prédio, apartamento
- **Indicador de Origem**: Badge com tipo da chamada
- **Interface Limpa**: Foco na conversa

### 🎯 **Tipos de Chamada**

#### **📞 Ligação da Portaria (callOrigin: "reception"):**
- **Câmeras**: ✅ 3 câmeras ativas
- **Layout**: 2+1 (2 em cima, 1 em baixo)
- **Função**: Monitoramento da entrada
- **Exemplo**: "Maria Santos - Condomínio Solar"

#### **🏠 Ligação do Morador (callOrigin: "resident_phone"):**
- **Câmeras**: ❌ Sem câmeras
- **Layout**: Avatar central
- **Função**: Conversa direta
- **Exemplo**: "Pedro Costa - Edifício Central Plaza"

#### **📱 Ligação do Interfone (callOrigin: "intercom"):**
- **Câmeras**: ❌ Sem câmeras
- **Layout**: Avatar central
- **Função**: Comunicação via interfone
- **Exemplo**: "João Silva - Residencial Vista Bela"

### 🔄 **Fluxo Adaptativo**

1. **Atender Chamada**
   - Sistema detecta origem automaticamente
   - Layout se adapta conforme o tipo

2. **Portaria (com câmeras)**
   - 3 câmeras aparecem no layout 2+1
   - Monitoramento completo ativo
   - Cobertura total da entrada

3. **Morador/Elevador (sem câmeras)**
   - Avatar central com inicial do nome
   - Informações da chamada claras
   - Foco na conversa

4. **Iniciar Wizard**
   - Layout se ajusta mantendo a lógica
   - Câmeras (se existirem) ficam menores
   - Wizard compacto embaixo

### 🎨 **Design Inteligente**

#### **Detecção Automática:**
- **Origem da Chamada**: Sistema identifica automaticamente
- **Layout Adaptativo**: Interface se ajusta conforme necessário
- **Experiência Otimizada**: Cada tipo tem sua interface ideal

#### **Indicadores Visuais:**
- **Badges de Origem**: Mostra tipo da chamada
- **Cores Consistentes**: Azul para avatar, verde para câmeras
- **Informações Contextuais**: Sempre claras e visíveis

#### **Interface Responsiva:**
- **Altura Adaptativa**: Se ajusta conforme conteúdo
- **Layout Flexível**: Funciona com ou sem câmeras
- **Controles Consistentes**: Sempre disponíveis

### 🔧 **Funcionalidades Técnicas**

#### **Lógica Condicional:**
- **Verificação de Origem**: `call.callOrigin === "reception"`
- **Detecção de Câmeras**: `call.cameras && call.cameras.length >= 3`
- **Fallback Inteligente**: Avatar quando não há câmeras

#### **Estado Adaptativo:**
- **Layout Dinâmico**: Muda conforme origem da chamada
- **Câmeras Condicionais**: Só aparecem quando necessário
- **Interface Consistente**: Controles sempre disponíveis

#### **Dados Mock Atualizados:**
- **Portaria**: Com 3 câmeras (Maria Santos)
- **Morador**: Sem câmeras (Pedro Costa)
- **Interfone**: Sem câmeras (João Silva)

### 🎯 **Benefícios**

#### **Para o Porteiro:**
- **Contexto Claro**: Sempre sabe o tipo de chamada
- **Interface Adequada**: Câmeras só quando necessário
- **Foco Otimizado**: Conversa ou monitoramento conforme o caso
- **Experiência Natural**: Cada tipo tem sua interface ideal

#### **Para o Sistema:**
- **Lógica Realista**: Câmeras só na portaria
- **Interface Inteligente**: Se adapta automaticamente
- **Recursos Otimizados**: Não desperdiça espaço desnecessariamente
- **Simulação Precisa**: Comportamento real de portarias

### 🚀 **Como Usar**

1. **Atender Chamada**: Sistema detecta origem automaticamente
2. **Ver Interface**: Layout se adapta conforme o tipo
3. **Portaria**: 3 câmeras aparecem no layout 2+1
4. **Morador/Elevador**: Avatar central com informações
5. **Iniciar Wizard**: Layout se ajusta mantendo a lógica
6. **Processar**: Wizard compacto funciona em ambos os casos

### 🔄 **Resultado Final**

Um sistema onde:
- ✅ **Câmeras condicionais** baseadas na origem
- ✅ **Layout adaptativo** para cada tipo de chamada
- ✅ **Interface inteligente** que se ajusta automaticamente
- ✅ **Experiência otimizada** para cada situação
- ✅ **Lógica realista** de portarias reais
- ✅ **Recursos eficientes** sem desperdício

---

**Sistema inteligente que exibe câmeras apenas quando a ligação vem da portaria**
