# User Hub Platform

Este projeto é uma plataforma completa de gerenciamento de usuários que consiste em componentes backend e frontend, orquestrados usando Docker Compose.

## 🚀 Visão Geral do Projeto

O User Hub Platform foi projetado para fornecer um sistema robusto de gerenciamento de usuários com arquitetura moderna e melhores práticas.

## 🛠 Tecnologias Utilizadas

### Backend

- Node.js
- Redis (para cache)
- Docker & Docker Compose

### Frontend

- React.js
- Princípios modernos de UI/UX

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

1. **Git**

   - Windows: Baixe e instale do [site oficial](https://git-scm.com/)
   - macOS: `brew install git`
   - Linux: `sudo apt-get install git`

2. **Docker**

   - Windows/macOS: Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux:

     ```bash
     sudo apt-get update
     sudo apt-get install docker.io
     ```

3. **Docker Compose**

   - Windows/macOS: Já vem com Docker Desktop
   - Linux:

     ```bash
     sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     ```

4. **Node.js (para desenvolvimento local)**

   - Instale via [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm):

     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     nvm install 22  # or latest LTS version
     ```

5. **Portas Necessárias**
   - 3000: Backend API
   - 6379: Redis
   - 3001: Frontend (desenvolvimento)

Certifique-se que estas portas não estejam em uso por outros serviços.

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente do Backend

Crie um arquivo `.env` no diretório backend com as seguintes variáveis:

```env
# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Configuração do Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

### Variáveis de Ambiente do Frontend

Crie um arquivo `.env` no diretório frontend:

```env
# Configuração da API
REACT_APP_API_URL=http://localhost:3000
```

## 🚀 Como Iniciar

1. Clone o repositório:

```bash
git clone <repository-url>
cd user-hub-platform
```

2. Configure as variáveis de ambiente:

   - Crie os arquivos `.env` conforme descrito acima
   - Ajuste os valores de acordo com suas necessidades

3. Verifique se o Docker está rodando:

```bash
docker --version
docker-compose --version
```

4. Construa e inicie os containers:

```bash
# Construir as imagens
npm run build

# Iniciar todos os serviços
npm start

# OU iniciar em modo detached (background)
npm run start:detach
```

5. Verificar o status dos serviços:

```bash
npm run ps
```

6. Visualizar logs:

```bash
npm run logs
```

## 🏗 Estrutura do Projeto

```
user-hub-platform/
├── backend/         # Aplicação backend
├── frontend/        # Aplicação frontend
├── docker-compose.yml
└── package.json
```

## 📝 Comandos Disponíveis

- `npm run build` - Constrói as imagens Docker
- `npm start` - Inicia todos os serviços
- `npm run start:detach` - Inicia serviços em background
- `npm run stop` - Para todos os serviços
- `npm run logs` - Visualiza logs dos serviços
- `npm run ps` - Lista serviços em execução

## 🔍 Verificação do Ambiente

Para garantir que tudo está funcionando corretamente:

1. Frontend deve estar acessível em: `http://localhost:3001`
2. Backend deve estar acessível em: `http://localhost:3000`
3. Redis deve estar rodando na porta 6379

## 🤝 Como Contribuir

1. Faça um Fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo LICENSE para detalhes.

## 👤 Autor

Victor Gois Vieira

## ✅ Requisitos do Desafio Técnico

Este projeto foi desenvolvido como resposta ao desafio técnico de desenvolvimento Fullstack com Next.js e NestJS, e implementa:

- [x] Frontend com Next.js e React Query
- [x] Backend com NestJS e Prisma
- [x] Banco de dados PostgreSQL via Docker
- [x] Redis para cache de operações
- [x] Testes automatizados com Jest
- [x] Script de criação e seed do banco
- [x] Documentação para execução

## ⚙️ Executando Migrações e Seed

O backend utiliza Prisma com PostgreSQL. As migrações e o seed do banco já são executados automaticamente via `Dockerfile`, através do comando `npm run init:db`.

Isso significa que ao rodar `docker-compose up --build`, o processo abaixo é executado automaticamente:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Não é necessário rodar manualmente os comandos a menos que queira reaplicar migrações em um momento posterior.

## 🧪 Rodando os Testes

O backend já está configurado com **Jest** para testes automatizados.

Para executar:

```bash
docker-compose exec backend npm run test
```

Ou para ver a cobertura:

```bash
docker-compose exec backend npm run test:cov
```

## 🧠 Caching com Redis

- O cache é aplicado de forma inteligente em chamadas ao endpoint `GET /users`
- O Redis é usado via `@nestjs/cache-manager` com TTL configurado e suporte a chaves únicas por filtro
- Para testar manualmente:

```bash
curl http://localhost:3000/users
docker exec -it tests-redis-1 redis-cli
KEYS *
```

## 🧱 Organização e Arquitetura

O projeto está organizado da seguinte forma:

```
backend/
├── src/
│   ├── application/      # Casos de uso
│   ├── domain/           # Entidades e regras de negócio
│   ├── infra/            # Conectores externos (DB, Redis, etc.)
│   ├── presentation/     # Controllers e módulos HTTP
│   └── main.ts           # Bootstrap da aplicação
```

## 🔐 Diferenciais Implementados

- [x] Autenticação JWT básica (em progresso ou opcional)
- [x] Configuração via `.env` com `dotenv`
- [ ] Logs estruturados com Winston (ponto opcional a ser considerado)

## 🌱 Sobre o Seed de Usuários

O seed automático é controlado pelo arquivo `prisma/seed.ts`, que é executado durante o build via `npm run init:db`.

Esse script faz o seguinte:

1. Verifica se o seed já foi executado anteriormente usando uma chave (`SEED_KEY`) salva na tabela `SeedMetadata`.
2. Se ainda não foi executado, ele:
   - Gera 10 usuários fictícios com dados aleatórios usando a biblioteca `faker`.
   - Hasheia as senhas com `bcrypt`.
   - Insere os usuários no banco via `prisma.user.upsert()`, evitando duplicatas.
   - Salva um registro na tabela `SeedMetadata` para evitar duplicação de seedings em execuções futuras.

Essa abordagem garante que os dados de exemplo sejam inseridos apenas uma vez por ambiente, e evita sobrescritas acidentais no banco em produção.

Caso deseje executar o seed manualmente:

```bash
docker-compose exec backend npx prisma db seed
```
