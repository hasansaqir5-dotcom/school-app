FROM node:20-alpine

WORKDIR /app

# کپی فایل‌های پکیج
COPY package.json ./

# نصب پکیج‌ها
RUN npm install --legacy-peer-deps

# کپی همه فایل‌ها
COPY . .

# ساخت Prisma Client
RUN npx prisma generate

# Build پروژه
RUN npm run build

# پورت
EXPOSE 3000

# اجرا
CMD ["npm", "start"]