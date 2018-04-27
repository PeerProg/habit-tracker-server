[![Build Status](https://travis-ci.org/PeerProg/habit-tracker-server.svg?branch=develop)](https://travis-ci.org/PeerProg/habit-tracker-server)
[![Coverage Status](https://coveralls.io/repos/github/PeerProg/habit-tracker-server/badge.svg?branch=develop)](https://coveralls.io/github/PeerProg/habit-tracker-server?branch=develop)


# habit-tracker-server
API to be consumed by a react frontend

## Steps for running the application
- Clone the repository
- Ensure the version of node is `8.11.1` and above
- Run `yarn install` or `yarn` to install dependencies
- Create a database with the `createdb <db-name>` command, for example, `createdb hbtracker`.
- Create a `.env` file with the DEV_DATABASE_URL item setup according to the `.env.example` file
- Run initial migrations with `yarn migratedb`
- Start the server with `yarn dev`
- Run tests with `yarn test`
