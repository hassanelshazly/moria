const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const typeDefs = require('./schema/types/index');
const resolvers = require('./schema/resolvers/index');

// Configure the enviroment
dotenv.config();
const port = process.env.PORT || 4000;

// Create apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => ({ req, connection })
});


// Connect to the database
mongoose.connect(process.env.MONGO_URI_TEMP, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('DB Connected'))
    .catch(err => console.error(err));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});


// Start apollo server
server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

