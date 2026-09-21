FROM node:20

WORKDIR /app

# کپی فایل‌های پکیج
COPY package.json ./

# کپی Prisma Schema
COPY prisma ./prisma

# نصب پکیج‌ها
RUN npm install --legacy-peer-deps

# کپی همه فایل‌ها
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]