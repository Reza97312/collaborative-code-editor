FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN npm install -g npm@latest
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
RUN npm install -g npm@latest
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]