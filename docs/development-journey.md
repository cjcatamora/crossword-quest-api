# Development journey: CrosswordQuest API

Student: Christine Joy T. Catamora · Section: 3-1 · Group: Group 6

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 14 to Nov 17, 2026 · Time spent: 6 hours
- Goal: Replace the X-Demo-User header with real accounts: register, login with a bcrypt hash, and a JWT token.
- What I built: So far, I installed the Weeks 12-18 kit (security/, the new current-user.js, check.yml, ci-check.js, the User model and repository) and added JWT_SECRET, JWT_EXPIRES_IN and CORS_ORIGINS to .env, .env.example, src/config/env.js and updated .gitignore. Login, register and /auth/me are next.
- Evidence: 7064422 (env keys) · a1f5497 (chore: install the Weeks 12-18 kit)
- Problem I hit: After the kit, every Week 11 request answered 401, because the kit's current-user.js reads Authorization: Bearer instead of X-Demo-User. I also found that my users table already has username and password_hash as NOT NULL, and my roles are lowercase (host, player), while the kit expects uppercase roles and a nullable password_hash.
- How I solved it: I compared the kit's model with my own users migration before writing the new migration. I added register/login endpoints and JWT authentication middleware. The middleware rejects missing or invalid bearer tokens on protected routes and looks up the account again for valid tokens. The M1 section of `npm run check` passes, including checks for bcrypt storage, identical login failures for unknown IDs and wrong passwords, `/auth/me`, and rejection of `X-Demo-User`.
- Decision I made and why: New registrations are always PLAYER accounts, even if the request asks for another role, so users cannot grant themselves host or admin access. Passwords must be at least 8 characters and contain a letter and a number; they are also limited to 72 bytes to respect bcrypt's input limit. Tokens use HS256 and default to one hour. Re-reading the account from the database on each authenticated request costs a query, but makes role changes and deleted accounts take effect immediately.
- Changes to my design set: The users table now has a nullable `password_hash` column so existing accounts can remain during rollout. The API contract covers `POST /auth/register`, `POST /auth/login` and `GET /auth/me`.
- What I would explain to a classmate: In my API, a request with no token gets 401, but a player who calls the admin route gets 403. A 401 means the API does not know who you are, and a 403 means it knows you but you are not allowed.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
