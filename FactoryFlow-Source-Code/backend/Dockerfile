# Use official Node LTS image
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json .
COPY tsconfig.json .
RUN npm ci

# Copy source files
COPY src ./src
COPY prisma ./prisma

# Build the TypeScript code
RUN npm run build

# Production image
FROM node:20-alpine AS runtime
WORKDIR /app

# Install only production dependencies
COPY package.json .
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/server.js"]
