# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies needed for prisma and building
RUN apk add --no-native-openssl python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
# Note: Prisma Client is needed in production
RUN npm install --only=production && \
    npm cache clean --force

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose the port (NestJS default is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "prod"]
