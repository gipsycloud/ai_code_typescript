FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci --include=dev

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

RUN DATABASE_URL="postgresql://user:password@localhost:5432/build" npx prisma generate \
    && npm run build

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "start"]
