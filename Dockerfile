FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# RUN npx prisma generate
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "dev"]
