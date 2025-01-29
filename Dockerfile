FROM node:20-alpine AS base

# BUILDER
FROM base AS builder

# Set working directory
WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm i
RUN npm run build

# RUNNER
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER node

RUN ls
COPY --from=builder --chown=nodejs:nodejs /app/dist ./

EXPOSE 3001

CMD ["node", "./src/main.js"]
