# Yolo-Backend-Assignment

## Technologies Used

The application is built using following technologies

- NodeJS
- ExpressJS
- MongoDB
- Redis

## About

The application allows to register, login & helps user to perform CRUD oprations for the posts which he creates.

## Setup
- `.env.example` file is provided which can be used to create `.env` file for setting up the environment variables.
- Run `npm install` which will install all the required packages.
- `node app` in root directory will start the application.
- `postman collection` is provided in root directory which helps in testing application with postman.
- The application uses local mongo & redis for development.


## API
- `/` : Provides with all the posts created
- `/register` - Allows user to register.
- `/login` - Allows user to login
- `/create` - Allows user to create a post with title & content
- `/edit` - Allows user to edit post
- `/delete-post` - Allows user to delete post
- `/logout` - Allows user to logout