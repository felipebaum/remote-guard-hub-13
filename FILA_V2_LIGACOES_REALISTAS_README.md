# Fila de Atendimento V2 - Ligações Realistas por Origem

## Funcionalidades Implementadas

### 📞 **Sistema de Ligações Realistas**

Ajustei os dados mock para refletir a realidade das ligações em portarias:

#### **Ligação do Interfone (callOrigin: "intercom"):**
- **Caller Name**: "Visitante no Interfone"
- **Caller Info**: "Aguardando identificação"
- **Apartment**: "Não identificado"
- **Status**: Visitante no portão aguardando ser identificado
- **Câmeras**: ❌ Sem câmeras (avatar com ícone de prédio)

#### **Ligação da Portaria (callOrigin: "reception"):**
- **Caller Name**: "Portaria - Condomínio Solar"
- **Caller Info**: "Visitante aguardando na recepção"
- **Apartment**: "Não identificado"
- **Status**: Portaria ligando porque há um visitante
- **Câmeras**: ✅ 3 câmeras (layout 2+1)

#### **Ligação do Morador (callOrigin: "resident_phone"):**
- **Caller Name**: "Pedro Costa"
- **Caller Info**: "Morador - Apartamento 301"
- **Apartment**: "301"
- **Status**: Morador ligando diretamente
- **Câmeras**: ❌ Sem câmeras (avatar com ícone de telefone)

### 🎯 **Lógica Realista Implementada**

#### **Interfone (Portão):**
- **Situação**: Visitante chega no portão e aperta o interfone
- **Informação**: Ainda não sabemos quem é nem quem vai visitar
- **Display**: "Visitante no Interfone" + "Aguardando identificação"
- **Avatar**: Ícone de prédio (Building)

#### **Portaria (Recepção):**
- **Situação**: Portaria liga porque há um visitante na recepção
- **Informação**: Sabemos que é da portaria, mas não quem é o visitante
- **Display**: "Portaria - Condomínio X" + "Visitante aguardando na recepção"
- **Câmeras**: 3 câmeras para monitorar a entrada
- **Avatar**: Ícone de usuários (Users) quando sem câmeras

#### **Morador (Telefone Direto):**
- **Situação**: Morador liga diretamente do apartamento
- **Informação**: Sabemos quem é o morador e seu apartamento
- **Display**: Nome do morador + "Morador - Apartamento X"
- **Avatar**: Ícone de telefone (Phone)

### 🎨 **Interface Adaptativa**

#### **Avatar Dinâmico:**
- **Portaria**: Ícone de usuários (Users) - múltiplas pessoas
- **Morador**: Ícone de telefone (Phone) - chamada direta
- **Interfone**: Ícone de prédio (Building) - entrada do prédio

#### **Mensagens Contextuais:**
- **Interfone**: "Visitante no interfone aguardando"
- **Portaria**: "Visitante aguardando na portaria"
- **Morador**: "Chamada direta do morador"

#### **Status de Apartamento:**
- **Identificado**: "Apto 301"
- **Não Identificado**: "Aguardando identificação"

### 🔄 **Fluxo Realista**

#### **1. Interfone:**
- Visitante chega no portão
- Aperta o interfone
- Sistema mostra "Visitante no Interfone"
- Porteiro precisa identificar quem é e quem vai visitar
- Wizard ajuda a coletar essas informações

#### **2. Portaria:**
- Visitante chega na portaria/recepção
- Portaria liga para o sistema
- Sistema mostra "Portaria - Condomínio X"
- Câmeras ativas para monitorar
- Porteiro precisa identificar visitante e destino
- Wizard ajuda a coletar essas informações

#### **3. Morador:**
- Morador liga diretamente do apartamento
- Sistema mostra nome e apartamento
- Porteiro já sabe quem é e onde mora
- Wizard foca em identificar o visitante

### 💡 **Benefícios da Abordagem Realista**

#### **Para o Porteiro:**
- **Contexto Claro**: Sempre sabe o tipo de ligação
- **Expectativas Corretas**: Sabe o que esperar de cada tipo
- **Processo Natural**: Fluxo similar ao trabalho real
- **Informações Apropriadas**: Dados relevantes para cada situação

#### **Para o Sistema:**
- **Simulação Precisa**: Comportamento real de portarias
- **Lógica Consistente**: Cada tipo tem suas características
- **Interface Intuitiva**: Visual apropriado para cada situação
- **Fluxo Natural**: Processo que faz sentido

### 🎯 **Casos de Uso Reais**

#### **Interfone - Visitante Chegando:**
- **Situação**: Pessoa chega no portão e aperta interfone
- **Desafio**: Não sabemos quem é nem quem vai visitar
- **Solução**: Wizard ajuda a identificar visitante e destino
- **Resultado**: Processo completo de identificação

#### **Portaria - Visitante na Recepção:**
- **Situação**: Portaria liga porque há visitante na recepção
- **Desafio**: Sabemos que é da portaria, mas não o visitante
- **Solução**: Câmeras ativas + wizard para identificação
- **Resultado**: Monitoramento + processo de identificação

#### **Morador - Chamada Direta:**
- **Situação**: Morador liga do apartamento
- **Desafio**: Sabemos o morador, mas não o visitante
- **Solução**: Wizard focado em identificar o visitante
- **Resultado**: Processo otimizado para o contexto

### 🔧 **Implementação Técnica**

#### **Dados Mock Atualizados:**
- **Interfone**: Informações genéricas de visitante
- **Portaria**: Informações da portaria, não do visitante
- **Morador**: Informações específicas do morador

#### **Interface Condicional:**
- **Avatar Dinâmico**: Ícone apropriado para cada tipo
- **Mensagens Contextuais**: Texto relevante para cada situação
- **Status Adaptativo**: Informações apropriadas para cada contexto

#### **Lógica de Exibição:**
- **Câmeras Condicionais**: Só para portaria
- **Informações Apropriadas**: Dados relevantes para cada tipo
- **Visual Consistente**: Interface que faz sentido

### 🎯 **Resultado Final**

Um sistema onde:
- ✅ **Ligações realistas** baseadas na origem
- ✅ **Informações apropriadas** para cada tipo
- ✅ **Interface adaptativa** conforme o contexto
- ✅ **Fluxo natural** similar ao trabalho real
- ✅ **Expectativas corretas** para cada situação
- ✅ **Processo otimizado** para cada tipo de ligação

---

**Sistema que reflete a realidade das ligações em portarias, com informações apropriadas para cada origem**
