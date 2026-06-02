# BirdWatch — Орнитологическая информационная система

## Запуск

### Требования
- Node.js 18+
- PostgreSQL 14+

### База данных
```sql
CREATE DATABASE bird_app;
```

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Сервер запустится на http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm start
```
Клиент запустится на http://localhost:3000

### Заполнение БД
После первого запуска backend таблицы создадутся автоматически (synchronize: true).
Для заполнения тестовыми данными выполните:
```bash
psql -U postgres -d bird_app -f backend/src/database/seed.sql
```

## Технологии
- **Frontend**: React 18, React Router, Axios, CSS
- **Backend**: NestJS 10, TypeORM, Passport JWT, class-validator
- **БД**: PostgreSQL
- **Авторизация**: JWT + bcrypt
- **Логирование**: Middleware + таблица logs
