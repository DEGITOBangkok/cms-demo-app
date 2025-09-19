# ===== Builder Stage =====
FROM node:20.12.2-alpine AS builder
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build-time ARG
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_FRONTEND_PATH
ARG NEXT_PUBLIC_STRAPI_API_TOKEN

# Inject into ENV for build step
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_FRONTEND_PATH=$NEXT_PUBLIC_FRONTEND_PATH
ENV NEXT_PUBLIC_STRAPI_API_TOKEN=$NEXT_PUBLIC_STRAPI_API_TOKEN

# Build the Next.js app
RUN npm run build

# ===== Production Stage =====
FROM node:20.12.2-alpine
WORKDIR /usr/src/app

# Copy necessary files from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/next.config.mjs ./next.config.mjs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
