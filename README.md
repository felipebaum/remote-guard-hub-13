# Remote Guard Hub

Sistema de gestão de portaria remota para condomínios com arquitetura hierárquica de usuários.

## 🚀 Deploy na Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Faça push do código para o GitHub**
   ```bash
   git add .
   git commit -m "Preparar para deploy na Vercel"
   git push origin main
   ```

2. **Conecte com a Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Importe o repositório
   - A Vercel detectará automaticamente as configurações do Vite

3. **Deploy automático**
   - A Vercel fará o build e deploy automaticamente
   - Cada push na branch `main` gerará um novo deploy

### Opção 2: Deploy via Vercel CLI

1. **Instale a Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy de produção**
   ```bash
   vercel --prod
   ```

## 🛠️ Desenvolvimento Local

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd remote-guard-hub-13
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra no navegador**
   Navegue para [http://localhost:8080](http://localhost:8080)

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executar ESLint
- `npm start` - Servidor de preview (porta 3000)

## 🏗️ Arquitetura do Sistema

### Hierarquia de Usuários
- **Super Admin**: Gerencia integradores e seus administradores
- **Admin Integrador**: Gerencia condomínios e usuários operacionais
- **Usuários Operacionais**: Porteiros, Porteiros Remotos, Admin Integrador
- **Usuários Finais**: Moradores, Administrativos, Síndicos, Zeladores, Funcionários, Visitantes

### Funcionalidades Principais
- ✅ Gestão de Integradores (CNPJ, endereço)
- ✅ Gestão de Condomínios (host SIP, usuário, senha)
- ✅ Gestão de Usuários (Admin, Porteiro, Porteiro Remoto, Atendimento)
- ✅ Gerenciamento de Tokens (gerar, revogar, histórico)
- ✅ Dashboard com métricas em tempo real
- ✅ Interface responsiva e moderna

## 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: React Router DOM

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface (shadcn/ui)
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── BuildingCard.tsx # Card de condomínio
│   └── StatusIndicator.tsx # Indicador de status
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Integrators.tsx # Gestão de integradores
│   ├── Users.tsx       # Gestão de usuários
│   └── BuildingDetails.tsx # Detalhes do condomínio
├── hooks/              # Hooks customizados
├── lib/                # Utilitários
└── main.tsx           # Ponto de entrada
```

## 🔧 Configuração da Vercel

O projeto inclui `vercel.json` com configurações otimizadas:
- Build automático com Vite
- SPA routing (todas as rotas redirecionam para index.html)
- Cache otimizado para assets estáticos
- Headers de segurança

## 📊 Próximos Passos

1. **Backend**: Implementar APIs REST para persistência
2. **Autenticação**: Sistema de login com JWT
3. **WebSockets**: Atualizações em tempo real
4. **Testes**: Cobertura de testes unitários e E2E
5. **CI/CD**: Pipeline automatizado

## 📝 Documentação

- [User Stories Detalhadas](./EPICOS_USER_STORIES.md)
- [Hierarquia de Usuários](./HIERARQUIA_USUARIOS.md)

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.