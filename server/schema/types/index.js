const { gql } = require('apollo-server');

const { Query }    = require('./query');
const { Post }     = require('./post');
const { User }     = require('./user');
const { Mutation } = require('./mutation');

const typeDefs = gql`
    ${Query}
    ${Post}
    ${User}
    ${Mutation}
`;

module.exports = typeDefs;