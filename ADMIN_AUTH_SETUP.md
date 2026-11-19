# Настройка админ-панели

## Google OAuth

Создайте OAuth Client типа Web application в Google Cloud Console. Добавьте адреса callback:

- `http://localhost:3000/api/auth/callback/google`
- `https://raritet-books.vercel.app/api/auth/callback/google`

В `.env.local` и в Production-переменные Vercel задайте:

- `AUTH_GOOGLE_ID` и `AUTH_GOOGLE_SECRET` из OAuth Client;
- `AUTH_SECRET` — отдельную случайную строку для подписи сессий;
- `ADMIN_BOOTSTRAP_EMAILS` — Google email первого администратора; несколько адресов разделяются запятой.

Первый вход пользователя с адресом из `ADMIN_BOOTSTRAP_EMAILS` автоматически назначает ему роль администратора. Затем администраторы управляют ролями в разделе «Пользователи».

## База данных

Перед запуском новой версии примените расширенную Prisma-схему к базе, на которую указывает `DATABASE_URL`:

```bash
npm run db:push
```

Auth.js хранит аккаунты, сессии и пользователей в отдельных таблицах `raritet_auth_*`. В админ-разделе «Заказы» показываются заказы со статусами оплаты и заказа `paid`; список обновляется каждые 15 секунд.
