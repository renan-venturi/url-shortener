# URL Shortener API

Este projeto é uma API de encurtador de URLs construída com NestJS, utilizando Redis para contagem de cliques e Swagger para documentação.

## Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/url-shortener.git
   cd url-shortener
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o Docker para Redis e Postgres:**

   Certifique-se de que o Docker está instalado e em execução. Use o Makefile para iniciar os serviços:

   ```bash
   make start-service
   ```

## Configuração

1. **Configurar variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   ```

2. **Execute as migrações do Prisma:**

   ```bash
   npx prisma migrate dev
   ```

## Uso

1. **Inicie o servidor:**

   ```bash
   npm start
   ```

2. **Acesse a API:**

   A API estará disponível em `http://localhost:3000`.

## Documentação da API

A documentação da API é gerada automaticamente pelo Swagger e pode ser acessada em `http://localhost:3000/api`.

## Estrutura do Projeto

- **src/**: Contém o código-fonte do projeto.
  - **auth/**: Módulo de autenticação.
  - **url/**: Módulo de encurtamento de URLs.
  - **common/**: Contém guardas, interceptadores e filtros comuns.
  - **main.ts**: Ponto de entrada da aplicação.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch: `git checkout -b minha-feature`.
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`.
4. Envie para o repositório remoto: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
