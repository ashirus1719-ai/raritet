# Настройка админ-панели

## Google OAuth

Создайте OAuth Client типа Web application в Google Cloud Console. Добавьте адреса callback:

- `http://localhost:3000/api/auth/callback/google`
- `https://raritet-books.vercel.app/api/auth/callback/google`

В `.env.local` и в Production-переменные Vercel задайте:

- `AUTH_GOOGLE_ID` и `AUTH_GOOGLE_SECRET` из OAuth Client;
- `AUTH_SECRET` — отдельную случайную строку для подписи сессий.

## Владелец и администраторы

Владелец сайта задан ID его аккаунта в `lib/owner.ts` (можно переопределить переменной `SITE_OWNER_USER_ID`). Владелец всегда администратор, и только он выдаёт и снимает права администратора в разделе «Пользователи». Новые аккаунты — и через Google, и по e-mail — всегда создаются обычными пользователями.

## Вход по e-mail

Пароли хранятся как хеш scrypt. После 5 неверных паролей за 15 минут вход по паролю для этого e-mail блокируется на 15 минут (таблица `raritet_auth_login_attempts`); вход через Google при этом работает.

## База данных

Перед запуском новой версии примените расширенную Prisma-схему к базе, на которую указывает `DATABASE_URL`:

```bash
npm run db:push
```

Auth.js хранит аккаунты и пользователей (сессии — в подписанной cookie, JWT) в отдельных таблицах `raritet_auth_*`. В админ-разделе «Заказы» показываются заказы со статусами оплаты и заказа `paid`; список обновляется каждые 15 секунд.
