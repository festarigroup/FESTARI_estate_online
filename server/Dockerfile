
FROM node:22-alpine AS builder
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS runner
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3030

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
