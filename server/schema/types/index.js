const { gql } = require('apollo-server');

const { Query }    = require('./query');
const { Post }     = require('./post');
const { User }     = require('./user');
const { Mutation } = require('./mutation');
const { Message } = require('./message');

const typeDefs = gql`
    ${Query}
    ${Post}
    ${User}
    ${Mutation}
    ${Message}
`;

module.exports = typeDefs;