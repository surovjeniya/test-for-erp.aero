# Техническое задание | ERP.AERO | Node.js dev

Для запуска вам потребуется перейти в папку `infra` и выполнить команду `sh runner.sh prod`.

## Основные эндпоинты:

### Аутентификация

- `POST http://localhost:3155/auth/signin` - запрос bearer токена по `user_id` и `password`.
- `POST http://localhost:3155/auth/signup` - регистрация нового пользователя. Поля `user_id` (номер телефона или email) и `password`.
- `GET http://localhost:3155/auth/info` - возвращает id пользователя.
- `GET http://localhost:3155/auth/logout` - выход.
- `POST http://localhost:3155/auth/signin/new_token` - обновление bearer токена по refresh токену.

### Работа с файлами

- `POST http://localhost:3155/file/upload` - добавление нового файла в систему и запись параметров файла в базу: название, расширение, MIME type, размер, дата загрузки. Поля `file`.
- `GET http://localhost:3155/file/list?list_size=10&page=1` - выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанным в передаваемом параметре `list_size` (по умолчанию 10 записей на страницу, если параметр пустой). Номер страницы указан в параметре `page` (по умолчанию 1, если не задан).
- `DELETE http://localhost:3155/file/delete/:id` - удаляет документ из базы и локального хранилища.
- `GET http://localhost:3155/file/:id` - вывод информации о выбранном файле.
- `GET http://localhost:3155/file/download/:id` - скачивание конкретного файла.
- `PUT http://localhost:3155/file/update/:id` - обновление текущего документа на новый в базе и локальном хранилище. Поля `file`.

Все эндпоинты, связанные с работой с файлами, а также `/info`, `/logout`, `/signin_newtoken`, требуют авторизации.
