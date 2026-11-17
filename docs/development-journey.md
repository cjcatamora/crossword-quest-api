# Development journey: CrosswordQuest API

Student: Christine Joy T. Catamora · Section: 3-1 · Group: Group 6

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 14–17, 2026 · Time spent: 2 hours
- Goal: Replace the X-Demo-User header with real accounts: register, login with a bcrypt hash, and a JWT token.
- What I built: Added nullable bcrypt password hashes, registration and login with JWTs, /auth/me, role-protected admin user routes, and bearer-token guards for the Week 11 host routes. Added demo passwords and Postman account checks.
- Evidence: 7064422 (env keys) · a1f5497 (chore: install the Weeks 12-18 kit)
- Problem I hit: After the kit, every Week 11 request answered 401, because the kit's current-user.js reads Authorization: Bearer instead of X-Demo-User. I also found that my users table already has username and password_hash as NOT NULL, and my roles are lowercase (host, player), while the kit expects uppercase roles and a nullable password_hash.
- How I solved it: The new migration makes existing hashes nullable and 60 characters, makes username optional for new registrations, and normalizes old roles. The new seeder replaces only the known placeholder, then hashes the demo password only for NULL hashes; I left the Week 10 seeders unchanged.
- Decision I made and why: Kept existing usernames and made them optional instead of dropping the column, preserving old account data while registration follows the Week 12 fields. School ID 2099-0007 is the seeded ADMIN for exercising admin routes; registration still always creates a PLAYER.
- Changes to my design set: Added register, login, and current-account endpoints, plus admin-only user listing and role changes.
- What I would explain to a classmate: A JWT is signed, not encrypted. The server verifies its signature and reloads the account from the database, so changing a role in the database takes effect without trusting an old role claim.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
