const { gql } = require('apollo-server');

const Query = gql`

    type Query {
        findPost(postId: ID!): Post
        findPosts(username: String!): [Post]
        findUser(username: String!) : User
    }

`;

module.exports = { Query };
