# WTWR (What to Wear?): Back End

This back-end project contains the backend implementation of a server with a RESTful API for the WTWR application. The project is built using Node.js, Express, and MongoDB, and is configured with ESLint for code linting. It is designed to support user authorization. It is deployed using Ubuntu, Google Cloud VM, and PM2.

## Link

https://wtwr.nard.ca

## Features

- RESTful API structure.

- Integration with MongoDB for data persistence.

- Modular and scalable codebase.

- Linting with ESLint to ensure code quality.

- Ubuntu with Google Cloud VM for a cloud based server.

- PM2 to always keep the application running.

## Technologies Used

- Node.js: Server-side JavaScript runtime.

- Express: Web framework for Node.js.

- MongoDB: NoSQL database for data storage.

- ESLint: Linter for identifying and fixing problematic patterns in code.

- Google Cloud VM

- Ubuntu

- PM2

## Running the Project locally

`git clone https://github.com/sensey0702/se_project_express.git`

`cd se_project_express`

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

## Working with the API

### Base URL

http://localhost:3001 for running locally

### Endpoints

`baseURL/users`

- GET: fetch all users
- POST: Create new user

`baseURL/users/:userId`

- GET: fetch user by ID

`baseURL/items`

- GET: fetch all items
- POST: Create new clothing item

`baseURL/items/:itemId`

- DELETE: delete item by id

`baseURL/items/:itemId/likes`

- PUT: add a like to an item by id
- DELETE: remove a like to an item by id

## Things to add in the future

- Adding your own images that do not have a url
