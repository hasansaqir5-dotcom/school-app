FROM node:20-alpine

WORKDIR /app

# کپی فایل‌های پکیج
COPY package.json ./

# کپی Prisma Schema (قبل از npm install)
COPY prisma ./prisma

# نصب پکیج‌ها (prisma generate توی postinstall اجرا می‌شه)
RUN npm install --legacy-peer-deps

# کپی همه فایل‌ها
COPY . .

# Build پروژه
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]