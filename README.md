# Moria

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
