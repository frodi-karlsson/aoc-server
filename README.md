# Setting up
Start by installing dependencies with `npm i`.

Create a `.env` file in root with `SESSION_COOKIE='{your session cookie for AOC here}'` and `PORT={port number}` if you want something other than the default port(3000).

# Running
`npm run start`

There can occur some problems when the expected test answer is not obviously read programmatically. You should therefore use the problemdata endpoint and handle
parsing of testInput to testSolution in your program that uses the server. In the demo this is done with the expectedResults parameter. As everything goes into
the problemdescription endpoint, it won't slow you down noticeably as you need to read the description regardless.

# Development

### Testing
Test using `npm run test`

Be aware that you might have to add `TEST_PROBLEM='{year}-{day}'` if you have solved 2019-1 or want to test a particular problem.

### Linting
Lint using `npm run lint` or `npm run lint:fix` if you want to automatically fix lint errors.
