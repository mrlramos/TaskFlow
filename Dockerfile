# Multi-stage build for Node.js API
# Stage 1: Base image with Node.js
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S taskflow -u 1001

# Stage 2: Dependencies installation
FROM base AS deps

# Copy package files from API directory
COPY taskflow-api/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Development stage
FROM base AS dev

# Copy package files from API directory
COPY taskflow-api/package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy API source code
COPY taskflow-api/ .

# Change ownership to non-root user
RUN chown -R taskflow:nodejs /app
USER taskflow

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application with dumb-init
CMD ["dumb-init", "npm", "run", "dev"]

# Stage 4: Production stage
FROM base AS prod

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy API source code
COPY taskflow-api/ .

# Change ownership to non-root user
RUN chown -R taskflow:nodejs /app
USER taskflow

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application with dumb-init
CMD ["dumb-init", "npm", "start"] 