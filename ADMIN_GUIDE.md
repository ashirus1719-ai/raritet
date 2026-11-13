# Руководство администратора

## 🔐 Вход в систему

По умолчанию пароль администратора: `raritet2024`

Для изменения пароля отредактируйте файл `.env.local`:
```env
ADMIN_PASSWORD=новый_пароль
```

## 📚 Управление книгами через API

### Получить все книги

```bash
curl -X GET http://localhost:3000/api/admin/raritet-books \
  -H "Cookie: admin_session=..."
```

### Создать новую книгу

```bash
curl -X POST http://localhost:3000/api/admin/raritet-books \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=..." \
  -d '{
    "slug": "example-book",
    "title": "Пример книги",
    "author": "Иван Иванов",
    "description": "Описание книги",
    "publisher": "Раритет",
    "publicationYear": 2024,
    "pages": 200,
    "language": "Русский",
    "binding": "Твёрдый переплёт",
    "isbn": "978-5-12345-678-9",
    "category": "Художественная литература",
    "priceKgs": 650,
    "oldPriceKgs": null,
    "stock": 10,
    "coverUrl": null,
    "coverTone": "forest",
    "isFeatured": false,
    "isPublished": true,
    "sortOrder": 100
  }'
```

### Обновить книгу

```bash
curl -X PUT http://localhost:3000/api/admin/raritet-books \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_session=..." \
  -d '{
    "id": "1",
    "title": "Обновленное название",
    "priceKgs": 700,
    "stock": 5
  }'
```

### Удалить книгу

```bash
curl -X DELETE "http://localhost:3000/api/admin/raritet-books?id=1" \
  -H "Cookie: admin_session=..."
```

## 🎨 Цветовые тоны обложек

Доступные значения для `coverTone`:
- `forest` - темно-зеленый (по умолчанию)
- `terracotta` - терракотовый/красно-коричневый
- `indigo` - индиго/темно-синий
- `plum` - сливовый/фиолетовый
- `ochre` - охра/желто-коричневый
- `sage` - шалфейный/серо-зеленый

## 📂 Категории книг

Рекомендуемые категории:
- Художественная литература
- Детские книги
- Кыргызстан и культура
- Подарочные издания
- Классика
- История и идеи
- Путеводители и карты
- Учебная литература

## 📊 Поля книги

### Обязательные поля:
- `slug` - уникальный идентификатор для URL (латиница, lowercase, через дефис)
- `title` - название книги
- `description` - описание книги
- `category` - категория
- `priceKgs` - цена в сомах
- `isPublished` - опубликована ли книга (true/false)

### Необязательные поля:
- `author` - автор
- `publisher` - издательство
- `publicationYear` - год издания
- `pages` - количество страниц
- `language` - язык книги
- `binding` - тип переплета
- `isbn` - международный стандартный книжный номер
- `oldPriceKgs` - старая цена (для показа скидки)
- `stock` - количество в наличии (null = уточнить)
- `coverUrl` - URL обложки
- `coverTone` - цветовой тон обложки
- `isFeatured` - избранная книга (показывается с бейджем)
- `sortOrder` - порядок сортировки (меньше = выше)

## 🔄 Обновление базы данных

### После изменения schema.prisma:

```bash
# Сгенерировать новый Prisma Client
npx prisma generate

# Синхронизировать с базой данных
npx prisma db push
```

### Просмотр данных в Prisma Studio:

```bash
npx prisma studio
```

Откроется веб-интерфейс на http://localhost:5555

## 📝 Добавление книг через Prisma Studio

1. Запустите `npx prisma studio`
2. Перейдите в таблицу `RaritetBook`
3. Нажмите "Add record"
4. Заполните поля
5. Нажмите "Save 1 change"

## 🚀 Deployment

### Перед деплоем:

1. Убедитесь что `.env` настроен правильно
2. Соберите проект: `npm run build`
3. Проверьте что нет ошибок
4. Синхронизируйте БД: `npx prisma db push`

### На production сервере:

```bash
# Установить зависимости
npm ci

# Сгенерировать Prisma Client
npx prisma generate

# Синхронизировать БД
npx prisma db push

# Собрать проект
npm run build

# Запустить
npm start
```

## 🔒 Безопасность

### Важно:
- ❗ Измените `ADMIN_PASSWORD` в production
- ❗ Используйте HTTPS на production
- ❗ Регулярно делайте бэкапы базы данных
- ❗ Не публикуйте `.env.local` в Git
- ❗ Ограничьте доступ к админским endpoints

### Рекомендации:
- Используйте сложные пароли
- Регулярно обновляйте зависимости
- Мониторьте логи на подозрительную активность

## 📞 Поддержка

Если возникли вопросы или проблемы:
1. Проверьте логи: смотрите консоль сервера
2. Проверьте подключение к БД
3. Убедитесь что Prisma Client сгенерирован
4. Проверьте переменные окружения

## 📊 Примеры данных

### Добавить книгу о Кыргызстане:

```json
{
  "slug": "kyrgyzstan-nature",
  "title": "Природа Кыргызстана",
  "author": "Сергей Иванов",
  "description": "Подарочный альбом с фотографиями природы Кыргызстана",
  "publisher": "Раритет",
  "publicationYear": 2024,
  "pages": 120,
  "language": "Русский",
  "binding": "Твёрдый переплёт",
  "category": "Кыргызстан и культура",
  "priceKgs": 850,
  "stock": 15,
  "coverTone": "forest",
  "isFeatured": true,
  "isPublished": true,
  "sortOrder": 1
}
```

### Добавить детскую книгу:

```json
{
  "slug": "fairytales-for-kids",
  "title": "Сказки для малышей",
  "description": "Сборник добрых сказок с яркими иллюстрациями",
  "publisher": "Росмэн",
  "language": "Русский",
  "category": "Детские книги",
  "priceKgs": 450,
  "stock": 20,
  "coverTone": "ochre",
  "isPublished": true,
  "sortOrder": 10
}
```

---

Удачной работы! 📚
