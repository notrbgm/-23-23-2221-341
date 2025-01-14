FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
