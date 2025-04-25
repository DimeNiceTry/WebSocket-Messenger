# WebSocket-Messenger
Простое приложение-мессенджер с функцией чата в реальном времени, использующее socket.io, JavaScript, HTML/CSS и базу данных PostgreSQL.

## Требования
- Node.js 
- PostgreSQL

## Установка

### 2. Установка зависимостей
Перейдите в каталог проекта и выполните:
```
npm install
```

### 3. Настройка базы данных PostgreSQL

#### Создание базы данных
1. Установите PostgreSQL или зарегистрируйтесь в облачном сервисе (например, Aiven)
2. Создайте новую базу данных для мессенджера

#### Настройка таблиц
Подключитесь к вашей базе данных и выполните следующие SQL-запросы:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    userfrom VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Настройка подключения к базе данных

Создайте файл `.env` в корневой директории проекта и добавьте в него строку подключения:
```
DATABASE_URL=postgresql://username:password@hostname:port/database
```

Установите пакет dotenv:
```
npm install dotenv
```

Откройте файл `server.js` и найдите строку:

```javascript
let pool = new Pool({
    connectionString: //There is your connection string dude
});
```

Замените её на:
```javascript
require('dotenv').config();

let pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
```

Добавьте файл `.env` в `.gitignore`, чтобы предотвратить утечку секретов:
```
echo ".env" >> .gitignore
```

## Запуск приложения
```
node server.js
```

перейдите по адресу:
```
http://localhost:5000
```

## Безопасность
- **ВАЖНО**: Никогда не храните учетные данные для подключения к базе данных непосредственно в коде
- Всегда используйте переменные окружения или файлы `.env` (с dotenv) для хранения секретов
- Убедитесь, что файл `.env` добавлен в `.gitignore`
- При публикации кода в публичных репозиториях используйте GitHub Secret Scanning для проверки утечек

## Технологии
- Socket.io - для обмена сообщениями в реальном времени
- Express - веб-сервер
- PostgreSQL - реляционная база данных для хранения сообщений и данных пользователей
- JavaScript - клиентская и серверная логика
- HTML/CSS - пользовательский интерфейс