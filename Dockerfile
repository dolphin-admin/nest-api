FROM node:lts-slim AS builder

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:lts-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run", "prod" ]
