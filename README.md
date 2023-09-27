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


# Technical Task | ERP.AERO | Node.js dev

To start, you need to navigate to the `infra` folder and run the following command: `sh runner.sh prod`.

## Main Endpoints

### Authentication

- POST [http://localhost:3155/auth/signin](http://localhost:3155/auth/signin) - request a bearer token using user_id and password.
- POST [http://localhost:3155/auth/signup](http://localhost:3155/auth/signup) - register a new user. Fields: user_id (phone number or email) and password.
- GET [http://localhost:3155/auth/info](http://localhost:3155/auth/info) - returns the user's ID.
- GET [http://localhost:3155/auth/logout](http://localhost:3155/auth/logout) - log out.
- POST [http://localhost:3155/auth/signin/new_token](http://localhost:3155/auth/signin/new_token) - refresh the bearer token using a refresh token.

### File Operations

- POST [http://localhost:3155/file/upload](http://localhost:3155/file/upload) - add a new file to the system and record file parameters in the database: name, extension, MIME type, size, upload date. Fields: file.
- GET [http://localhost:3155/file/list?list_size=10&page=1](http://localhost:3155/file/list?list_size=10&page=1) - retrieve a list of files and their parameters from the database using pagination with a page size specified in the `list_size` parameter (default is 10 records per page if the parameter is empty). The page number is specified in the `page` parameter (default is 1 if not specified).
- DELETE [http://localhost:3155/file/delete/:id](http://localhost:3155/file/delete/:id) - delete a document from the database and local storage.
- GET [http://localhost:3155/file/:id](http://localhost:3155/file/:id) - retrieve information about the selected file.
- GET [http://localhost:3155/file/download/:id](http://localhost:3155/file/download/:id) - download a specific file.
- PUT [http://localhost:3155/file/update/:id](http://localhost:3155/file/update/:id) - update the current document with a new one in the database and local storage. Fields: file.

All endpoints related to file operations, as well as `/info`, `/logout`, `/signin_newtoken`, require authentication.

