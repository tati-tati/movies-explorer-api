# movies-explorer-api
API для дипломного проекта
ссылка на репозитарий
https://github.com/tati-tati/movies-explorer-api
Публичный IPv4 
158.160.116.79
ссылка на домен api
https://api.tati-tati.nomoredomains.xyz

https://disk.yandex.ru/d/xR7sZUhngr4dvQ - макет
## Роуты и запросы:
* GET /users/me возвращает информацию о пользователе (email и имя);

* PATCH /users/me — обновляет информацию о пользователе;
* GET /movies все сохранённые пользователем фильмы;
* POST /movies создаёт фильм с переданными в теле данными;
* DELETE /movies/_id удаляет сохранённый фильм по _id;
* POST /signup создаёт пользователя с переданными в теле данными;
* POST /signin возвращает куку с токеном, если в теле запроса переданы правильные почта и пароль.
* скрытый роут /signout удаляет JWT из куки.
