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

# تنظیمات محیطی
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]