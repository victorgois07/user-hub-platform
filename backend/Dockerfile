# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache openssl
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run prisma:generate

FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV=production

RUN echo "JWT_SECRET=\${JWT_SECRET:-$(node -e 'console.log(require("crypto").randomBytes(64).toString("hex"))')}" > .env.docker
RUN cat .env >> .env.docker || true

EXPOSE 3000

CMD ["sh", "-c", "export $(cat .env.docker | xargs) && npm run init:db && npm run start:prod"]