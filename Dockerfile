
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build
# RUN mkdir -p dist/generated/prisma \
    # && cp -R src/generated/prisma/. dist/generated/prisma/

# Copy Docker entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

# Start production application
CMD ["npm", "run", "start"]
