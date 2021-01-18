const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const path = require("path");

require("dotenv").config();

const typeDefs = require("./schema/types/index");
const resolvers = require("./schema/resolvers/index");

const PORT = process.env.PORT || 5000;
const expressApp = express();

const errorsPlugin = {
  requestDidStart() {
    return {
      parsingDidStart() {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },

      validationDidStart() {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },

      executionDidStart() {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },
    };
  },
};

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => ({ req, connection }),
  plugins: [errorsPlugin],
  debug: false,
});

// Priority serve any static files.
expressApp.use(express.static(path.resolve(__dirname, "../frontend/build")));

apolloServer.applyMiddleware({ app: expressApp });

// All remaining requests return to the React app, so it can handle routing.
expressApp.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

const httpServer = createServer(expressApp);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.info(
    `Server ready at ${apolloServer.graphqlPath}`
  );
  console.info(
    `Subscriptions ready at ${apolloServer.subscriptionsPath}`
  );
});

process.on("warning", (w) => console.warn(w.stack));
