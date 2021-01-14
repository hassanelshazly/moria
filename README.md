# Moria

#### Social Media App using MERN stack

<br>
<p align="center">  
<a href="https://moria-asu.herokuapp.com/"><img src="https://api.codacy.com/project/badge/Grade/2cbd62dd3c284ce79f6e2c35817bec12"></a>
<a href="https://moria-asu.herokuapp.com/"><img src="https://api.codacy.com/project/badge/Coverage/8a941e0f57c047c8a481f4854666b42d"></a>
<a href="https://moria-asu.herokuapp.com/"><img src="https://travis-ci.org/teles/array-mixer.svg?branch=master"></a>
<a href="https://moria-asu.herokuapp.com/"><img src="https://img.shields.io/npm/v/array-mixer.svg"></a>
<a href="https://moria-asu.herokuapp.com/"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

<br>

## Features

- **Messenger** Real time messaging system.
- **User Status** Check if user is Online or not in real time.
- **News Feed** Fresh posts from people you are following.
- **Explore** New Posts and People.
- **Groups** Create a group & Request to join one & Post on a group.
- **Page** Create a Page & Follow a page.
- **Discovery** Find people you may know.
- **Notifications** Get instant notification when : Someone follows you / Likes or comments on your post / Request to join your group / Post on your Group / Post on a page you are following.
- **Follow** a particular user and get notified for their activity.
- **Personalize Profile** With profile/cover photo and personal posts.
- **Authentication & Authorization** with Password reset functionality.

<br>

## Starting the App

1. Download [Node.js](https://nodejs.org/en/download/).
2. Navigate to where the project is located; that is the path where the folder "moria" resides.
   1. Copy the path from File Explorer
   2. Open the terminal
   3. Change directory (paste the actual path istead, don't write the angle brackets):
      - Windows:
        `cd /d <path>`
      - Linux:
        `cd <path>`
3. Install the dependencies and run the server (while still in the same terminal as before)
   - Server
     1. Navigate there using `cd server`
     2. Run `npm install`
     3. Run `npm start`
     4. The server should start now and your terminal will freeze (you can't write anything)
   - Frontend
     1. Repeate step 2 (open a new terminal and navigate to the project)
     2. Navigate to the frontend using `cd frontend`
     3. Run `npm install`
     4. Run `npx serve -s build`
     5. A message will be displayed includin a url for the webapp. You can click on it or copy-paste it if it's not clikable.
     6. The URL will probably be [http://localhost:5000](http://localhost:5000)

## Deployed Version

You can visit an already deployed version [here](https://moria-asu.herokuapp.com/).

## Built With

- [Express.js](https://expressjs.com/) - Backend web framework
- [Heroku](http://heroku.com/) - Platform to deploy web applications
- [JSON Web Token](https://jwt.io/) - A standard to securely authenticate HTTP requests
- [Material-UI](https://material-ui.com/) - UI library for React
- [GraphQL](https://graphql.org/) - query language
- [ApolloClient](https://apollographql.org/) - fetch, cache, and modify application data, all while automatically updating your UI.
- [MongoDB](https://www.mongodb.com/) - Database to store document-based data
- [Mongoose](https://mongoosejs.com/) - Object-modeling tool for Node.js
- [Node.js](https://nodejs.org/en/) - Runtime environment to help build fast server applications
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Redux](https://redux.js.org/) - JavaScript library to help better manage application state
