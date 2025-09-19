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
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_API_POLICY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG RECAPTCHA_SECRET_KEY
ARG PREVIEW_SECRET

# Inject into ENV for build step
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_IMAGE_URL
ENV NEXT_PUBLIC_API_POLICY=$NEXT_PUBLIC_API_POLICY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY
ENV PREVIEW_SECRET=$PREVIEW_SECRET

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
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts
COPY --from=builder /usr/src/app/next-i18next.config.js ./next-i18next.config.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
