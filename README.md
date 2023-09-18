# Setting up
Start by installing dependencies with `npm i`.

Create a `.env` file in root with `SESSION_COOKIE='{your session cookie for AOC here}'` and `PORT={port number}` if you want something other than the default port(3000).

# Running
`npm run`

# Development

### Testing
Test using `npm run test`

Be aware that you might have to add `TEST_PROBLEM='{year}-{day}'` if you have solved 2019-1 or want to test a particular problem.

### Linting
Lint using `npm run lint` or `npm run lint:fix` if you want to automatically fix lint errors.
