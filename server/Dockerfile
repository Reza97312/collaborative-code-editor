FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]