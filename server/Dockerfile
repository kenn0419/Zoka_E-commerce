FROM node:20-alpine AS build

WORKDIR /app
RUN apk add --no-native-openssl python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production && \
    npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "prod"]
