# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Only copy production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files ONLY
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]