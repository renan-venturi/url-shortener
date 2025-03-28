# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compile o TypeScript para JavaScript usando o NestJS CLI
RUN npm run build

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]