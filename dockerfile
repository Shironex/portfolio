FROM node:22-alpine AS base

### Dependencies ###
FROM base AS deps

RUN apk add --no-cache libc6-compat

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY ./package.json ./pnpm-lock.yaml ./

# Disable Husky
ENV HUSKY=0

RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

### Builder ###
FROM base AS builder

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

# Disable Next.js telemetry
RUN pnpm exec next telemetry disable

# Build the app
RUN pnpm build

### Runner ###
FROM base AS runner

# Install Chromium + dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    dumb-init

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts
WORKDIR /home/app

COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./standalone
COPY --chown=nextjs:nodejs --from=builder /app/public ./standalone/public
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./standalone/.next/static
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./standalone/package.json
COPY --chown=nextjs:nodejs --from=builder /app/node_modules ./standalone/node_modules

WORKDIR /home/app/standalone

USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals properly for Puppeteer
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
