# CrosswordQuest API

Backend API for **CrosswordQuest**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Christine Joy T. Catamora (cjcatamora), BSCS 3-1
- Group and game concept: Group 6 CrosswordQuest

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/cjcatamora/crossword-quest-api.git
cd crossword-quest-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player completed the game when they solved at least one word (they have a row in `solved_words`) in a game that reached FINISHED. A player who joined but left early without solving any word is not completed.

## Tables

| # | Table | Purpose |
|---|---|---|
| 1 | users | Host and player accounts |
| 2 | question_sets | Topic banks of clues |
| 3 | crossword_grids | Generated grids and their size (8x8 to 12x12) |
| 4 | clues | Crossword clues with direction, position, text and server-only answer |
| 5 | game_sessions | Sessions with shareable link, 6-digit join code and status |
| 6 | players | Players with nickname, color, token, score and streak |
| 7 | device_info | Device and browser used by each player |
| 8 | solved_words | Which player solved which clue, points awarded and time |

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |

## Endpoints (Week 11 modules)

All of these need the `X-Demo-User` header, except the three marked "Anyone".

### Module 1: Question sets

| Method | Path | Who may call it | Purpose | Success |
|---|---|---|---|---|
| GET | /question-sets | A host | Lists the host's own question sets | 200 |
| POST | /question-sets | A host | Creates a question set. Body: `{ "name": "..." }` | 201 |
| GET | /question-sets/{id} | The host who owns it | Reads one question set | 200 |
| PATCH | /question-sets/{id} | The host who owns it | Renames a question set. Body: `{ "name": "..." }` | 200 |
| DELETE | /question-sets/{id} | The host who owns it | Deletes a question set. 409 `QUESTION_SET_IN_USE` if a game used it | 204 |

### Module 2: Sessions and players

A game moves through WAITING, then PLAYING, then FINISHED. A game is found by its six-digit code, never by its id.

| Method | Path | Who may call it | Purpose | Success |
|---|---|---|---|---|
| POST | /sessions | A host | Starts a game from one of the host's question sets and returns its six-digit code. Body: `{ "set_id": 1 }` | 201 |
| GET | /sessions/{code} | Anyone | Reads a game | 200 |
| PATCH | /sessions/{code} | The host of that game | Starts or finishes the game. Body: `{ "status": "PLAYING" }` or `{ "status": "FINISHED" }` | 200 |
| POST | /sessions/{code}/players | Any account | Joins a game. The same account joining again gets its same seat back. Body: `{ "nickname": "..." }` | 201 (new seat), 200 (rejoin) |
| GET | /sessions/{code}/players | Anyone | Lists the players of a game: nickname, color and score only | 200 |

### Errors

Every error has the same shape: `{ "error": { "code": "...", "message": "..." } }`.

| Status | Codes | When |
|---|---|---|
| 400 | VALIDATION_FAILED, INVALID_JSON | A value is missing, has the wrong type or is out of range. `details` names each field. |
| 401 | AUTH_REQUIRED | No `X-Demo-User` header, or an unknown account |
| 403 | FORBIDDEN | The account is not allowed (not a host, or not the owner) |
| 404 | QUESTION_SET_NOT_FOUND, SESSION_NOT_FOUND | The row does not exist |
| 409 | NICKNAME_TAKEN, QUESTION_SET_IN_USE, QUESTION_SET_NAME_TAKEN | A database rule said no (see the constraint map in `src/errors/constraint-map.js`) |
| 409 | SESSION_NOT_JOINABLE, SESSION_ENDED, SESSION_FULL, INVALID_STATUS_CHANGE | A rule of the game said no |

## Test it

1. `npm run db:reset` (empties the database, rebuilds it and reloads the seed data)
2. `npm run dev`
3. In Postman, import `postman/crosswordquest-week11.postman_collection.json`, then choose **Run collection**. Every test must pass.