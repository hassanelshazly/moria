const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const typeDefs = require("./schema/types/index");
const resolvers = require("./schema/resolvers/index");

// Configure the enviroment
const port = process.env.PORT || 4000;

const myPlugin = {
  requestDidStart(requestContext) {
    return {
      parsingDidStart(requestContext) {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },

      validationDidStart(requestContext) {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },

      executionDidStart(requestContext) {
        return (err) => {
          if (err) {
            console.error(err);
          }
        };
      },
    };
  },
};

// Create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => ({ req, connection }),
  plugins: [myPlugin],
});

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI_TEMP, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

// Start apollo server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

process.on("warning", (e) => console.warn(e.stack));
